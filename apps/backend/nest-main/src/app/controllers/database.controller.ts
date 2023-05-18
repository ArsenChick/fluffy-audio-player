import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';

import { DatabaseService } from '../services/database.service';
import { isValidMood } from '../utils/mood-check';
import { applyOrderToArray } from '../utils/playlist-order';
import { PLAYLIST_LIMIT } from '../constants/constants';
import { Mood } from '../interfaces/mood.enum';

@Controller()
export class DatabaseController {
  constructor(
    private readonly databaseService: DatabaseService
  ) {}

  @Get('get-audio')
  async getAudioEntityById(
    @Query('id') id: number,
    @Res() response: Response
  ) {
    if (!id) {
      response.status(400).json('Bad Request');
    } else {
      this.databaseService.findOneById(id)
        .then((audio) => {
          if (!audio) response.status(404).json('Not Found');
          else response.json(audio);
        });
    }
  }

  @Get('generate-playlist')
  async generatePlaylistByMood(
    @Query('mood') mood: Mood,
    @Res() response: Response
  ) {
    if (!mood || !isValidMood(mood)) {
      response.status(400).json('Bad Request');
    } else {
      this.databaseService.getRandomTracksByMood(mood)
        .then((ids) => {
          if (!ids || ids.length < PLAYLIST_LIMIT)
            response.status(400).json('Not enough tracks to generate playlist');
          else response.json(applyOrderToArray(ids));
        });
    }
  }
}
