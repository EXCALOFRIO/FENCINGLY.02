import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronUp, ChevronDown, Plus, X } from 'lucide-react';

interface Participant {
  name: string;
  country: string;
}

interface TournamentImportarRankingProps {
  tournamentId: string;
  onUpdateTiradores: (tiradores: Participant[]) => void;
}

export default function TournamentImportarRanking({
  tournamentId,
  onUpdateTiradores,
}: TournamentImportarRankingProps) {
  const [tiradores, setTiradores] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingIndex, setAddingIndex] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);
  const countryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchTiradores = async () => {
      try {
        const response = await fetch(`/api/tournaments/${tournamentId}?select=participants`);
        if (response.ok) {
          const data = await response.json();

          // Aseguramos que data y data.participants existen
          const participants = Array.isArray(data.participants) ? data.participants : [];
          setTiradores(participants);
          onUpdateTiradores(participants);
        } else {
          console.error('Error loading participants:', response.status, response.statusText);
          setTiradores([]);
        }
      } catch (error) {
        console.error('Error fetching participants:', error);
        setTiradores([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTiradores();
  }, [tournamentId]);
  
  useEffect(() => {
    if (addingIndex !== null && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [addingIndex]);

  const handleAdd = () => {
    if (newName.trim() !== '' && newCountry.trim() !== '') {
      const updatedTiradores = [...tiradores];
      updatedTiradores.splice(addingIndex!, 0, {
        name: newName.trim(),
        country: newCountry.trim(),
      });
      setTiradores(updatedTiradores);
      onUpdateTiradores(updatedTiradores);
      setNewName('');
      setNewCountry('');
      setAddingIndex(null);
    }
  };

  const handleRemove = (index: number) => {
    const updatedTiradores = tiradores.filter((_, i) => i !== index);
    setTiradores(updatedTiradores);
    onUpdateTiradores(updatedTiradores);
  };

  const moveTirador = (index: number, direction: number) => {
    const updatedTiradores = [...tiradores];
    [updatedTiradores[index], updatedTiradores[index + direction]] = [
      updatedTiradores[index + direction],
      updatedTiradores[index],
    ];
    setTiradores(updatedTiradores);
    onUpdateTiradores(updatedTiradores);
  };

  const renderAddInput = () => (
    <div className="mt-2 animate-in slide-in-from-left-1 duration-300">
      <div className="flex items-center space-x-2">
        <Input
          ref={nameInputRef}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nombre del tirador"
          className="flex-grow"
          onKeyPress={(e) => e.key === 'Enter' && countryInputRef.current?.focus()}
        />
        <Input
          ref={countryInputRef}
          value={newCountry}
          onChange={(e) => setNewCountry(e.target.value)}
          placeholder="País"
          className="w-32"
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button onClick={handleAdd} size="sm" className="h-10 px-3">
          <Plus size={16} className="mr-1" /> Añadir
        </Button>
        <Button
          onClick={() => setAddingIndex(null)}
          size="sm"
          variant="ghost"
          className="h-10 w-10 p-0"
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Ranking de Tiradores</h1>
      <ul className="space-y-2">
        {tiradores.length > 0 ? (
          tiradores.map((tirador, index) => (
            <React.Fragment key={index}>
              <li className="bg-background rounded-md shadow-sm relative group">
                <div className="flex items-center justify-between p-3 border border-input">
                  <span className="flex-grow">
                    {tirador.name} - {tirador.country}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Button
                      onClick={() => moveTirador(index, -1)}
                      disabled={index === 0}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                    >
                      <ChevronUp size={16} />
                    </Button>
                    <Button
                      onClick={() => moveTirador(index, 1)}
                      disabled={index === tiradores.length - 1}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                    >
                      <ChevronDown size={16} />
                    </Button>
                    <Button
                      onClick={() => handleRemove(index)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              </li>
              <div className="h-2 relative">
                <div className="absolute left-0 right-0 top-0 h-2 flex items-center justify-center">
                  <Button
                    onClick={() => setAddingIndex(index + 1)}
                    className="h-6 w-6 p-0 rounded-full bg-background hover:bg-primary hover:text-primary-foreground border border-input shadow-sm transition-colors duration-300"
                    size="sm"
                  >
                    <Plus size={12} />
                  </Button>
                </div>
              </div>
            </React.Fragment>
          ))
        ) : (
          <div className="text-center py-8 animate-in fade-in-50 duration-300">
            <p className="text-muted-foreground mb-4">No hay tiradores en el ranking.</p>
            <Button onClick={() => setAddingIndex(0)} className="mt-2">
              Añadir primer tirador
            </Button>
          </div>
        )}

        {addingIndex === tiradores.length && renderAddInput()}
      </ul>

      <div className="mt-6 flex justify-between items-center animate-in slide-in-from-bottom-2 duration-300">
        <Button
          onClick={() => setAddingIndex(tiradores.length)}
          variant="outline"
          size="sm"
          className="flex items-center"
        >
          <Plus size={16} className="mr-1" /> Añadir tirador
        </Button>
      </div>
    </div>
  );
}
