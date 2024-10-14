import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import TournamentImportarRanking from './tournament-importar-ranking';

interface Participant {
  name: string;
  country: string;
}

interface TournamentFormProps {
  step: number;
  tournamentId: string | undefined;
  onUpdateParticipants: (participants: Participant[]) => void;
}

export function TournamentForm({ step, tournamentId, onUpdateParticipants }: TournamentFormProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [poules, setPoules] = useState('');
  const [classification, setClassification] = useState('');
  const [directElimination, setDirectElimination] = useState('');
  const [finalRanking, setFinalRanking] = useState('');

  const handleUpdateParticipants = (updatedParticipants: Participant[]) => {
    setParticipants(updatedParticipants);
    onUpdateParticipants(updatedParticipants);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return tournamentId ? ( // Conditional rendering
          <TournamentImportarRanking
            tournamentId={tournamentId}
            onUpdateTiradores={handleUpdateParticipants}
          />
        ) : (
          <div>Loading tournament data or tournament ID not available...</div>
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
      // Agrega aquí el resto de los casos para los pasos posteriores (classification, directElimination, etc.)
      default:
        return null;
    }
  };

  return <div className="space-y-8">{renderStep()}</div>;
}

