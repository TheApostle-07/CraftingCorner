// Keep WordPress scanner traffic out of the database-backed product catch-all.
export const dynamic = 'force-static';

export function GET() {
  return new Response(null, { status: 404 });
}
