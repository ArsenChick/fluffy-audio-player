import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { PlaylistDialogComponent } from './components/playlist-dialog/playlist-dialog.component';

@Component({
  selector: 'fluffy-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  constructor (
    private dialog: MatDialog
  ) {}

  showUploadDialog() {
    this.dialog.open(FileUploadComponent);
  }

  showPlaylistDialog() {
    this.dialog.open(PlaylistDialogComponent);
  }
}
