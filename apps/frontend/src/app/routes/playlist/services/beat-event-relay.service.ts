import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { BeatEvent } from "../interfaces/beat-events.enum";

@Injectable({
  providedIn: 'root'
})
export class BeatEventRelayService {
  private eventSubject$ = new Subject<BeatEvent>();

  messageStart() {
    this.eventSubject$.next(BeatEvent.Start);
  }

  messagePause() {
    this.eventSubject$.next(BeatEvent.Pause);
  }

  messageEnd() {
    this.eventSubject$.next(BeatEvent.End);
  }

  getEvents() {
    return this.eventSubject$.asObservable();
  }
}
