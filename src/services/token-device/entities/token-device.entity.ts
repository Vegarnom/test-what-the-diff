import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TokenDevice extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  valueToken: string;

  @Column()
  typeToken: string;

  @Column()
  brandId: number;

  @Column()
  organigationId: number;

}
