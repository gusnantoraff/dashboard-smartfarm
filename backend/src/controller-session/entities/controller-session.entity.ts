import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryColumn } from 'typeorm';
import { Controller } from '../../controller/entities/controller.entity';
import { Template } from '../../template_controller/entities/template_controller.entity';
import { ConfigEcDap } from 'src/config-ec-dap/entities/config-ec-dap.entity';
import { LogController } from 'src/log-controller/entities/log-controller.entity';

@Entity()
export class ControllerSession {
  @PrimaryColumn()
  controller_session_id: string;

  @ManyToOne(() => Controller, controller => controller.controllerSessions, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
  @JoinColumn({ name: 'controller_id' })
  controllers: Controller;

  @Column()
  dap_first_date_time: Date;

  @Column()
  dap_first_end_time: Date;

  @ManyToOne(() => Template, template => template.controllerSessions, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
  @JoinColumn({ name: 'template_id' })
  template: Template;

  @Column({ type: 'jsonb' })
  config_sensor: any;

  @OneToMany(() => ConfigEcDap, configEcDap => configEcDap.controllerSessions, { cascade: true })
  configEcDaps: ConfigEcDap[];

  
  @OneToMany(() => LogController, logController => logController.controllerSessions, { cascade: true })
  logControllers: LogController[];

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
