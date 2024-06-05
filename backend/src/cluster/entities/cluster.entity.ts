import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Template } from 'src/template_controller/entities/template_controller.entity';
import { Controller } from 'src/controller/entities/controller.entity';

@Entity({ name: 'cluster' })
export class Cluster extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  cluster_id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 8 })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  longitude: number;

  @Column()
  timezone: string;

  @Column()
  devicesCount: number;

  @OneToMany(() => Template, template => template.cluster, { cascade: true })
  templates: Template[];

  @OneToMany(() => Controller, controller => controller.cluster, { cascade: true })
  controllers: Controller[];
}
