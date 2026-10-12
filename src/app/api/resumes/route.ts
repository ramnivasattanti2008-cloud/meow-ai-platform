import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CareerResume } from '@/lib/types';

export async function GET() {
  try {
    const resumes = await db.getResumes();
    return NextResponse.json({ success: true, resumes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.fullName || !body.title) {
      return NextResponse.json(
        { success: false, error: 'Full name and title are required.' },
        { status: 400 }
      );
    }

    const newResume = await db.addResume({
      fullName: body.fullName,
      title: body.title,
      email: body.email || 'user@example.com',
      phone: body.phone || '+91 98480 •••••',
      location: body.location || 'Bengaluru, India',
      linkedin: body.linkedin || '',
      github: body.github || '',
      summary: body.summary || '',
      targetRole: body.targetRole || 'Software Engineer',
      atsScore: body.atsScore || 92,
      skills: body.skills || [],
      experience: body.experience || [],
      education: body.education || [],
      projects: body.projects || [],
    });

    return NextResponse.json({ success: true, resume: newResume }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

