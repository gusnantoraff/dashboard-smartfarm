import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert, PrimaryColumn } from 'typeorm';
import { Controller } from '../../controller/entities/controller.entity';
import { Cluster } from 'src/cluster/entities/cluster.entity';
import { ControllerSession } from 'src/controller-session/entities/controller-session.entity';
import * as moment from 'moment-timezone';

@Entity({ name: 'template_ecdap' })
export class Template {
  @PrimaryColumn()
  template_id: string;

  @Column({ type: 'jsonb' })
  config_ec_dap: any;

  @ManyToOne(() => Cluster, cluster => cluster.templates, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
  @JoinColumn({ name: 'cluster_id' })
  cluster: Cluster;

  @Column()
  name: string;

  @Column()
  dap_count: number;

  @Column()
  is_active: boolean;

  @OneToMany(() => Controller, controller => controller.template, { cascade: true })
  controllers: Controller[];
  
  @OneToMany(() => ControllerSession, controllerSession => controllerSession.controllers, { cascade: true })
  controllerSessions: ControllerSession[];
  
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

  @Column({ type: 'jsonb', nullable: true })
  ecData: any;

  @Column({nullable: true})
  controllerCount: number;
  
}
