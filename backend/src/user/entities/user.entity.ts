import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 20, default: '' })
  phone: string;  

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'text', default: 'user' })
  role: string;

  @Column({ type: 'text', nullable: true })
  forgot_token: string;
}
