import type { GameState, Punch } from "../types";

export const state: GameState = {
  damage: 0,
  punches: [],
};

export function addPunch(
  x: number,
  y: number,
  power: number
) {
  const punch: Punch = {
    x,
    y,
    power,
    createdAt: Date.now(),
  };

  state.punches.push(punch);
}