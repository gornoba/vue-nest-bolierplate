import { Column, Entity } from 'typeorm';
import { CommonEntity } from './common.entity';

@Entity()
export class RecordRog extends CommonEntity {
  @Column({
    nullable: true,
  })
  method: string;

  @Column({
    nullable: true,
  })
  url: string;

  @Column({
    nullable: true,
  })
  latency: number;

  @Column({
    nullable: true,
  })
  status: number;

  @Column({
    nullable: true,
    type: 'text',
  })
  message: string;

  @Column({
    nullable: true,
  })
  result: boolean;

  @Column({
    nullable: true,
  })
  session: string;
}
