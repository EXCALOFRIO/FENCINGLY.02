import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1]

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token no proporcionado' }, { status: 401 })
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET as string)
    } catch (error) {
      return NextResponse.json({ success: false, error: 'Token inválido' }, { status: 401 })
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        location: true,
        startDate: true,
        endDate: true,
        modality: true,
        category: true,
        weaponType: true,
        level: true,
      },
    })

    if (!tournament) {
      return NextResponse.json({ success: false, error: 'Torneo no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ success: true, tournament })
  } catch (error) {
    console.error('Error al obtener los datos del torneo:', error)
    return NextResponse.json({ success: false, error: 'Error al obtener los datos del torneo' }, { status: 500 })
  }
}