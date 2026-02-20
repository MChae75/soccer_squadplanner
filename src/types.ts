export type Position = 'GK' | 'DF' | 'MF' | 'FW' | 'Unassigned';

export interface Player {
  id: string;
  name: string;
  position: Position;
}

export interface Quarter {
  id: number;
  formation: string;
  assignments: Record<string, string>; // Maps SlotID -> PlayerID
  customCoordinates?: Record<string, { x: number, y: number }>;
}

export interface SlotCoordinate {
  id: string;
  x: number; // Percentage 0-100 (left to right)
  y: number; // Percentage 0-100 (top to bottom)
  label: string; // e.g. "LB", "CB", "ST"
  position: Position; // e.g. "DF", "FW"
}

export type FormationDict = Record<string, SlotCoordinate[]>;
