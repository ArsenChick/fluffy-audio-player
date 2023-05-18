import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';

import { SharedModule } from '../../shared/shared.module';

import { PlaylistComponent } from './playlist.component';
import { SongInfoComponent } from './components/song-info/song-info.component';
import { AudioService } from './services/audio.service';
import { HttpAudioService } from './services/http-audio.service';

@NgModule({
  declarations: [
    PlaylistComponent,
    SongInfoComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatListModule,
    MatSliderModule,
    MatDividerModule
  ],
  providers: [
    AudioService,
    HttpAudioService,
  ],
})
export class PlaylistModule { }
