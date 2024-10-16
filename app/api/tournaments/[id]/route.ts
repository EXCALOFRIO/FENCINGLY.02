import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Obtener los participantes de un torneo específico
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const url = new URL(request.url);
  const selectParticipantsOnly = url.searchParams.get("select") === "participants"; // Corregir uso de URL
  console.log("params.id:", params.id);
  
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id },
      select: selectParticipantsOnly ? { participants: true } : undefined, // Condicional para solo seleccionar participantes
    });

    if (!tournament) {
      console.log("Tournament not found for ID:", params.id);
      return NextResponse.json({ error: 'Torneo no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(selectParticipantsOnly ? { participants: tournament.participants } : tournament);
  
  } catch (error) {
    console.error('Error fetching tournament data:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}



export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { participants, currentStage, numPoules } = await request.json(); // Añadir numPoules

    const updatedTournament = await prisma.tournament.update({
      where: { id: params.id },
      data: {
        participants: participants,
        currentStage: currentStage,
        numPoules: numPoules, // Actualizar el número de poules
      },
    });

    return NextResponse.json(updatedTournament);
  } catch (error) {
    console.error('Error updating tournament:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


