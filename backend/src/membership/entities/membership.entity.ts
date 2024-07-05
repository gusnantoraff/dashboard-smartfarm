import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert, PrimaryColumn } from 'typeorm';
import { Cluster } from 'src/cluster/entities/cluster.entity';
import { User } from 'src/user/entities/user.entity';
import { ManagementController } from 'src/management-controller/entities/management-controller.entity';
import { VoidPermission } from 'src/void-permission/entities/void-permission.entity';
import * as moment from 'moment-timezone';

@Entity()
export class Membership {
  @PrimaryColumn()
  membership_id: string;

  @ManyToOne(() => Cluster, cluster => cluster.memberships, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'cluster_id' })
  cluster: Cluster;

  @ManyToOne(() => User, user => user.memberships, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  users: User;

  @Column()
  is_owner: boolean;

  @Column()
  is_first_owner: boolean;

  @Column()
  is_active: boolean;

  @Column({nullable: true})
  invited_by: string;

  @Column()
  invited_at: Date;

  @Column()
  status: string;

  @OneToMany(() => ManagementController, managementController => managementController.memberships, { cascade: true })
  managementControllers: ManagementController[];

  @OneToMany(() => VoidPermission, voidPermission => voidPermission.memberships, { cascade: true })
  voidPermissions: VoidPermission[];

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

