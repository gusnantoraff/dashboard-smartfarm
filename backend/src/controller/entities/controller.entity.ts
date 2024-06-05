import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, AfterInsert, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Template } from '../../template_controller/entities/template_controller.entity';
import { ConfigEcDap } from '../../config-ec-dap/entities/config-ec-dap.entity';
import { ControllerSession } from '../../controller-session/entities/controller-session.entity';
import { ConfigSensor } from 'src/config-sensor/entities/config-sensor.entity';
import { Cluster } from 'src/cluster/entities/cluster.entity';

@Entity()
export class Controller {
  @PrimaryGeneratedColumn('uuid')
  controller_id: string;

  @ManyToOne(() => Cluster, cluster => cluster.controllers, { eager: true })
  @JoinColumn({ name: 'cluster_id' })
  cluster: Cluster;

  @ManyToOne(() => Template, template => template.controllers, { eager: true })
  @JoinColumn({ name: 'template_id' })
  template: Template;

  @Column()
  name: string;

  @Column()
  dap_count: number;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => ConfigEcDap, configEcDap => configEcDap.controller, { cascade: true })
  configEcDaps: ConfigEcDap[];

  @OneToMany(() => ControllerSession, controllerSession => controllerSession.controller, { cascade: true })
  controllerSessions: ControllerSession[];

  @OneToMany(() => ConfigSensor, configSensor => configSensor.controller, { cascade: true })
  configSensors: ConfigSensor[];

  @AfterInsert()
  async incrementDevicesCount() {
    this.cluster.devicesCount += 1;
    await this.cluster.save();
  }
}
