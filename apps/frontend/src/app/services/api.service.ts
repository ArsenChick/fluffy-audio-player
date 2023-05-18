import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';

import { AudioEntity } from '../interfaces/audio-entity.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  uploadAudio(audio: File) {
    const formData = new FormData();
    formData.append('file', audio);
    return this.http.post('/api/upload', formData);
  }

  getPlaylistByMood(mood: string) {
    const options = {
      params: new HttpParams().set('mood', mood)
    };

    return this.http.get<{ id: number }[]>(
      '/api/generate-playlist', options).pipe(
        catchError(error => throwError(() => error)),
        map(idArray => idArray.map(obj => obj.id)),
      );
  }

  getAudioInfoById(id: number) {
    const options = {
      params: new HttpParams().set('id', id)
    };

    return this.http.get<AudioEntity>(
      '/api/get-audio',
      options);
  }
}
