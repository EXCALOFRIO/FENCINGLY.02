'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TournamentLogin({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
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
        // Aquí podrías guardar el token en localStorage si lo necesitas
        router.push(`/manage-tournament/${params.id}`)
      } else {
        throw new Error('Error de autenticación')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de autenticación')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Iniciar Sesión para Gestionar Torneo</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
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