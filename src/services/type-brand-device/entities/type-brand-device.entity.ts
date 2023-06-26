import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TypeBrandDevice extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  typeDeviceId: number;

  @Column()
  brandDeviceId: number;

  @Column({ nullable: true })
  key: string;

  @Column({ nullable: true })
  canSync: boolean;
}
