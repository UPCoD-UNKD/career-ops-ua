import { NextRequest } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const q = searchParams.get('q') || ''; // The full command string
  
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const send = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      if (!q) {
        send({ type: 'error', message: 'Empty command' });
        controller.close();
        return;
      }

      // 1. Simple Command Parsing
      const [cmd, ...args] = q.trim().split(/\s+/);
      let scriptName = '';
      let scriptArgs = args;

      if (cmd === 'rank' || cmd === 'offer-list') {
        scriptName = 'rank-pipeline.mjs';
      } else if (cmd === 'scan') {
        scriptName = 'scratch-scan.mjs';
      } else if (cmd === 'tailor' || cmd === 'offer-match') {
        scriptName = 'agentic-tailor.mjs';
        if (args.length === 0) {
          send({ type: 'stderr', content: `Usage: ${cmd} <job_id>\n  Example: ${cmd} 42\n  Get job IDs from the Pipeline tab or by running 'offer-list'.\n` });
          send({ type: 'done', code: 1 });
          controller.close();
          return;
        }
      } else if (cmd === 'apply') {
        scriptName = 'auto-apply.mjs';
        if (args.length === 0) {
          send({ type: 'stderr', content: `Usage: apply <job_id>\n  Example: apply 42\n  Get job IDs from the Pipeline tab or by running 'offer-list'.\n` });
          send({ type: 'done', code: 1 });
          controller.close();
          return;
        }
      } else if (cmd === 'ls') {
        // Handle a virtual 'ls' for UX
        send({ type: 'stdout', content: 'config/  data/  output/  templates/  agentic-tailor.mjs  auto-apply.mjs  rank-pipeline.mjs  scratch-scan.mjs\n' });
        send({ type: 'done', code: 0 });
        controller.close();
        return;
      } else if (cmd === 'help' || cmd === '?') {
        const helpText = `
  ┌─────────────────────────────────────────────────────┐
  │              career-ops — Command Reference          │
  ├─────────────────────────────────────────────────────┤
  │                                                     │
  │  DISCOVERY                                          │
  │    scan              Scan all 11+ job portals       │
  │    offer-list        Score & rank pipeline jobs      │
  │                                                     │
  │  APPLICATION                                        │
  │    offer-match <id>  Tailor Resume+Cover Letter     │
  │    tailor <id>       (alias for offer-match)        │
  │    apply <id>        Auto-fill application form     │
  │                                                     │
  │  UTILITIES                                          │
  │    ls                List project files              │
  │    clear             Clear terminal screen           │
  │    help              Show this reference             │
  │                                                     │
  │  WORKFLOW                                           │
  │    1. scan  →  discover new jobs                    │
  │    2. offer-list  →  rank & get job IDs             │
  │    3. offer-match 42  →  generate documents         │
  │    4. apply 42  →  auto-fill & submit               │
  │                                                     │
  └─────────────────────────────────────────────────────┘
\n`;
        send({ type: 'stdout', content: helpText });
        send({ type: 'done', code: 0 });
        controller.close();
        return;
      } else {
        send({ type: 'stderr', content: `career-ops: command not found: ${cmd}\nType 'help' for available commands.\n` });
        send({ type: 'done', code: 127 });
        controller.close();
        return;
      }


      const scriptPath = path.join(process.cwd(), '..', scriptName);
      
      console.log(`🚀 Executing: node ${scriptPath} ${scriptArgs.join(' ')}`);
      
      const child = spawn('node', [scriptPath, ...scriptArgs], {
        cwd: path.join(process.cwd(), '..'),
        env: { ...process.env, FORCE_COLOR: '1' }
      });

      child.stdout.on('data', (data) => send({ type: 'stdout', content: data.toString() }));
      child.stderr.on('data', (data) => send({ type: 'stderr', content: data.toString() }));
      child.on('close', (code) => {
        send({ type: 'done', code });
        controller.close();
      });

      req.signal.addEventListener('abort', () => {
        child.kill();
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
