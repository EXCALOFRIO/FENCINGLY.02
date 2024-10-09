import Link from 'next/link'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getTournaments() {
  const tournaments = await prisma.tournament.findMany({
    where: {
      endDate: {
        gte: new Date(),
      },
    },
    orderBy: {
      startDate: 'asc',
    },
  })
  return tournaments
}

export default async function Home() {
  const tournaments = await getTournaments()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Torneos de Esgrima Activos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{tournament.name}</h2>
            <p className="text-gray-600 mb-2">{tournament.location}</p>
            <p className="text-gray-600 mb-2">
              {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
            </p>
            <p className="text-gray-600 mb-2">{tournament.weaponType}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-between">
        <Link href="/create-tournament" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Crear Nuevo Torneo
        </Link>
        <Link href="/login" className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
          Iniciar Sesión
        </Link>
      </div>
    </div>
  )
}