import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

import { PlaylistMood } from '../../../../interfaces/playlist-mood.enum';

@Component({
  selector: 'fluffy-playlist-dialog',
  templateUrl: './playlist-dialog.component.html',
  styleUrls: ['./playlist-dialog.component.scss'],
})
export class PlaylistDialogComponent {

  readonly playlistMood = PlaylistMood;

  constructor(
    private readonly dialogRef: MatDialogRef<PlaylistDialogComponent>,
    private readonly router: Router
  ) {}

  onOptionSelected(option: PlaylistMood) {
    this.dialogRef.close();
    this.router.navigate(['playlist'], { queryParams: { mood: option }});
  }
}
