import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ResponseCodeDto } from '../dto/response-code.dto';

@Entity()
export class ResponseCode extends AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  codeDefault: string;

  @Column({ nullable: true })
  codeChange: string;

  @Column({ default: false })
  default: boolean;

  @Column()
  mappingApiId: number;

  fromResponseCodeDto(responseCodeDto: ResponseCodeDto): ResponseCode {
    this.id = responseCodeDto.id;
    this.codeDefault = responseCodeDto.codeDefault;
    this.codeChange = responseCodeDto.codeChange;
    this.default = responseCodeDto.default;
    this.mappingApiId = responseCodeDto.mappingApiId;
    if (responseCodeDto.delete) {
      if(responseCodeDto.id){
        this.setIsDelete(true);
      } else {
        return null;
      }
    }
    return this;
  }
}
