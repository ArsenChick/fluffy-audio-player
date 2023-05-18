import { Mood } from "../interfaces/mood.enum";

export const PLAYLIST_LIMIT = 10;

export const PLAYLIST_ORDER = [0, 4, 5, 3, 9, 1, 2, 6, 8, 7];

export const MOOD_CRITERIA_MAP = new Map<Mood, string>([
  [Mood.Energetic, 'audio.happiness > 0.6 AND audio.danceability > 0.7'],
  [Mood.Calm, 'audio.happiness <= 0.6 AND audio.sadness <= 0.6 AND audio.danceability < 0.4'],
  [Mood.Happy, 'audio.happiness > 0.7'],
  [Mood.Melancholic, 'audio.sadness > 0.6 AND audio.danceability <= 0.5'],
  [Mood.NoMood, 'audio.isAnalyzed = TRUE']
])
