import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import { AudioAnalysis } from '../interfaces/audio.interface';

@Injectable()
export class AnalyzeService {
  constructor(private readonly httpService: HttpService) {}

  private url = 'http://localhost:8000/analyze';

  async analyzeFile(name: string): Promise<AudioAnalysis> {
    const requestParams = { f: name };
    const { data } = await firstValueFrom(
      this.httpService.get<AudioAnalysis>(this.url, { params: requestParams }).pipe(
        catchError((error: AxiosError) => {
          console.log(error);
          throw 'An error happened';
        })
      )
    )
    return data;
  }
}
