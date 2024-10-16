import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
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

interface PouleSelectionProps {
  numParticipants: number;
  onSelectPoules: (numPoules: number) => void;
}

function calcularPoules(numParticipantes: number) {
  const maxPorPoule = 7;
  let numPoules = Math.ceil(numParticipantes / maxPorPoule);
  if (numParticipantes <= maxPorPoule) {
    numPoules = 1;
  }
  return numPoules;
}

export function PouleSelector({ numParticipants, onSelectPoules }: PouleSelectionProps) {
  const [selectedOption, setSelectedOption] = useState<'recommended' | 'single' | 'custom'>('recommended');
  const [customPoules, setCustomPoules] = useState(1);
  const [showSkipDialog, setShowSkipDialog] = useState(false);

  const recommendedPoules = calcularPoules(numParticipants);
  const maxPoules = Math.floor(numParticipants / 2);

  useEffect(() => {
    if (selectedOption === 'recommended') {
      onSelectPoules(recommendedPoules);
    } else if (selectedOption === 'single') {
      onSelectPoules(1);
    } else {
      onSelectPoules(customPoules);
    }
  }, [selectedOption, customPoules, recommendedPoules, onSelectPoules]);

  const handleCustomChange = (value: number) => {
    if (value === 0) {
      setShowSkipDialog(true);
    } else {
      setCustomPoules(value);
    }
  };

  const handleSkipPoules = () => {
    setShowSkipDialog(false);
    setCustomPoules(0);
    onSelectPoules(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        {recommendedPoules > 1 && (
          <Button
            onClick={() => setSelectedOption('recommended')}
            variant={selectedOption === 'recommended' ? 'default' : 'outline'}
            className="flex-1"
          >
            {recommendedPoules} Poules (Recommended)
          </Button>
        )}
        <Button
          onClick={() => setSelectedOption('single')}
          variant={selectedOption === 'single' ? 'default' : 'outline'}
          className="flex-1"
        >
          1 Poule
        </Button>
        <Button
          onClick={() => setSelectedOption('custom')}
          variant={selectedOption === 'custom' ? 'default' : 'outline'}
          className="flex-1"
        >
          Custom
        </Button>
      </div>

      {selectedOption === 'custom' && (
        <div className="space-y-2">
          <Slider
            min={0}
            max={maxPoules}
            step={1}
            value={[customPoules]}
            onValueChange={(value) => handleCustomChange(value[0])}
          />
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              min={0}
              max={maxPoules}
              value={customPoules}
              onChange={(e) => handleCustomChange(Number(e.target.value))}
              className="w-20"
            />
            <span>Poules</span>
          </div>
        </div>
      )}

      <AlertDialog open={showSkipDialog} onOpenChange={setShowSkipDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Skip Poule Phase?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to skip the poule phase and go directly to direct eliminations?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSkipPoules}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}