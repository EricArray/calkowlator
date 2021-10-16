export interface Defender {
  name?: string;
  defense: 2 | 3 | 4 | 5 | 6;
  nerve: {
    waver: number | 'fearless';
    rout: number;
  };
  wasLoaded?: boolean;
}

export function cloneDefender(defender: Defender): Defender {
  return {
    ...defender,
    nerve: { ...defender.nerve }
  }
}