import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ConfigEcDap } from '../../config-ec-dap/entities/config-ec-dap.entity';
import { ConfigSensor } from "src/config-sensor/entities/config-sensor.entity";
import { Controller } from "src/controller/entities/controller.entity";
import { ControllerSession } from "src/controller-session/entities/controller-session.entity";

  @Entity()
  export class LogController {
  @PrimaryColumn()
  log_controller_id: string;
  
  @ManyToOne(() => Controller, controller => controller.logControllers, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'controller_id' })
  controllers: Controller;

  @ManyToOne(() => ConfigEcDap, configEcDap => configEcDap.logControllers, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'config_ec_dap_id' })
  configEcDaps: ConfigEcDap;

  @ManyToOne(() => ControllerSession, controllerSession => controllerSession.logControllers, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'controller_session_id' })
  controllerSessions: ControllerSession;

  @Column()
  dap_first_time: Date;

  @Column()
  temperature_water: number;

  @Column()
  humidity: number;

  @Column({ type: 'float'})
  ec: number;

  @Column({ type: 'jsonb'})
  ph: number[];

  @Column({ type: 'float'})
  water_flow: number;

  @Column({ type: 'jsonb'})
  temperature_air: number[];

  @Column()
  dap_num: number;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
