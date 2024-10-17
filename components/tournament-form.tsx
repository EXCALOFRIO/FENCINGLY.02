import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import TournamentImportarRanking from './tournament-importar-ranking';
import PouleViewer from '@/components/poule-viewer'; // Importa el nuevo componente

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
  const [poules, setPoules] = useState<string>(''); // Mantén `poules` como un string, o ajusta según el formato necesario
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
            <Label htmlFor="poules">Selecciona el numero de Poules, puedes dejarlo a 0 para no hacer ronda de Poules</Label>
            {/* Aquí puedes agregar un campo o selector para determinar el número de poules */}
          </div>
        );

      case 2:
        // Asegúrate de definir bien el número de poules si es relevante para `PouleViewer`
        const numPoules = poules.length > 0 ? poules.length : 1; // Deriva el número de poules
        return (
          <PouleViewer 
            fencers={participants} 
            numPoules={numPoules} // Usa el número de poules basado en el estado
            onUpdatePoules={(updatedPoules) => console.log('Updated poules:', updatedPoules)}
          />
        );

      // Agrega aquí el resto de los casos para los pasos posteriores (classification, directElimination, etc.)
      default:
        return null;
    }
  };

  return <div className="space-y-8">{renderStep()}</div>;
}
