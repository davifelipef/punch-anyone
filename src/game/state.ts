import type { GameState } from "../types";

export const state: GameState = {
  damage: 0,
  punches: [],
};

export function addPunch(
  x: number,
  y: number,
  power: number
) {
  state.punches.push({
    x,
    y,
    power,
    createdAt: Date.now(),
    impactCreated: false,
  });
}