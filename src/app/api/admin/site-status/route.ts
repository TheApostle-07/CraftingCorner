import { NextResponse } from 'next/server';

import { isAdminAuthenticated } from '@/lib/adminAuth';
import {
  getSiteStatus,
  getSiteStorageInfo,
  updateSiteStatus,
} from '@/lib/siteStatus';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      {
        message: 'Admin authentication required.',
      },
      { status: 401 },
    );
  }

  return NextResponse.json({
    status: await getSiteStatus(),
    storageInfo: getSiteStorageInfo(),
  });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      {
        message: 'Admin authentication required.',
      },
      { status: 401 },
    );
  }

  const body = (await request.json()) as {
    active?: boolean;
  };

  if (typeof body.active !== 'boolean') {
    return NextResponse.json(
      {
        message: 'Provide a boolean "active" value.',
      },
      { status: 400 },
    );
  }

  try {
    const status = await updateSiteStatus(body.active, 'admin');

    return NextResponse.json({
      message: `Site is now ${body.active ? 'Active' : 'Not Active'}.`,
      status,
      storageInfo: getSiteStorageInfo(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'Unable to update the site status.',
      },
      { status: 500 },
    );
  }
}
