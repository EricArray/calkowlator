export interface Defender {
  defense: 2 | 3 | 4 | 5 | 6;
  nerve: {
    waver: number | 'fearless';
    rout: number;
  }
}
