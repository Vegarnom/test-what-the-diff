import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateMappingApiDto } from '../dto/create-mapping-api.dto';

@Entity()
export class MappingApi extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  endpoint: string;

  @Column({ nullable: true })
  requestHeaderParam: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  note: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  thirdPartyApiId: number;

  @Column()
  typeBrandId: number;

  @Column()
  method: string;

  @Column()
  requestType: string;

  @Column()
  responseType: string;

  fromCreateMappingApiDto(createMappingApiDto: CreateMappingApiDto) {
    this.name = createMappingApiDto.name;
    this.endpoint = createMappingApiDto.endpoint;
    this.requestHeaderParam = createMappingApiDto.requestHeaderParam;
    this.note = createMappingApiDto.note;
    this.description = createMappingApiDto.description;
    this.thirdPartyApiId = createMappingApiDto.thirdPartyApiId;
    this.typeBrandId = createMappingApiDto.typeBrandId;
    this.method = createMappingApiDto.method;
    this.requestType = createMappingApiDto.requestType;
    this.responseType = createMappingApiDto.responseType;
  }
}
