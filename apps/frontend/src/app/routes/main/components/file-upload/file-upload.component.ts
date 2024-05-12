import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { ApiService } from '../../../../services/api.service';
import { UploadStatus } from '../../interfaces/upload-status.enum';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'fluffy-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnDestroy {

  readonly statusEnum = UploadStatus;
  status: UploadStatus = UploadStatus.Idle;

  private readonly notifier = new Subject();

  constructor(
    public dialogRef: DialogRef<FileUploadComponent>,
    private apiService: ApiService,
    private changeDetectionRef: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    this.notifier.next(0);
    this.notifier.complete();
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];

    if (file) {
      this.status = UploadStatus.InProgress;
      this.apiService.uploadAudio(file)
        .pipe(takeUntil(this.notifier))
        .subscribe((data) => {
          this.status = UploadStatus.Done;
          this.changeDetectionRef.detectChanges();
        });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
