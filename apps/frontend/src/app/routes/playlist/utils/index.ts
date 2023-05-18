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
