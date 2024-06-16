import * as moment from 'moment-timezone';
import { Membership } from 'src/membership/entities/membership.entity';
import { Role } from 'src/roles/roles.enum';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, BeforeInsert, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryColumn()
  user_id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 20, default: '' })
  phone: string;  

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'simple-array'})
  role: Role[];

  @Column({ type: 'text', nullable: true })
  forgot_token: string;

  @OneToMany(() => Membership, membership => membership.users, { cascade: true })
  memberships: Membership[];

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
