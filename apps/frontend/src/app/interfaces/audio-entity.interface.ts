export interface AudioEntity {
  id: number;
  title: string;
  filename: string;
  bpm: number;
  beats: Array<number>;
  key: string;
  scale: string;
  happiness: number;
  danceability: number;
  sadness: number;
}
