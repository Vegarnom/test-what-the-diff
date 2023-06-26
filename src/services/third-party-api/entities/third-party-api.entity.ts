import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ThirdPartyApi extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  note: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  endpointGetParam: string;

  @Column()
  thirdPartyId: number;

  @Column()
  method: string;
}
