import { NextResponse } from 'next/server';

import { clearAdminSession } from '@/lib/adminAuth';

export async function POST() {
  const response = NextResponse.json({
    authenticated: false,
    message: 'Admin session closed.',
  });

  clearAdminSession(response);

  return response;
}
