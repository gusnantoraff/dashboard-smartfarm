import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { Controller } from '../../controller/entities/controller.entity';
import { ControllerSession } from 'src/controller-session/entities/controller-session.entity';
import { LogController } from 'src/log-controller/entities/log-controller.entity';

@Entity()
export class ConfigEcDap {
  @PrimaryColumn()
  config_ec_dap_id: string;

  @ManyToOne(() => Controller, controller => controller.configEcDaps, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
  @JoinColumn({ name: 'controller_id' })
  controllers: Controller;

  @ManyToOne(() => ControllerSession, controllerSession => controllerSession.configEcDaps, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
  @JoinColumn({ name: 'controller_session_id' })
  controllerSessions: ControllerSession;

  @Column({ type: 'float'})
  ec: number;

  @Column()
  date_start: Date;

  @Column()
  date_end: Date;

  @Column()
  dap_num: number;

  @OneToMany(() => LogController, logController => logController.configEcDaps, { cascade: true })
  logControllers: LogController[];

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
