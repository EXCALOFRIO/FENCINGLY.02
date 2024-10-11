"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface TournamentFormProps {
  step: number;
}

export function TournamentForm({ step }: TournamentFormProps) {
  const [participants, setParticipants] = useState('');
  const [poules, setPoules] = useState('');
  const [classification, setClassification] = useState('');
  const [directElimination, setDirectElimination] = useState('');
  const [finalRanking, setFinalRanking] = useState('');

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Inscripción de participantes</h2>
            <Label htmlFor="participants">Participants</Label>
            <Textarea
              id="participants"
              placeholder="Enter participant names, one per line"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              rows={10}
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Poules</h2>
            <Label htmlFor="poules">Poule Assignments</Label>
            <Textarea
              id="poules"
              placeholder="Enter poule assignments"
              value={poules}
              onChange={(e) => setPoules(e.target.value)}
              rows={10}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Clasificacion post Poules</h2>
            <Label htmlFor="classification">Post-Poule Classification</Label>
            <Textarea
              id="classification"
              placeholder="Enter post-poule classification"
              value={classification}
              onChange={(e) => setClassification(e.target.value)}
              rows={10}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Eliminaciones directas</h2>
            <Label htmlFor="directElimination">Direct Elimination Brackets</Label>
            <Textarea
              id="directElimination"
              placeholder="Enter direct elimination brackets"
              value={directElimination}
              onChange={(e) => setDirectElimination(e.target.value)}
              rows={10}
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Ranking Final</h2>
            <Label htmlFor="finalRanking">Final Ranking</Label>
            <Textarea
              id="finalRanking"
              placeholder="Enter final ranking"
              value={finalRanking}
              onChange={(e) => setFinalRanking(e.target.value)}
              rows={10}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {renderStep()}
    </div>
  );
}