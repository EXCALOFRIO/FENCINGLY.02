import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken';

export function authenticateToken(request: Request): any | null {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return null; // No hay cabecera de autorización
    }

    const token = authHeader.split(' ')[1]; // Obtener el token del "Bearer <token>"

    if (!token) {
      return null;  // No hay token
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded;

  } catch (error) {
    console.error('Token verification failed:', error);
    return null; // Error al verificar el token
  }
}