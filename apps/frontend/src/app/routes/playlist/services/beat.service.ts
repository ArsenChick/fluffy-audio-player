import { Injectable } from "@angular/core";
import {
  Observable, Subject, Subscription,
  delay, interval, takeUntil, timer
} from "rxjs";

import { MS_IN_MINUTE } from "../constants/audio-events.const";

@Injectable({
  providedIn: 'root'
})
export class BeatService {
  private beatCancel$ = new Subject<void>();
  private beatObservable$ = new Observable<number>();

  private timerSubsciption = new Subscription();

  setupBeats(bpm: number, offset: number = 0, end?: number) {
    this.timerSubsciption.unsubscribe();
    const beatTimer = interval(MS_IN_MINUTE / bpm).pipe(
      delay(offset)
    );

    if (end !== undefined)
      this.scheduleEnd(end)

    this.beatObservable$ = beatTimer.pipe(
      takeUntil(this.beatCancel$));
    return this.beatObservable$;
  }

  stopBeats() {
    this.timerSubsciption.unsubscribe();
    this.beatCancel$.next();
  }

  private scheduleEnd(endpoint: number) {
    this.timerSubsciption = timer(endpoint).subscribe(() => {
      this.beatCancel$.next();
    });
  }
}
