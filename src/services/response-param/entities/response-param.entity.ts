import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateResponseParamDto } from '../dto/create-response-param.dto';

@Entity()
export class ResponseParam extends AbstractEntity {
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

  fromResponseParamDto?(
    responseParamDto: CreateResponseParamDto,
  ): ResponseParam {
    if (responseParamDto.id) {
      this.id = responseParamDto.id;
    }
    this.paramDefault = responseParamDto.paramDefault;
    this.paramChange = responseParamDto.paramChange;
    this.type = responseParamDto.type.join();
    this.defaultData = responseParamDto.defaultData;
    this.parentId = responseParamDto.parentId;
    this.mappingApiId = responseParamDto.mappingApiId;
    if (responseParamDto.delete) {
      this.setIsDelete(true);
    }
    return this;
  }
}
