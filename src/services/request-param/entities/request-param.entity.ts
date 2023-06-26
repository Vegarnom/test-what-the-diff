import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateRequestParamDto } from '../dto/create-request-param.dto';

@Entity()
export class RequestParam extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  paramDefault: string;

  @Column({ nullable: true })
  paramChange: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  defaultData: string;

  @Column({ nullable: true })
  parentId: number;

  @Column()
  mappingApiId: number;

  fromRequestParamDto?(requestParamDto: CreateRequestParamDto): RequestParam {
    if (requestParamDto.id) {
      this.id = requestParamDto.id;
    }
    this.paramDefault = requestParamDto.paramDefault;
    this.paramChange = requestParamDto.paramChange;
    this.type = requestParamDto.type.join();
    this.defaultData = requestParamDto.defaultData;
    this.parentId = requestParamDto.parentId;
    this.mappingApiId = requestParamDto.mappingApiId;
    if (requestParamDto.delete) {
      this.setIsDelete(true);
    }
    return this;
  }
}
