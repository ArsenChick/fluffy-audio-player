import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { AudioEntity } from '../entities/audio.entity';
import { AudioAnalysis, AudioStub } from '../interfaces/audio.interface';
import { MOOD_CRITERIA_MAP, PLAYLIST_LIMIT } from '../constants/constants';
import { Mood } from '../interfaces/mood.enum';

@Injectable()
export class DatabaseService {
  constructor (
    @InjectRepository(AudioEntity)
    private readonly audioRepository: Repository<AudioEntity>,
    private readonly dataSource: DataSource
  ) {}

  findOneById(id: number): Promise<AudioEntity> {
    return this.audioRepository.findOneBy({id});
  }

  createStub(audioStub: AudioStub): Promise<AudioEntity> {
    const audio = this.audioRepository.create(audioStub);
    return this.audioRepository.save(audio);
  }

  async updateAnalysis(
    filename: string,
    analysis: AudioAnalysis
  ): Promise<AudioEntity> {
    const audio = await this.audioRepository.findOneBy({filename});
    const updAudio = this.audioRepository
      .merge(audio, { ...analysis, isAnalyzed: true });
    return this.audioRepository.save(updAudio);
  }

  async getRandomTracksByMood(mood: Mood): Promise<Partial<AudioEntity>[]> {
    const audios = this.dataSource
      .createQueryBuilder()
      .select('audio.audio_id', 'id')
      .from((subQuery) => {
        return subQuery
          .select('audio')
          .from(AudioEntity, 'audio')
          .where('audio.isAnalyzed = TRUE')
          .andWhere(MOOD_CRITERIA_MAP.get(mood))
          .orderBy('RAND()')
          .limit(PLAYLIST_LIMIT);
      }, 'audio')
      .orderBy('audio.audio_bpm')
      .getRawMany();
    return audios;
  }
}
