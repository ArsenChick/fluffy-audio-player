import { StreamState } from "../interfaces/stream-state.interface";

export function createDefaultStreamState(): StreamState {
  return {
    playing: false,
    verboseCurrentTime: "",
    verboseDuration: "",
    duration: undefined,
    currentTime: undefined,
    canplay: false,
    error: false
  }
}

export function calcOffsetAndEnd(
  currentTimeInSeconds: number,
  beats: Array<number>
) {
  const currentTimeInMs = currentTimeInSeconds * 1000;
  const firstGreater = beats.find((v) => v > currentTimeInMs);

  const offset = firstGreater !== undefined
    ? firstGreater - currentTimeInMs : 0;
  const end = firstGreater !== undefined
    ? beats[beats.length - 1] - currentTimeInMs : undefined;

  return { offset, end };
}
