import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAX_UPLOAD_BYTES = 12 * 1024 * 1024; // 12MB safety cap (Vercel-friendly)

function ensurePdfJsPolyfills() {
  // pdf.js expects DOMMatrix in some builds; Vercel Node runtime doesn't provide it.
  const g: any = globalThis as any;
  if (typeof g.DOMMatrix === 'undefined') {
    class DOMMatrixPolyfill {
      a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
      constructor(init?: any) {
        // Accept [a,b,c,d,e,f] or {a,b,c,d,e,f}
        if (Array.isArray(init) && init.length >= 6) {
          [this.a, this.b, this.c, this.d, this.e, this.f] = init.slice(0, 6).map(Number);
        } else if (init && typeof init === 'object') {
          this.a = Number(init.a ?? this.a);
          this.b = Number(init.b ?? this.b);
          this.c = Number(init.c ?? this.c);
          this.d = Number(init.d ?? this.d);
          this.e = Number(init.e ?? this.e);
          this.f = Number(init.f ?? this.f);
        }
      }
      static fromMatrix(init?: any) {
        return new DOMMatrixPolyfill(init);
      }
      multiply(_other: any) {
        // Minimal implementation: enough for pdf.js text extraction paths.
        return new DOMMatrixPolyfill();
      }
      inverse() {
        return new DOMMatrixPolyfill();
      }
      toString() {
        return `matrix(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.e}, ${this.f})`;
      }
    }
    g.DOMMatrix = DOMMatrixPolyfill;
    // Some builds reference DOMMatrixReadOnly too.
    if (typeof g.DOMMatrixReadOnly === 'undefined') g.DOMMatrixReadOnly = DOMMatrixPolyfill;
  }
}

function normalizeText(input: string) {
  return (input || '')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractSection(text: string, heading: RegExp) {
  const m = text.match(heading);
  if (!m || m.index === undefined) return null;
  const start = m.index + m[0].length;
  const rest = text.slice(start);
  const nextHeading = rest.search(/^\s*[A-Z][A-Z &/]{2,}\s*$/m);
  const end = nextHeading >= 0 ? start + nextHeading : text.length;
  return text.slice(start, end).trim();
}

function parseBullets(block: string) {
  const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
  const bullets: string[] = [];
  for (const line of lines) {
    const cleaned = line.replace(/^[-•·\u2022]\s+/, '').trim();
    if (cleaned.length >= 4) bullets.push(cleaned);
  }
  return bullets;
}

function parseExperience(text: string) {
  // Best-effort parser:
  // - split by blank lines
  // - treat first 1-2 lines as "header" then rest as bullets
  const blocks = text.split(/\n{2,}/).map(b => b.trim()).filter(Boolean);
  const out: any[] = [];

  for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) continue;

    const header = lines.slice(0, Math.min(2, lines.length)).join(' — ');
    const bullets = parseBullets(lines.slice(2).join('\n'));

    // Attempt to extract period
    const periodMatch = header.match(/(20\d{2}\s*[-–]\s*(20\d{2}|present|current))/i);
    const period = periodMatch ? periodMatch[1].replace(/\s+/g, ' ') : '';

    // Attempt to split company/role
    let company = '';
    let role = '';
    const parts = header.split('—').map(p => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      company = parts[0];
      role = parts[1];
    } else {
      role = header;
    }

    out.push({
      company,
      role,
      period,
      bullets,
    });
  }
  return out.slice(0, 8);
}

function parseEducation(text: string) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const out: any[] = [];
  for (const line of lines) {
    // Very basic: "Degree, School (2016-2020)"
    const yearMatch = line.match(/(19\d{2}|20\d{2})\s*[-–]\s*(19\d{2}|20\d{2})/);
    out.push({
      degree: line,
      school: '',
      period: yearMatch ? yearMatch[0] : '',
    });
    if (out.length >= 4) break;
  }
  return out;
}

export async function POST(req: NextRequest) {
  let step = 'auth';
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    step = 'imports';
    // Load parsers at runtime to avoid Turbopack/ESM export issues.
    ensurePdfJsPolyfills();
    const pdfParseMod: any = await import('pdf-parse');
    const pdfParse: any = pdfParseMod?.default || pdfParseMod;
    const mammothMod: any = await import('mammoth');
    const mammoth: any = mammothMod?.default || mammothMod;

    step = 'formData';
    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    }

    step = 'readFile';
    const name = file.name || 'resume';
    const lower = name.toLowerCase();
    const bytes = Buffer.from(await file.arrayBuffer());
    if (bytes.byteLength > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: `File too large. Max ${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))}MB` },
        { status: 413 }
      );
    }

    step = 'parse';
    let text = '';
    if (lower.endsWith('.pdf')) {
      // pdf-parse has multiple export shapes across versions.
      // IMPORTANT (Vercel): Always prefer the PDFParse class path with disableWorker=true.
      // The function export path can try to boot a PDF.js worker, which fails in serverless output.
      const PDFParseCtor = pdfParse?.PDFParse || pdfParseMod?.PDFParse;
      if (PDFParseCtor) {
        // pdf-parse@2.x: pass the PDF buffer via constructor options; load() takes no args.
        // IMPORTANT (Vercel): disable PDF.js worker. The worker chunk isn't available in serverless output,
        // which causes "Setting up fake worker failed: Cannot find module ... pdf.worker.mjs".
        const parser = new PDFParseCtor({ data: bytes, disableWorker: true });
        await parser.load();
        const out = await parser.getText();
        text = out?.text || '';
      } else if (typeof pdfParse === 'function') {
        // Fallback: some builds expose a function. This path is less reliable on Vercel.
        // Keep it as a last resort.
        const parsed = await pdfParse(bytes);
        text = parsed?.text || '';
      } else {
        throw new Error(`PDF parser unavailable (exports: ${Object.keys(pdfParseMod || {}).join(', ')})`);
      }
    } else if (lower.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer: bytes });
      text = result.value || '';
    } else {
      return NextResponse.json({ error: 'Unsupported file type (use PDF or DOCX)' }, { status: 400 });
    }

    step = 'postProcess';
    text = normalizeText(text);

    const expSection =
      extractSection(text, /^\s*(PROFESSIONAL EXPERIENCE|EXPERIENCE|WORK EXPERIENCE)\s*$/im) ||
      extractSection(text, /^\s*(EMPLOYMENT)\s*$/im) ||
      '';
    const eduSection =
      extractSection(text, /^\s*(EDUCATION)\s*$/im) ||
      '';

    const experience = expSection ? parseExperience(expSection) : [];
    const education = eduSection ? parseEducation(eduSection) : [];
    const raw_text_preview = text.slice(0, 2500);

    return NextResponse.json(
      {
      ok: true,
      // Back-compat for Dashboard UI: also expose fields at top-level.
      experience,
      education,
      raw_text_preview,
      extracted: {
        experience,
        education,
        raw_text_preview,
      },
      },
      {
        headers: {
          // Lets us confirm Vercel picked up latest deploy.
          'X-CareerOps-ResumeImport-Version': 'disableWorker-v2',
        },
      }
    );
  } catch (e: any) {
    return NextResponse.json(
      {
        error: `Resume import failed at step="${step}": ${e?.message || 'unknown error'}`,
      },
      { status: 500 }
    );
  }

}

