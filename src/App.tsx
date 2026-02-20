import { useState } from 'react';
import { SetupScreen } from './SetupScreen';
import { PositionCategorizer } from './PositionCategorizer';
import { PlannerScreen } from './PlannerScreen';
import type { Player, Quarter, Position } from './types';
import { v4 as uuidv4 } from 'uuid';

export default function App() {
  const [step, setStep] = useState<'setup' | 'positions' | 'planner'>('setup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [quarters, setQuarters] = useState<Quarter[]>([]);

  const handleSetupComplete = (names: string[], quarterCount: number) => {
    const initialPlayers: Player[] = names.map(name => ({
      id: uuidv4(),
      name,
      position: 'Unassigned'
    }));
    setPlayers(initialPlayers);

    const initialQuarters: Quarter[] = Array.from({ length: quarterCount }).map((_, i) => ({
      id: i,
      formation: '4-3-3',
      assignments: {}
    }));
    setQuarters(initialQuarters);

    setStep('positions');
  };

  const handlePlayerMoved = (playerId: string, newPosition: Position) => {
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, position: newPosition } : p));
  };

  const handlePositionsComplete = () => {
    setStep('planner');
  };

  const handleQuarterUpdate = (qIndex: number, update: Partial<Quarter>) => {
    setQuarters(prev => {
      const qs = [...prev];
      qs[qIndex] = { ...qs[qIndex], ...update };
      return qs;
    });
  };

  return (
    <div className="app-container">
      <h1 className="title">Soccer Squad Planner</h1>
      {step === 'setup' && (
        <SetupScreen onComplete={handleSetupComplete} />
      )}
      {step === 'positions' && (
        <PositionCategorizer
          players={players}
          onPlayerMoved={handlePlayerMoved}
          onContinue={handlePositionsComplete}
        />
      )}
      {step === 'planner' && (
        <PlannerScreen
          players={players}
          quarters={quarters}
          onQuarterUpdate={handleQuarterUpdate}
        />
      )}
    </div>
  );
}
