export interface Punch {
  x: number;
  y: number;
  power: number;
  createdAt: number;
}

export interface GameState {
  damage: number;
  punches: Punch[];
}