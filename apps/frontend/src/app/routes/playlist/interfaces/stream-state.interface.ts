export interface StreamState {
  playing: boolean;
  verboseCurrentTime: string;
  verboseDuration: string;
  duration?: number;
  currentTime?: number;
  canplay: boolean;
  error: boolean;
}
