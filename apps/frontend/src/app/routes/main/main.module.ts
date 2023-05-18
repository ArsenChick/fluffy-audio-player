import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SharedModule } from '../../shared/shared.module';

import { MainComponent } from './main.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { PlaylistDialogComponent } from './components/playlist-dialog/playlist-dialog.component';

@NgModule({
  declarations: [
    MainComponent,
    FileUploadComponent,
    PlaylistDialogComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  providers: [],
})
export class MainModule { }
