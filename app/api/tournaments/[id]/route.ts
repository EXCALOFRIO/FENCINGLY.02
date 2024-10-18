import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const url = new URL(request.url);
  const selectParticipantsOnly = url.searchParams.get("select") === "participants";
  console.log("params.id:", params.id);
  
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id },
      select: selectParticipantsOnly 
        ? { participants: true } 
        : { 
            id: true, 
            name: true, 
            status: true, 
            currentStage: true, 
            numPoules: true, 
            participants: true, 
            poules: true 
          },
    });

    if (!tournament) {
      console.log("Tournament not found for ID:", params.id);
      return NextResponse.json({ error: 'Torneo no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(tournament);
  
  } catch (error) {
    console.error('Error fetching tournament data:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { participants, currentStage, numPoules, poules } = await request.json();

    const updatedTournament = await prisma.tournament.update({
      where: { id: params.id },
      data: {
        participants: participants,
        currentStage: currentStage,
        numPoules: numPoules,
        poules: poules,
      },
    });

    return NextResponse.json(updatedTournament);
  } catch (error) {
    console.error('Error updating tournament:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}