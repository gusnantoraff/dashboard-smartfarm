import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Controller } from '../../controller/entities/controller.entity';
import { Template } from '../../template_controller/entities/template_controller.entity';
import { ConfigEcDap } from 'src/config-ec-dap/entities/config-ec-dap.entity';

@Entity()
export class ControllerSession {
  @PrimaryGeneratedColumn('uuid')
  controller_session_id: string;

  @ManyToOne(() => Controller, controller => controller.controllerSessions)
  @JoinColumn({ name: 'controller_id' })
  controller: Controller;

  @Column()
  dap_first_date_time: Date;

  @Column()
  dap_first_end_time: Date;

  @ManyToOne(() => Template, template => template.controllerSessions)
  @JoinColumn({ name: 'template_id' })
  template: Template;

  @Column({ type: 'jsonb' })
  config_sensor: any;

  @OneToMany(() => ConfigEcDap, configEcDap => configEcDap.controllerSession, { cascade: true })
  configEcDaps: ConfigEcDap[];
}
