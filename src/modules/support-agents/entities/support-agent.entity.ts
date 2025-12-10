import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('support_agents')
export class SupportAgent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  agentName: string;

  @Column({ length: 150 })
  specialization: string;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ type: 'int', default: 10 })
  maxConcurrentTickets: number;

  @Column({ type: 'simple-array', nullable: true })
  skills: string[];

  @Column({ type: 'text', nullable: true })
  bio: string;

  @OneToOne('UserAccount', 'agentProfile', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userAccountId' })
  userAccount: any;

  @Column()
  userAccountId: string;

  @OneToMany('SupportTicket', 'assignedAgent')
  assignedTickets: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
