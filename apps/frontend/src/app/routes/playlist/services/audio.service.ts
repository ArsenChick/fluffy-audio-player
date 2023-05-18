import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, takeUntil } from "rxjs";
import { Duration } from 'luxon';

import { AUDIO_EVENTS } from "../constants/audio-events.const";
import { createDefaultStreamState } from "../utils";
import { StreamState } from "../interfaces/stream-state.interface";

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private audioHTMLObject = new Audio();
  private state = createDefaultStreamState();
  private stop$ = new Subject();
  private stateChange$: BehaviorSubject<StreamState> =
    new BehaviorSubject(this.state);

  playStream(url: string): Observable<Event> {
    return this.streamObservable(url)
      .pipe(takeUntil(this.stop$));
  }

  getState(): Observable<StreamState> {
    return this.stateChange$.asObservable();
  }

  play() {
    this.audioHTMLObject.play();
  }

  pause() {
    this.audioHTMLObject.pause();
  }

  stop() {
    this.stop$.next(0);
  }

  seekTo(ms: number) {
    this.audioHTMLObject.currentTime = ms;
  }

  private formatTime(time: number, format: string = 'm:ss') {
    const dur = Duration.fromMillis(time * 1000);
    return dur.toFormat(format);
  }

  private resetState() {
    this.state = createDefaultStreamState();
  }

  private streamObservable(url: string): Observable<Event> {
    return new Observable(observer => {
      this.audioHTMLObject.src = url;
      this.audioHTMLObject.load();
      this.audioHTMLObject.play();

      const handler = (event: Event) => {
        observer.next(event);
        this.updateStateEvents(event);
      };

      this.addEvents(this.audioHTMLObject, handler);
      return () => {
        this.audioHTMLObject.pause();
        this.audioHTMLObject.currentTime = 0;
        this.removeEvents(this.audioHTMLObject, handler);
        this.resetState();
      }
    })
  }

  private addEvents(
    obj: HTMLAudioElement,
    handler: (event: Event) => void
  ) {
    AUDIO_EVENTS.forEach(event => {
      obj.addEventListener(event, handler);
    });
  }

  private removeEvents(
    obj: HTMLAudioElement,
    handler: (event: Event) => void
  ) {
    AUDIO_EVENTS.forEach(event => {
      obj.removeEventListener(event, handler);
    });
  }

  private updateStateEvents(event: Event) {
    switch (event.type) {
      case 'canplay':
        this.state.duration = this.audioHTMLObject.duration;
        this.state.verboseDuration =
          this.formatTime(this.state.duration);
        this.state.canplay = true;
        break;
      case 'playing':
        this.state.playing = true;
        break;
      case 'pause':
        this.state.playing = false;
        break;
      case 'timeupdate':
        this.state.currentTime = this.audioHTMLObject.currentTime;
        this.state.verboseCurrentTime =
          this.formatTime(this.state.currentTime);
        break;
      case 'error':
        this.resetState();
        this.state.error = true;
        break;
    }
    this.stateChange$.next(this.state);
  }
}
