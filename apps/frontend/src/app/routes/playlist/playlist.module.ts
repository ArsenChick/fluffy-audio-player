import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

import { SharedModule } from '../../shared/shared.module';

import { PlaylistComponent } from './playlist.component';
import { SongInfoComponent } from './components/song-info/song-info.component';
import { BeatTickComponent } from './components/beat-tick/beat-tick.component';

import { AudioService } from './services/audio.service';
import { BeatService } from './services/beat.service';
import { BeatEventRelayService } from './services/beat-event-relay.service';
import { HttpAudioService } from './services/http-audio.service';

import { BeatScaleHostDirective } from './directives/beat-scale-host.directive';

@NgModule({
  declarations: [
    PlaylistComponent,
    SongInfoComponent,
    BeatTickComponent,
    BeatScaleHostDirective,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatListModule,
    MatSliderModule,
    MatDividerModule,
    MatChipsModule
  ],
  providers: [
    AudioService,
    BeatService,
    BeatEventRelayService,
    HttpAudioService,
  ],
})
export class PlaylistModule { }
