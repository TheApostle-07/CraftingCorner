import { NextResponse } from 'next/server';

import {
  attachAdminSession,
  getAdminConfigurationNote,
  isAdminConfigured,
  verifyAdminCredentials,
} from '@/lib/adminAuth';
import { getSiteStatus, getSiteStorageInfo } from '@/lib/siteStatus';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      {
        message: getAdminConfigurationNote(),
      },
      { status: 503 },
    );
  }

  const body = (await request.json()) as {
    username?: string;
    password?: string;
  };

  if (!verifyAdminCredentials(body.username || '', body.password || '')) {
    await sleep(600);

    return NextResponse.json(
      {
        message: 'Invalid admin credentials.',
      },
      { status: 401 },
    );
  }

  const response = NextResponse.json({
    authenticated: true,
    message: 'Admin session started.',
    status: await getSiteStatus(),
    storageInfo: getSiteStorageInfo(),
  });

  attachAdminSession(response);

  return response;
}
