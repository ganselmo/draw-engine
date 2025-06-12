
import { Draw } from '../../draw/entities/draw.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true , nullable: true })
  username?: string;

  @Column({ unique: true , nullable: true})
  email?: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  address?: string;

  @OneToMany(() => Draw, draw => draw.owner)
  ownedDraws: Draw[];

//   @OneToMany(() => Ticket, ticket => ticket.user)
//   tickets: Ticket[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
