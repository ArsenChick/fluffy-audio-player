import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AudioEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  filename: string;

  @Column({ type: "int", nullable: true, default: null })
  bpm?: number;

  @Column({ nullable: true, default: null })
  key?: string;

  @Column({ nullable: true, default: null })
  scale?: string;

  @Column({ type: 'simple-array', nullable: true, default: null })
  beats?: Array<number>;

  @Column({ type: 'float', nullable: true, default: null })
  happiness?: number;

  @Column({ type: 'float', nullable: true, default: null })
  danceability?: number;

  @Column({ type: 'float', nullable: true, default: null })
  sadness?: number;

  @Column({ default: false })
  isAnalyzed: boolean;
}
