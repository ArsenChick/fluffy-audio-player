import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, OnDestroy, OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSliderDragEvent } from '@angular/material/slider';
import { Subject, catchError, of, takeUntil } from 'rxjs';

import { AudioService } from './services/audio.service';
import { HttpAudioService } from './services/http-audio.service';
import { BeatEventRelayService } from './services/beat-event-relay.service';

import { createDefaultStreamState } from './utils';
import { AudioStub } from './interfaces/audio-stub.interface';
import { StreamState } from './interfaces/stream-state.interface';

@Component({
  selector: 'fluffy-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistComponent implements OnInit, OnDestroy {

  private notifier$ = new Subject();

  mood: string | null = null;
  songs: Array<AudioStub> = [];

  state: StreamState = createDefaultStreamState();
  currentSong: { index?: number, audio?: AudioStub } = {};

  errorMsg?: string;
  songStarted = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly changeDetectionRef: ChangeDetectorRef,
    private readonly audioService: AudioService,
    private readonly beatEventRelayService: BeatEventRelayService,
    private readonly httpAudioService: HttpAudioService,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.mood = params.get('mood');
      if (this.mood === null)
        this.router.navigate(['']);
      else {
        this.httpAudioService.getSongs(this.mood)
          .pipe(
            takeUntil(this.notifier$),
            catchError(error => of<string>(error.error)))
          .subscribe(result => {
            if (typeof result !== 'string')
              this.songs = result;
            else
              this.errorMsg = result;
            this.changeDetectionRef.detectChanges();
          });
      }
      this.changeDetectionRef.detectChanges();
    });
    this.audioService.getState().pipe(takeUntil(this.notifier$))
      .subscribe(state => {
        this.state = state;
        this.changeDetectionRef.detectChanges();
      });
  }

  ngOnDestroy() {
    this.audioService.stop();
  }

  openFile(audio: AudioStub, index: number) {
    if (this.currentSong.index === index)
      this.togglePlayPause()
    else {
      this.currentSong = { index, audio };
      this.audioService.stop();
      this.audioService.resetState();
      this.songStarted = false;
    }
  }

  onInfoLoaded(value: string) {
    if (this.currentSong.audio) {
      this.playStream(this.currentSong.audio.url);
    }
  }

  togglePlayPause() {
    if (this.state.canplay) {
      if (this.state.playing) {
        this.audioService.pause();
        this.beatEventRelayService.messagePause();
      } else {
        this.audioService.play();
        this.beatEventRelayService.messageStart();
      }
    }
  }

  playNext() {
    if (this.currentSong.index !== undefined && !this.isLastPlaying()) {
      const index = this.currentSong.index + 1;
      const song = this.songs[index];
      this.openFile(song, index);
    }
  }

  playPrevious() {
    if (this.currentSong.index !== undefined && !this.isFirstPlaying()) {
      const index = this.currentSong.index - 1;
      const song = this.songs[index];
      this.openFile(song, index);
    }
  }

  isFirstPlaying() {
    return this.currentSong.index === 0;
  }

  isLastPlaying() {
    return this.currentSong.index === this.songs.length - 1;
  }

  onSliderRelease(change: MatSliderDragEvent) {
    this.audioService.seekTo(change.value);
    this.beatEventRelayService.messagePause();
    if (this.state.playing)
      this.beatEventRelayService.messageStart();
  }

  private playStream(url: string) {
    this.audioService.playStream(url).subscribe(event => {
      switch (event.type) {
        case 'canplay':
          if (!this.songStarted) {
            this.beatEventRelayService.messageStart();
            this.songStarted = true;
          }
          break;
        case 'ended':
          if (this.isLastPlaying())
            this.audioService.stop();
          else
            this.playNext();
          break;
      }
    })
  }
}
