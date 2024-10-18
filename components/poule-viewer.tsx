import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Participant {
  name: string;
  country: string;
}

interface PouleFencer extends Participant {
  scores: (number | 'V')[];
  stats: {
    V: number;
    VM: number;
    TS: number;
    TR: number;
    Ind: number;
  };
}

interface PouleProps {
  fencers: Participant[];
  numPoules: number;
  onUpdatePoules: (poules: PouleFencer[][]) => void;
}

function divideTiradores(tiradores: Participant[], poules: number): PouleFencer[][] {
  const resultado: PouleFencer[][] = Array.from({ length: poules }, () => []);
  const orden = generarArray(poules, tiradores.length);

  let index = 0;

  for (const tirador of tiradores) {
    let pouleIndex = orden[index] - 1;
    let found = false;

    while (!found) {
      if (!existeMismoPais(resultado[pouleIndex], tirador.country)) {
        resultado[pouleIndex].push({
          ...tirador,
          scores: Array(tiradores.length - 1).fill(0),
          stats: { V: 0, VM: 0, TS: 0, TR: 0, Ind: 0 },
        });
        found = true;
      } else {
        index = (index + 1) % orden.length;
        pouleIndex = orden[index] - 1;

        if (index === 0 && pouleIndex === orden[0] - 1) {
          resultado[orden[0] - 1].push({
            ...tirador,
            scores: Array(tiradores.length - 1).fill(0),
            stats: { V: 0, VM: 0, TS: 0, TR: 0, Ind: 0 },
          });
          found = true;
        }
      }
    }
    orden.splice(index, 1);
    index = 0;
  }

  return resultado;
}

function existeMismoPais(poule: PouleFencer[], pais: string): boolean {
  return poule.some(tirador => tirador.country === pais);
}

function generarArray(numPoules: number, numTiradores: number): number[] {
  const resultado: number[] = [];
  const totalElements = Math.max(numTiradores, numPoules * 2);

  for (let i = 0; i < totalElements; i++) {
    for (let j = 1; j <= numPoules; j++) {
      resultado.push(j);
    }
    for (let j = numPoules; j > 0; j--) {
      resultado.push(j);
    }
  }

  return resultado.slice(0, numTiradores);
}

export default function PouleViewer({ fencers: initialFencers, numPoules, onUpdatePoules }: PouleProps) {
  const [poules, setPoules] = useState<PouleFencer[][]>([]);

  useEffect(() => {
    if (initialFencers.length > 0 && numPoules > 0) {
      const dividedPoules = divideTiradores(initialFencers, numPoules);
      setPoules(dividedPoules);
      onUpdatePoules(dividedPoules);
    }
  }, [initialFencers, numPoules, onUpdatePoules]);

  const handleScoreChange = (
    pouleIndex: number,
    fencerIndex: number,
    opponentIndex: number,
    score: number | 'V'
  ) => {
    const newPoules = [...poules];
    newPoules[pouleIndex][fencerIndex].scores[opponentIndex] = score;
    setPoules(newPoules);
    calculateStats(pouleIndex);
    onUpdatePoules(newPoules);
  };

  const calculateStats = (pouleIndex: number) => {
    const newPoules = [...poules];
    const poule = newPoules[pouleIndex];

    poule.forEach((fencer, fencerIndex) => {
      const stats = {
        V: fencer.scores.filter((score) => score === 'V').length,
        TS: fencer.scores.reduce((sum, score) => sum + (typeof score === 'number' ? score : 5), 0),
        TR: poule.reduce(
          (sum, opponent, index) =>
            sum +
            (index !== fencerIndex
              ? typeof opponent.scores[fencerIndex] === 'number'
                ? opponent.scores[fencerIndex]
                : 0
              : 0),
          0
        ),
        VM: 0,
        Ind: 0,
      };
      stats.VM = Number((stats.V / (poule.length - 1)).toFixed(2));
      stats.Ind = stats.TS - stats.TR;
      newPoules[pouleIndex][fencerIndex].stats = stats;
    });

    setPoules(newPoules);
    onUpdatePoules(newPoules);
  };

  const ScoreButton = ({
    value,
    onClick,
  }: {
    value: number | 'V';
    onClick: () => void;
  }) => (
    <Button variant="outline" size="sm" className="w-8 h-8 p-0" onClick={onClick}>
      {value}
    </Button>
  );

  return (
    <div className="space-y-8">
      {poules.map((poule, pouleIndex) => (
        <Card key={pouleIndex} className="overflow-hidden">
          <CardHeader>
            <CardTitle>Poule {pouleIndex + 1}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-40">Fencer</TableHead>
                  {poule.map((_, index) => (
                    <TableHead key={index} className="w-10 text-center">
                      {index + 1}
                    </TableHead>
                  ))}
                  <TableHead className="w-10 text-center">V</TableHead>
                  <TableHead className="w-10 text-center">V/M</TableHead>
                  <TableHead className="w-10 text-center">TS</TableHead>
                  <TableHead className="w-10 text-center">TR</TableHead>
                  <TableHead className="w-10 text-center">Ind</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {poule.map((fencer, fencerIndex) => (
                  <TableRow key={fencerIndex}>
                    <TableCell className="font-medium">
                      {fencer.name}
                      <br />
                      <span className="text-xs text-muted-foreground">{fencer.country}</span>
                    </TableCell>
                    {poule.map((_, opponentIndex) => (
                      <TableCell key={opponentIndex} className="p-0 text-center">
                        {fencerIndex !== opponentIndex ? (
                          <div className="relative group">
                            <Input
                              type="text"
                              value={fencer.scores[opponentIndex] || ''}
                              onChange={(e) =>
                                handleScoreChange(
                                  pouleIndex,
                                  fencerIndex,
                                  opponentIndex,
                                  e.target.value === 'V' ? 'V' : Number(e.target.value)
                                )
                              }
                              className="w-10 h-10 p-0 text-center"
                            />
                            <div className="absolute hidden group-hover:flex space-x-1 bg-background border rounded-md p-1 shadow-md z-10">
                              {[0, 1, 2, 3, 4, 'V'].map((value) => (
                                <ScoreButton
                                  key={value}
                                  value={value}
                                  onClick={() =>
                                    handleScoreChange(pouleIndex, fencerIndex, opponentIndex, value)
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-muted"></div>
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="text-center">{fencer.stats.V}</TableCell>
                    <TableCell className="text-center">{fencer.stats.VM.toFixed(2)}</TableCell>
                    <TableCell className="text-center">{fencer.stats.TS}</TableCell>
                    <TableCell className="text-center">{fencer.stats.TR}</TableCell>
                    <TableCell className="text-center">{fencer.stats.Ind}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}