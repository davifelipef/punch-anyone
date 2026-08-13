export interface ImpactEffect {
  x: number;
  y: number;
  createdAt: number;
}

export const impacts: ImpactEffect[] = [];

export function addImpact(x: number, y: number) {
  impacts.push({
    x,
    y,
    createdAt: Date.now(),
  });
}