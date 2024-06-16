import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryColumn } from 'typeorm';
import { Controller } from '../../controller/entities/controller.entity';
import { Membership } from 'src/membership/entities/membership.entity';

@Entity()
export class ManagementController {
  @PrimaryColumn()
  management_controller_id: string;
  
  @ManyToOne(() => Membership, membership => membership.managementControllers, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'membership_id' })
  memberships: Membership;

  @ManyToOne(() => Controller, controller => controller.managementControllers, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'controller_id' })
  controllers: Controller;

  @Column()
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
