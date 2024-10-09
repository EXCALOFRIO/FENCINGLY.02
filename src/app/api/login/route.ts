import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password, tournamentId } = body

    const tournament = await prisma.tournament.findUnique({
      where: { 
        id: tournamentId,
        adminUser: username 
      },
    })

    if (!tournament) {
      return NextResponse.json({ success: false, error: 'Usuario no encontrado o torneo inválido' }, { status: 401 })
    }

    const passwordMatch = await bcrypt.compare(password, tournament.adminPassword)

    if (!passwordMatch) {
      return NextResponse.json({ success: false, error: 'Contraseña incorrecta' }, { status: 401 })
    }

    const token = jwt.sign({ userId: tournament.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' })

    return NextResponse.json({ 
      success: true, 
      token,
      tournamentId: tournament.id
    })
  } catch (error) {
    console.error('Error en el inicio de sesión:', error)
    return NextResponse.json({ success: false, error: 'Error en el inicio de sesión' }, { status: 500 })
  }
}