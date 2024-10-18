import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronUp, ChevronDown, Plus, X, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Participant {
  name: string;
  country: string;
}

interface TournamentImportarRankingProps {
  tournamentId: string;
  initialParticipants: Participant[];
  onUpdateTiradores: (tiradores: Participant[]) => void;
}

export default function TournamentImportarRanking({ tournamentId, initialParticipants, onUpdateTiradores }: TournamentImportarRankingProps) {
  const [tiradores, setTiradores] = useState<Participant[]>(initialParticipants || []);
  const [addingIndex, setAddingIndex] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [columnSelections, setColumnSelections] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const countryInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

          // Remove columns with only numbers
          const cleanedData = jsonData.map(row => 
            row.filter((cell, index) => 
              !jsonData.every(r => !isNaN(Number(r[index])))
            )
          );

          setPreviewData(cleanedData);
          setColumnSelections(new Array(cleanedData[0].length).fill('none'));
          setIsDialogOpen(true);
          setError(null);
        } catch (error) {
          console.error('Error reading Excel file:', error);
          setError('Error reading Excel file. Please make sure it\'s a valid .xlsx or .xls file.');
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleImport = () => {
    const nameColumns = columnSelections.map((selection, index) => selection === 'name' ? index : -1).filter(index => index !== -1);
    const countryColumn = columnSelections.findIndex(selection => selection === 'country');

    if (nameColumns.length > 0 && countryColumn !== -1) {
      const importedTiradores = previewData.slice(1).map((row) => {
        const name = nameColumns.map(col => row[col]).join(' ').trim();
        const country = row[countryColumn];
        return { name, country };
      });

      setTiradores(importedTiradores);
      onUpdateTiradores(importedTiradores);
      setIsDialogOpen(false);
    } else {
      setError('Please select at least one column for name and one for country/club.');
    }
  };

  const handleColumnSelection = (index: number, value: string) => {
    const newSelections = [...columnSelections];
    newSelections[index] = value;
    setColumnSelections(newSelections);
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
          placeholder="Club"
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

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Ranking de Tiradores</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <ul className="space-y-2">
        {tiradores && tiradores.length > 0 ? (
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

        {addingIndex === (tiradores ? tiradores.length : 0) && renderAddInput()}
      </ul>

      <div className="mt-6 flex justify-between items-center animate-in slide-in-from-bottom-2 duration-300">
        <Button
          onClick={() => setAddingIndex(tiradores ? tiradores.length : 0)}
          variant="outline"
          size="sm"
          className="flex items-center"
        >
          <Plus size={16} className="mr-1" /> Añadir tirador
        </Button>
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          size="sm"
          className="flex items-center"
        >
          <Upload size={16} className="mr-1" /> Importar Excel
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".xlsx, .xls"
          className="hidden"
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Vista previa de Excel</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto max-h-[60vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  {previewData[0]?.map((header, index) => (
                    <TableHead key={index} className="text-center">
                      <div className="flex flex-col items-center">
                        <span>{header}</span>
                        <Select onValueChange={(value) => handleColumnSelection(index, value)}>
                          <SelectTrigger className="w-[120px] mt-2">
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No usar</SelectItem>
                            <SelectItem value="name">Nombre</SelectItem>
                            <SelectItem value="country">Club/País</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.slice(1, 6).map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} variant="outline">
              Cancelar
            </Button>
            <Button onClick={handleImport}>
              Importar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}