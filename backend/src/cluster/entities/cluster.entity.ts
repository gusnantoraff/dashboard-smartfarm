import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'cluster' })
export class Cluster {
  @PrimaryGeneratedColumn('uuid')
  cluster_id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 8 })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  longitude: number;
}