import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../enums/status.enum';

@Entity('draws')
export class Draw {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'decimal' })
  ticketPrice: number;

  @Column({ type: 'varchar', length: 255 })
  prize: string;

  @Column({ type: 'timestamp' })
  drawDate: Date;

  @Column({ default: 100 })
  ticketCount: number;

  @Column({ type: 'enum', enum: Status, default: Status.DRAFT })
  status: Status;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
