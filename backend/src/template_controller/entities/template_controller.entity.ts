import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Controller } from '../../controller/entities/controller.entity';
import { Cluster } from 'src/cluster/entities/cluster.entity';
import { ControllerSession } from 'src/controller-session/entities/controller-session.entity';

@Entity({ name: 'template_ecdap' })
export class Template {
  @PrimaryGeneratedColumn('uuid')
  template_id: string;

  @Column({ type: 'jsonb' })
  config_ec_dap: any;

  @ManyToOne(() => Cluster, cluster => cluster.templates)
  @JoinColumn({ name: 'cluster_id' })
  cluster: Cluster;

  @Column()
  name: string;

  @Column()
  dap_count: number;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => Controller, controller => controller.template, { cascade: true })
  controllers: Controller[];
  
  @OneToMany(() => ControllerSession, controllerSession => controllerSession.controller, { cascade: true })
  controllerSessions: ControllerSession[];
}
