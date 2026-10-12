import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [agents, workflows, campaigns, leads, bookings, payments, projects, memories, resumes, stats] =
      await Promise.all([
        db.getAgents(),
        db.getWorkflows(),
        db.getCampaigns(),
        db.getContactRequests(),
        db.getBookings(),
        db.getPayments(),
        db.getProjects(),
        db.getMemories(),
        db.getResumes(),
        db.getStats(),
      ]);

    const snapshot = {
      exportVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      platform: 'MEOW AI Action Platform',
      stats,
      data: {
        agents,
        workflows,
        campaigns,
        leads,
        bookings,
        payments,
        projects,
        memories,
        resumes,
      },
    };

    return new NextResponse(JSON.stringify(snapshot, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="MEOW_Platform_Backup_${Date.now()}.json"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
