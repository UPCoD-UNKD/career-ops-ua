import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;
    const { id } = await ctx.params;
    const jobId = Number.parseInt(String(id), 10);
    if (!Number.isFinite(jobId)) {
      return NextResponse.json({ error: 'Invalid job id' }, { status: 400 });
    }

    // First get the job to confirm it exists and get R2 keys for potential cleanup
    const [job] = await sql`
      SELECT resume_pdf_key, cover_letter_pdf_key
      FROM jobs
      WHERE id = ${jobId} AND user_id = ${userId}
    `;

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Delete any associated applications first (foreign key constraint)
    await sql`
      DELETE FROM applications
      WHERE job_id = ${jobId} AND user_id = ${userId}
    `;

    // Delete the job
    await sql`
      DELETE FROM jobs
      WHERE id = ${jobId} AND user_id = ${userId}
    `;

    // Note: We're not deleting R2 objects here to keep it simple
    // R2 objects can be cleaned up separately if needed

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully',
      deletedKeys: {
        resume: job.resume_pdf_key,
        coverLetter: job.cover_letter_pdf_key,
      },
    });
  } catch (error: any) {
    console.error('Delete job error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
