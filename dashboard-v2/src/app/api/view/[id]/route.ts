import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'resume'; // 'resume' or 'cl'
    const download = searchParams.get('download') === '1';
    const format = searchParams.get('format') || 'html'; // 'html' | 'pdf'
    
    // In Next.js 15+, params is a Promise that must be awaited
    const { id } = await params;
    const jobId = id;

    const [job] = await sql`
      SELECT resume_html, cover_letter_html, resume_pdf, cover_letter_pdf
      FROM jobs 
      WHERE id = ${jobId} AND user_id = ${session.user.id}
    `;

    if (!job) {
      return new NextResponse('Job not found', { status: 404 });
    }

    if (format === 'pdf') {
      const pdf = type === 'cl' ? job.cover_letter_pdf : job.resume_pdf;
      if (!pdf) {
        return new NextResponse('PDF not found (run tailor --deep first)', { status: 404 });
      }
      const filename = `career-ops-${type === 'cl' ? 'cover-letter' : 'resume'}-${jobId}.pdf`;
      return new NextResponse(pdf, {
        headers: {
          'Content-Type': 'application/pdf',
          ...(download
            ? { 'Content-Disposition': `attachment; filename="${filename}"` }
            : {}),
        },
      });
    }

    const html = type === 'cl' ? job.cover_letter_html : job.resume_html;

    if (!html) {
      return new NextResponse('Content not found', { status: 404 });
    }

    const filename = `career-ops-${type === 'cl' ? 'cover-letter' : 'resume'}-${jobId}.html`;
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        ...(download
          ? { 'Content-Disposition': `attachment; filename="${filename}"` }
          : {}),
      },
    });
  } catch (error: any) {
    console.error('View Error:', error);
    return new NextResponse('Error loading content', { status: 500 });
  }
}
