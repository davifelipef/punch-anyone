export interface Punch {
  x: number;
  y: number;
  power: number;
  createdAt: number;
  impactCreated: boolean;
}

export interface GameState {
  damage: number;
  punches: Punch[];
}