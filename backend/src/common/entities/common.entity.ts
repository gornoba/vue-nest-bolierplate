import { Exclude } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class CommonEntity {
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  created_at: Date;

  @Exclude()
  @CreateDateColumn({
    type: 'timestamptz',
  })
  updated_at: Date | null;
}
