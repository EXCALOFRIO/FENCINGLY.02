'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateTournament() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    startDate: '',
    endDate: '',
    modality: '',
    category: '',
    weaponType: '',
    level: '',
  })
  const [showCredentials, setShowCredentials] = useState(false)
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [tournamentId, setTournamentId] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setCredentials({
          username: data.adminUsername,
          password: data.adminPassword
        })
        setTournamentId(data.tournamentId)
        setShowCredentials(true)
      } else {
        throw new Error('Error al crear el torneo')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al crear el torneo')
    }
  }

  const handleCopyCredentials = () => {
    const credentialsText = `Usuario: ${credentials.username}\nContraseña: ${credentials.password}`
    navigator.clipboard.writeText(credentialsText)
      .then(() => alert('Credenciales copiadas al portapapeles'))
      .catch(err => console.error('Error al copiar: ', err))
  }

  const handleCloseCredentials = () => {
    setShowCredentials(false)
    router.push(`/login/${tournamentId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Crear Nuevo Torneo</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Nombre del Torneo
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="location" className="block text-gray-700 font-bold mb-2">
            Ubicación
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="startDate" className="block text-gray-700 font-bold mb-2">
            Fecha de Inicio
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="endDate" className="block text-gray-700 font-bold mb-2">
            Fecha de Fin
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="modality" className="block text-gray-700 font-bold mb-2">
            Modalidad
          </label>
          <input
            type="text"
            id="modality"
            name="modality"
            value={formData.modality}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 font-bold mb-2">
            Categoría
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="weaponType" className="block text-gray-700 font-bold mb-2">
            Tipo de Arma
          </label>
          <select
            id="weaponType"
            name="weaponType"
            value={formData.weaponType}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Seleccionar</option>
            <option value="florete">Florete</option>
            <option value="espada">Espada</option>
            <option value="sable">Sable</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="level" className="block text-gray-700 font-bold mb-2">
            Nivel
          </label>
          <select
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Seleccionar</option>
            <option value="nacional">Nacional</option>
            <option value="internacional">Internacional</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Crear Torneo
        </button>
      </form>

      {showCredentials && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Credenciales del Torneo</h2>
            <p className="mb-2"><strong>Usuario:</strong> {credentials.username}</p>
            <p className="mb-4"><strong>Contraseña:</strong> {credentials.password}</p>
            <p className="mb-4 text-sm text-gray-600">Por favor, guarde estas credenciales. Las necesitará para iniciar sesión y gestionar el torneo.</p>
            <div className="flex justify-between">
              <button 
                onClick={handleCopyCredentials}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Copiar Credenciales
              </button>
              <button 
                onClick={handleCloseCredentials}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Ir a Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}