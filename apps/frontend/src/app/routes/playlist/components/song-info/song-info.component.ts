import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter, Input, Output,
  SimpleChanges, ViewChild, ComponentRef,
  OnInit, OnChanges, OnDestroy,
} from '@angular/core';
import { Subject, Subscription, catchError, delay, of, takeUntil } from 'rxjs';

import { BeatTickComponent } from '../beat-tick/beat-tick.component';
import { AudioService } from '../../services/audio.service';
import { ApiService } from '../../../../services/api.service';
import { BeatService } from '../../services/beat.service';
import { AudioEntity } from '../../../../interfaces/audio-entity.interface';
import { BeatScaleHostDirective } from '../../directives/beat-scale-host.directive';
import { ANIMATION_DURATION_MS } from '../../constants/audio-events.const';
import { calcOffsetAndEnd } from '../../utils';
import { BeatEvent } from '../../interfaces/beat-events.enum';
import { BeatEventRelayService } from '../../services/beat-event-relay.service';

@Component({
  selector: 'fluffy-song-info',
  templateUrl: './song-info.component.html',
  styleUrls: ['./song-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongInfoComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() songId?: number;
  @Output() infoLoaded = new EventEmitter();
  @ViewChild(
    BeatScaleHostDirective
  ) beatScaleHost?: BeatScaleHostDirective;

  audio?: AudioEntity;
  error?: string;
  currentTime?: number;
  componentRefMap: ComponentRef<BeatTickComponent>[] = [];
  beatSubscriptions: Subscription[] = [];

  private changeUnsubscriber$ = new Subject<void>();
  private destoryUnsubscriber$ = new Subject<void>();

  constructor(
    private readonly apiService: ApiService,
    private readonly beatService: BeatService,
    private readonly beatEventRelayService: BeatEventRelayService,
    private readonly audioService: AudioService,
    private readonly changeDetectionRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.audioService.getState().pipe(
      takeUntil(this.destoryUnsubscriber$)
    ).subscribe(state => this.currentTime = state.currentTime);
    this.beatEventRelayService.getEvents().pipe(
      takeUntil(this.destoryUnsubscriber$)
    ).subscribe(beatEvent => {
      switch (beatEvent) {
        case BeatEvent.Pause:
          this.beatService.stopBeats();
          this.clearAllTicks();
          break;
        case BeatEvent.Start:
          this.startBeats();
          break;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.error = undefined;
    this.changeUnsubscriber$.next();

    if (changes['songId']) {
      this.clearAllTicks();
      this.apiService.getAudioInfoById(changes['songId'].currentValue)
        .pipe(
          takeUntil(this.changeUnsubscriber$),
          catchError(() => of(null)))
        .subscribe(audio => {
          if (audio !== null) {
            this.audio = audio;
            this.audio.beats = this.audio.beats
              .map(v => v - ANIMATION_DURATION_MS);
            this.infoLoaded.emit('loaded');
          } else {
            this.error = "Couldn't get audio info";
            this.infoLoaded.emit('error');
          }
        });
    }
  }

  ngOnDestroy() {
    this.changeUnsubscriber$.next();
    this.destoryUnsubscriber$.next();
  }

  private startBeats() {
    if (this.audio) {
      const { offset, end } = calcOffsetAndEnd(
        this.currentTime ?? 0,
        this.audio.beats
      )
      if (end !== undefined)
        this.setupBeats(this.audio.bpm, offset, end);
    }
  }

  private clearAllTicks() {
    this.changeDetectionRef.detectChanges();
    if (this.beatScaleHost) {
      const viewContainerRef = this.beatScaleHost.viewContainerRef;
      viewContainerRef.clear();
    }

    this.componentRefMap.forEach(cr => cr.destroy());
    this.componentRefMap = [];
    this.beatSubscriptions.forEach(sub => sub.unsubscribe());
    this.beatSubscriptions = [];
  }

  private createTick() {
    if (this.beatScaleHost) {
      const viewContainerRef = this.beatScaleHost.viewContainerRef;
      const componentRef = viewContainerRef.createComponent(BeatTickComponent);
      this.componentRefMap.push(componentRef);
      this.changeDetectionRef.detectChanges();
    }
  }

  private deleteOldestTick() {
    const componentRef = this.componentRefMap.shift();
    if (componentRef) componentRef.destroy();
    this.changeDetectionRef.detectChanges();
  }

  private setupBeats(bpm: number, offset: number, end: number) {
    this.changeDetectionRef.detectChanges();
    if (this.beatScaleHost) {
      const obs = this.beatService.setupBeats(bpm, offset, end);
      this.beatSubscriptions.push(obs.subscribe(() => this.createTick()));
      this.beatSubscriptions.push(
        obs.pipe(delay(ANIMATION_DURATION_MS)).subscribe(() =>
          this.deleteOldestTick()));
    }
  }
}
