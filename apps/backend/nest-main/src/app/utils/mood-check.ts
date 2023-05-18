import { MOOD_CRITERIA_MAP } from "../constants/constants";
import { Mood } from "../interfaces/mood.enum";

export function isValidMood(mood: Mood) {
  return Object.values(Mood).includes(mood) || MOOD_CRITERIA_MAP.has(mood);
}
