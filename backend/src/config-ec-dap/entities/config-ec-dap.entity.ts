import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Controller } from '../../controller/entities/controller.entity';
import { ControllerSession } from 'src/controller-session/entities/controller-session.entity';

@Entity()
export class ConfigEcDap {
  @PrimaryGeneratedColumn('uuid')
  config_ec_dap_id: string;

  @ManyToOne(() => Controller, controller => controller.configEcDaps)
  @JoinColumn({ name: 'controller_id' })
  controller: Controller;

  @ManyToOne(() => ControllerSession, controllerSession => controllerSession.configEcDaps)
  @JoinColumn({ name: 'controller_session_id' })
  controllerSession: ControllerSession;

  @Column()
  ec: string;

  @Column()
  date_start: Date;

  @Column()
  date_end: Date;

  @Column()
  dap_num: number;
}
