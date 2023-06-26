import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BrandDevice extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  urlApi: string;

  @Column()
  canSync: boolean;

  @Column()
  typeToken: string;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  key: string;
}
