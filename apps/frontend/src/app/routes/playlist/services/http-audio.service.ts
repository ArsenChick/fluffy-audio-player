import { Injectable } from "@angular/core";
import { catchError, forkJoin, map, switchMap, throwError } from "rxjs";

import { ApiService } from "../../../services/api.service";
import { AudioStub } from "../interfaces/audio-stub.interface";

@Injectable({
  providedIn: 'root'
})
export class HttpAudioService {

  constructor(
    private apiService: ApiService
  ) {}

  getSongs(mood: string) {
    return this.apiService.getPlaylistByMood(mood).pipe(
      switchMap(ids => {
        const requests = ids.map(id =>this.apiService.getAudioInfoById(id));
        return forkJoin(requests);
      }),
      map(audios => audios.map(audio => {
        const { id, title, filename } = audio;
        const audioStub: AudioStub = {
          id, title, url: 'http://localhost:9000/audio/' + filename
        };
        return audioStub;
      })),
      catchError(error => throwError(() => error)),
    )
  }
}
