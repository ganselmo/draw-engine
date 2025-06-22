import { Draw } from '../../draw/entities/draw.entity';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TicketStatus } from '../enums/ticket-status.enum';

@Entity('tickets')
export class Ticket {
  @Index(['number', 'drawId'], { unique: true })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  number: number;

  @Index()
  @Column({ type: 'varchar' })
  drawId: string;

  @ManyToOne(() => Draw, (draw) => draw.tickets)
  @JoinColumn({ name: 'drawId' })
  draw: Draw;

  @Column({ type: 'enum', enum: TicketStatus })
  status: TicketStatus;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.ownedTickets, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  reservedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
