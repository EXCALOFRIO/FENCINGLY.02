'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Tournament {
  id: string
  name: string
  location: string
  startDate: string
  endDate: string
  modality: string
  category: string
  weaponType: string
  level: string
}

export default function ManageTournament({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchTournament(token)
    }
  }, [params.id])

  const fetchTournament = async (token: string) => {
    try {
      const response = await fetch(`/api/tournaments/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTournament(data.tournament)
        setIsAuthenticated(true)
      } else {
        throw new Error('Error al obtener los datos del torneo')
      }
    } catch (error) {
      console.error('Error:', error)
      setIsAuthenticated(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, tournamentId: params.id }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('token', data.token)
        fetchTournament(data.token)
      } else {
        throw new Error('Error de autenticación')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de autenticación')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Iniciar Sesión</h1>
        <form onSubmit={handleLogin} className="max-w-md mx-auto">
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-bold mb-2">
              Usuario
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Iniciar Sesión
          </button>
        </form>
      </div>
    )
  }

  if (!tournament) {
    return <div>Cargando...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gestionar Torneo: {tournament.name}</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Detalles del Torneo</h2>
        <p><strong>Ubicación:</strong> {tournament.location}</p>
        <p><strong>Fecha de inicio:</strong> {new Date(tournament.startDate).toLocaleDateString()}</p>
        <p><strong>Fecha de fin:</strong> {new Date(tournament.endDate).toLocaleDateString()}</p>
        <p><strong>Modalidad:</strong> {tournament.modality}</p>
        <p><strong>Categoría:</strong> {tournament.category}</p>
        <p><strong>Tipo de arma:</strong> {tournament.weaponType}</p>
        <p><strong>Nivel:</strong> {tournament.level}</p>
      </div>
      {/* Aquí puedes agregar más funcionalidades para gestionar el torneo */}
    </div>
  )
}