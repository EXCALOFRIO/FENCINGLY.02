import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, location, startDate, endDate, modality, category, weaponType, level } = body

    // Generar usuario y contraseña automáticamente
    const adminUsername = `admin_${Math.random().toString(36).substr(2, 9)}`
    const adminPassword = Math.random().toString(36).substr(2, 9)
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    const tournament = await prisma.tournament.create({
      data: {
        name,
        location,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        modality,
        category,
        weaponType,
        level,
        adminUser: adminUsername,
        adminPassword: hashedPassword,
      },
    })

    const managementUrl = `/manage-tournament/${tournament.id}`

    return NextResponse.json({ 
      success: true, 
      tournamentId: tournament.id, 
      managementUrl,
      adminUsername,
      adminPassword
    })
  } catch (error) {
    console.error('Error creating tournament:', error)
    return NextResponse.json({ success: false, error: 'Error creating tournament' }, { status: 500 })
  }
}