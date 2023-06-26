import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DeviceHistory extends AbstractEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	user: string;

	@Column()
  deviceId: string;

  @Column()
  status: string;

	@Column()
	statusDisplay: boolean;

  @Column()
  result: boolean;

  @Column({nullable: true})
  description: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
	date: Date
}
