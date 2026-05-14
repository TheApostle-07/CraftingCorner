import { NextResponse } from 'next/server';

import { isAdminAuthenticated } from '@/lib/adminAuth';
import { readAdminContent, saveAdminContent } from '@/lib/adminContent.server';
import type { AdminContent } from '@/lib/adminContent';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { message: 'Admin authentication required.' },
      { status: 401 },
    );
  }

  try {
    return NextResponse.json(await readAdminContent());
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'Unable to load admin content.',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { message: 'Admin authentication required.' },
      { status: 401 },
    );
  }

  try {
    const body = (await request.json()) as {
      content?: AdminContent;
      baseSha?: string;
      message?: string;
    };

    if (!body.content) {
      return NextResponse.json(
        { message: 'Missing content payload.' },
        { status: 400 },
      );
    }

    const result = await saveAdminContent(body.content, {
      baseSha: body.baseSha || '',
      message: body.message,
    });

    return NextResponse.json(result, { status: result.ok ? 200 : 422 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to save admin content.';
    const isConflict =
      message.includes('branch changed') ||
      message.includes('Database content changed');

    return NextResponse.json(
      { message },
      { status: isConflict ? 409 : 500 },
    );
  }
}
