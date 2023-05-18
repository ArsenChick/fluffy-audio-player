import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter, Input, Output,
  OnChanges, SimpleChanges,
} from '@angular/core';
import { Subject, catchError, of, takeUntil } from 'rxjs';

import { ApiService } from '../../../../services/api.service';
import { AudioEntity } from '../../../../interfaces/audio-entity.interface';

@Component({
  selector: 'fluffy-song-info',
  templateUrl: './song-info.component.html',
  styleUrls: ['./song-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongInfoComponent implements OnChanges {
  @Input() songId?: number;
  @Output() infoLoaded = new EventEmitter();

  audio?: AudioEntity;
  error?: string;

  private unsubscriber$ = new Subject<void>();

  constructor(
    private readonly apiService: ApiService,
    private readonly changeDetectionRef: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.error = undefined;
    this.unsubscriber$.next();

    if (changes['songId']) {
      this.apiService.getAudioInfoById(changes['songId'].currentValue)
        .pipe(
          takeUntil(this.unsubscriber$),
          catchError(() => of(null)))
        .subscribe(audio => {
          if (audio !== null) {
            this.audio = audio;
            this.infoLoaded.emit('loaded');
          } else {
            this.error = "Couldn't get audio info";
            this.infoLoaded.emit('error');
          }
          this.changeDetectionRef.detectChanges();
        });
    }
  }
}
