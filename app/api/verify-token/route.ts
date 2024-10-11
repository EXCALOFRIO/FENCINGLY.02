import { NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth';

export async function GET(request: Request) {
  const user = authenticateToken(request);

  if (user) {
    return NextResponse.json({ message: 'Token is valid', tournamentId: user.tournamentId });
  } else {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}