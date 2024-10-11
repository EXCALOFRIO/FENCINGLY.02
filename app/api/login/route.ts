import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  try {
    const user = await prisma.user.findFirst({
      where: { username },
      include: { tournaments: { select: { id: true } } } // Cambiado a tournaments
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const tournamentId = user.tournaments.length > 0 ? user.tournaments[0].id : null; // Manejo de caso sin torneos

    const token = jwt.sign(
      { userId: user.id, username: user.username, tournamentId }, //  Actualizado tournamentId
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    return NextResponse.json({ token, tournamentId }); // Actualizado tournamentId

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}