"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Steps } from '@/components/steps';
import { TournamentForm } from '@/components/tournament-form';
import { PouleSelector } from '@/components/poule-selector';
import PouleViewer  from '@/components/poule-viewer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const steps = [
  'Importar Ranking',
  'Poules',
  'Clasificación post Poules',
  'Eliminaciones directas',
  'Ranking Final',
];

interface Participant {
  name: string;
  country: string;
}

interface PouleFencer {
  name: string;
  country: string;
  scores: (number | 'V')[];
  stats: {
    V: number;
    VM: number;
    TS: number;
    TR: number;
    Ind: number;
  };
}

export default function Component() {
  const params = useParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [numPoules, setNumPoules] = useState<number | null>(null);
  const [poules, setPoules] = useState<PouleFencer[][]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const tournamentId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        const response = await fetch(`/api/tournaments/${tournamentId}`);
        if (response.ok) {
          const data = await response.json();
          setCurrentStep(data.currentStage || 0);
          setNumPoules(data.numPoules || null);
          setParticipants(Array.isArray(data.participants) ? data.participants : []);
          if (data.poules) {
            setPoules(JSON.parse(data.poules));
          }
        }
      } catch (error) {
        console.error('Error fetching tournament data:', error);
      }
    };
  
    if (params) {
      const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
  
        try {
          const response = await fetch('/api/verify-token', {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          if (!response.ok) {
            throw new Error('Token verification failed');
          }
  
          const data = await response.json();
          if (data.tournamentId !== tournamentId) {
            throw new Error('Unauthorized for this tournament');
          }
  
          setIsAuthenticated(true);
          fetchTournamentData();
        } catch (error) {
          console.error('Authentication error:', error);
          localStorage.removeItem('token');
          router.push('/login');
        }
      };
  
      checkAuth();
    }
  }, [params, router, tournamentId]);

  const handleNext = async () => {
    if (currentStep === 0) {
      setShowConfirmDialog(true);
    } else if (currentStep === 1 && numPoules === null) {
      console.error('You need to select the number of poules before proceeding');
      return;
    } else if (currentStep < steps.length - 1) {
      try {
        const body = {
          currentStage: currentStep + 1,
          numPoules: numPoules,
          poules: JSON.stringify(poules)
        };
  
        const response = await fetch(`/api/tournaments/${tournamentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
  
        if (response.ok) {
          setCurrentStep(currentStep + 1);
        } else {
          console.error('Failed to update tournament');
        }
      } catch (error) {
        console.error('Error updating tournament:', error);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirmRanking = async () => {
    if (tournamentId) {
      try {
        const response = await fetch(`/api/tournaments/${tournamentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ participants, currentStage: 1 }),
        });

        if (response.ok) {
          setCurrentStep(1);
          setShowConfirmDialog(false);
        } else {
          console.error('Failed to update tournament');
        }
      } catch (error) {
        console.error('Error updating tournament:', error);
      }
    }
  };

  const handleUpdatePoules = (updatedPoules: PouleFencer[][]) => {
    setPoules(updatedPoules);
  };

  const handleUpdateParticipants = (updatedParticipants: Participant[]) => {
    setParticipants(updatedParticipants);
  };

  const handleSelectPoules = (selectedNumPoules: number) => {
    setNumPoules(selectedNumPoules);
  };

  if (!isAuthenticated) {
    return <div>Authenticating...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Manage Tournament</h1>
      <Card>
        <CardHeader>
          <CardTitle>Tournament Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Steps steps={steps} currentStep={currentStep} />
          <div className="mt-8 space-y-4">
            {currentStep === 0 && (
              <TournamentForm
                step={currentStep}
                onUpdateParticipants={handleUpdateParticipants}
                tournamentId={tournamentId}
                initialParticipants={participants}
              />
            )}
            
            {currentStep === 1 && (
              <PouleSelector
                numParticipants={participants.length}
                onSelectPoules={handleSelectPoules}
              />
            )}

            {currentStep === 2 && numPoules !== null && (
              <PouleViewer
                fencers={participants}
                numPoules={numPoules}
                onUpdatePoules={handleUpdatePoules}
              />
            )}
            
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              {currentStep === steps.length - 1 ? (
                <Button type="button" onClick={() => console.log('Finish Tournament')}>
                  Finish Tournament
                </Button>
              ) : (
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Ranking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to confirm this final ranking?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <ol className="list-decimal pl-6">
            {participants.map((participant, index) => (
              <li key={index} className="mb-1">
                {participant.name} - {participant.country}
              </li>
            ))}
          </ol>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRanking}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}