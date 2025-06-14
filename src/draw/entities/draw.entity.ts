import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Status } from '../enums/status.enum';
import { User } from '../../user/entities/user.entity';
import { Ticket } from '../../ticket/entities/ticket.entity';

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

  @Column({ type: 'varchar' })
  ownerId: string;

  @ManyToOne(() => User, (user: User) => user.ownedDraws)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToMany(() => Ticket, (ticket: Ticket) => ticket.draw)
  tickets: Ticket[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
