import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from '../../../common/entities/abstract.entity';

@Entity()
export class Organization extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  parentId: number;

  @PrimaryColumn()
  structureOrganizationId: number;
}
