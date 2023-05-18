export interface AudioStub {
  title: string;
  filename: string;
}

export interface AudioAnalysis {
  bpm: number;
  beats: Array<number>;
  key: string;
  scale: string;
  happiness: number;
  danceability: number;
  sadness: number;
}
