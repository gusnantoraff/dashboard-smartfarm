import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { Controller } from 'src/controller/entities/controller.entity';
import { LogController } from 'src/log-controller/entities/log-controller.entity';

@Entity()
export class ConfigSensor {
  @PrimaryColumn()
  config_sensor_id: string;

  @ManyToOne(() => Controller, controller => controller.configSensors, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
  @JoinColumn({ name: 'controller_id' })
  controllers: Controller;

  @Column()
  ph_up: number;

  @Column()
  humidity: number;

  @Column()
  ec: number;

  @Column()
  ph_down: number;

  @Column()
  water_flow: number;

  @Column()
  temperature_air_min: number;

  @Column()
  temperature_air_max: number;

  @Column()
  peristaltic_pump_duration: number;

  @Column()
  peristaltic_pump_period: number;

  @Column()
  ec_mode: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
