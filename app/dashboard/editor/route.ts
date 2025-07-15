import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Get the base URL from the request
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  // Redirect to the explore page
  return NextResponse.redirect(new URL('/dashboard/explore', baseUrl));
}
