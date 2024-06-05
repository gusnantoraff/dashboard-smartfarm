import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Controller } from 'src/controller/entities/controller.entity';

@Entity()
export class ConfigSensor {
  @PrimaryGeneratedColumn('uuid')
  config_sensor_id: string;

  @ManyToOne(() => Controller, controller => controller.configSensors)
  @JoinColumn({ name: 'controller_id' })
  controller: Controller;

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
}
