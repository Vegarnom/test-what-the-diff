import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Device extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  deviceId: string;

  @Column()
  typeBrandId: number;

  @Column()
  organizationId: number;

  @Column({ nullable: true })
  tokenDeviceId: number;

  @Column()
  deviceName: string;

  @Column({ nullable: true })
  deviceIp: string;

  @Column({ default: false })
  isDisable: boolean;

  @Column({ nullable: true })
  note: string;

  @Column({ nullable: true })
  isAddBySync: boolean;
}
