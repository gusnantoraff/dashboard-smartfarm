import { Entity, Column, OneToMany, BaseEntity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert, PrimaryColumn } from 'typeorm';
import { Template } from 'src/template_controller/entities/template_controller.entity';
import { Controller } from 'src/controller/entities/controller.entity';
import { Membership } from 'src/membership/entities/membership.entity';
import * as moment from 'moment-timezone';


@Entity({ name: 'cluster' })
export class Cluster extends BaseEntity {
  @PrimaryColumn()
  cluster_id: string;

  @Column()
  name: string;

  @Column('decimal')
  latitude: number;

  @Column('decimal')
  longitude: number;

  @Column()
  timezone: string;

  @Column()
  devicesCount: number;

  @Column()
  owner: string;

  @OneToMany(() => Template, template => template.cluster, { cascade: true })
  templates: Template[];

  @OneToMany(() => Controller, controller => controller.cluster, { cascade: true })
  controllers: Controller[];

  @OneToMany(() => Membership, membership => membership.cluster, { cascade: true })
  memberships: Membership[];

  @CreateDateColumn({ type: 'timestamp'})
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @BeforeInsert()
  insertCreated() {
    this.created_at = new Date(moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'));
    this.updated_at = new Date(moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'));
  }
  
}
