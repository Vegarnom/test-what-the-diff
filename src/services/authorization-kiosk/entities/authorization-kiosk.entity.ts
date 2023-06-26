import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AuthorizationKiosk extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  organizationId: number;

  @Column({ nullable: true })
  apiKey: string;

  @Column({ nullable: true })
  apiKeyHash: string;

  @Column()
  thirdPartyId: number;

  @Column()
  token: string;

  @Column()
  ip: string;

  @Column({ nullable: true })
  deviceId: string;
}
