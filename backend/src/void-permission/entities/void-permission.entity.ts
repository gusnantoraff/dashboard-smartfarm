import { Membership } from "src/membership/entities/membership.entity";
import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as moment from 'moment-timezone';

@Entity()
export class VoidPermission {
    @PrimaryColumn()
    void_permission_id: string;

    @Column()
    type: string;

    @Column()
    action: string;

    @ManyToOne(() => Membership, membership => membership.voidPermissions, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'membership_id' })
    memberships: Membership;

    @Column()
    requested_by: string;

    @Column()
    requested_at: Date;

    @Column()
    requested_to: string;

    @Column()
    accept_by: string;

    @Column()
    accept_at: Date;

    @Column()
    status: string;

    @CreateDateColumn({ type: 'timestamp' })
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
