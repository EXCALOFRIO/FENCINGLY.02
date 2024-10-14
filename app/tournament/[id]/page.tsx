"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Participant {
  id: string;
  name: string;
  country: string;
  initialRanking: number;
}

interface TournamentDetails {
  id: string;
  name: string;
  status: string;
  currentStage: number;
  participants: Participant[];
}

export default function TournamentDetails() {
  const params = useParams();
  const [tournament, setTournament] = useState<TournamentDetails | null>(null);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const response = await fetch(`/api/tournaments/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setTournament(data);
        } else {
          console.error('Failed to fetch tournament');
        }
      } catch (error) {
        console.error('Error fetching tournament:', error);
      }
    };

    fetchTournament();
  }, [params.id]);

  if (!tournament) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{tournament.name}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Tournament Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Status: {tournament.status}</p>
          <p>Current Stage: {tournament.currentStage}</p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Participants</h2>
          <ul>
            {tournament.participants.map((participant) => (
              <li key={participant.id}>
                {participant.initialRanking}. {participant.name} - {participant.country}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}