import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  PrimaryColumn,
} from 'typeorm';

@Entity()
@Unique(['deviceId', 'deviceName'])
export class Devices {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  secretKey: string;

  @PrimaryColumn({ name: 'deviceId', nullable: false })
  deviceId: string;

  @PrimaryColumn({ name: 'deviceName', nullable: false })
  deviceName: string;

  @Column({ nullable: false })
  company: string;

  @Column()
  hostName: string;

  @Column()
  user: string;

  @Column({ default: null })
  keySecretHex: string;

  @Column({ default: null })
  description: string;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
