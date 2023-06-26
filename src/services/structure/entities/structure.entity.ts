import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from '../../../common/helper/entities/abstract.entity';
import { CreateStructureDto } from '../dto/create-structure.dto';

@Entity()
export class Structure extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isDisable: boolean;

  @Column({ nullable: true })
  apiKey: string;

  fromCreateStructureDto(createStructureDto: CreateStructureDto) {
    this.name = createStructureDto.name;
    this.description = createStructureDto.description;
  }
}
