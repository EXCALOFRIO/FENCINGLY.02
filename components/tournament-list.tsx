"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Tournament {
  id: string;
  name: string;
  status: string;
  currentStage: number;
}

export function TournamentList() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch('/api/tournaments');
        if (response.ok) {
          const data = await response.json();
          setTournaments(data);
        } else {
          console.error('Failed to fetch tournaments');
        }
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      }
    };

    fetchTournaments();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tournaments.map((tournament) => (
        <Link href={`/tournament/view/${tournament.id}`} key={tournament.id}>
          <Card>
            <CardHeader>
              <CardTitle>{tournament.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Status: {tournament.status}</p>
              <p>Current Stage: {tournament.currentStage}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}