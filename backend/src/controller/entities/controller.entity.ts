import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, AfterInsert, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert, PrimaryColumn, AfterRemove } from 'typeorm';
import { Template } from '../../template_controller/entities/template_controller.entity';
import { ConfigEcDap } from '../../config-ec-dap/entities/config-ec-dap.entity';
import { ControllerSession } from '../../controller-session/entities/controller-session.entity';
import { ConfigSensor } from 'src/config-sensor/entities/config-sensor.entity';
import { Cluster } from 'src/cluster/entities/cluster.entity';
import { ManagementController } from 'src/management-controller/entities/management-controller.entity';
import { LogController } from 'src/log-controller/entities/log-controller.entity';

import * as moment from 'moment-timezone';

@Entity()
export class Controller {
  @PrimaryColumn()
  controller_id: string;

  @ManyToOne(() => Cluster, cluster => cluster.controllers, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'cluster_id' })
  cluster: Cluster;

  @ManyToOne(() => Template, template => template.controllers, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'template_id' })
  template: Template;

  @Column()
  name: string;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => ConfigEcDap, configEcDap => configEcDap.controllers, { cascade: true })
  configEcDaps: ConfigEcDap[];

  @OneToMany(() => ControllerSession, controllerSession => controllerSession.controllers, { cascade: true })
  controllerSessions: ControllerSession[];

  @OneToMany(() => ConfigSensor, configSensor => configSensor.controllers, { cascade: true })
  configSensors: ConfigSensor[];

  @OneToMany(() => ManagementController, managementController => managementController.controllers, { cascade: true })
  managementControllers: ManagementController[];

  @OneToMany(() => LogController, logController => logController.controllers, { cascade: true })
  logControllers: LogController[];

  @AfterInsert()
  async incrementDevicesCount() {
    this.cluster.devicesCount += 1;
    await this.cluster.save();
  }

  @AfterRemove()
  async decrementDevicesCount() {
    this.cluster.devicesCount -= 1;
    await this.cluster.save();
  }

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

}
