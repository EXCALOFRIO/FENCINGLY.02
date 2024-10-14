import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const tournaments = await prisma.tournament.findMany({
      select: { id: true, name: true, status: true, currentStage: true }
    });
    return NextResponse.json(tournaments);
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { name, adminUsername, adminPassword } = await request.json();

  try {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Verificar si el usuario ya existe
    let user = await prisma.user.findUnique({
      where: { username: adminUsername }
    });

    // Si el usuario no existe, lo creamos
    if (!user) {
      user = await prisma.user.create({
        data: {
          username: adminUsername,
          password: hashedPassword,
        },
      });
    }

    // Crear el torneo
    const tournament = await prisma.tournament.create({
      data: {
        name,
        status: 'Not Started',
        currentStage: 0,
        participants: { create: [] },
        adminId: user.id,
      },
    });

    return NextResponse.json(tournament);
  } catch (error) {
    console.error('Error creating tournament:', error);

    if (error instanceof Error && error.message.includes('Unique constraint failed on the constraint: `User_username_key`')) {
      return NextResponse.json({ error: 'Username is already in use.' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
