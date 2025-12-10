import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { TicketStatus, TicketPriority } from '@/shared/enums';

@Entity('support_tickets')
@Index(['status', 'priority'])
@Index(['customerId', 'status'])
export class SupportTicket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 250 })
  subject: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.OPEN,
  })
  status: TicketStatus;

  @Column({
    type: 'enum',
    enum: TicketPriority,
    default: TicketPriority.NORMAL,
  })
  priority: TicketPriority;

  @Column({ type: 'text', nullable: true })
  resolutionNotes: string;

  @Column({ type: 'timestamp', nullable: true })
  assignedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date;

  @ManyToOne('IssueCategory', 'tickets', { nullable: false })
  @JoinColumn({ name: 'issueCategoryId' })
  issueCategory: any;

  @Column()
  issueCategoryId: string;

  @ManyToOne('Customer', 'supportTickets', { nullable: false })
  @JoinColumn({ name: 'customerId' })
  customer: any;

  @Column()
  customerId: string;

  @ManyToOne('SupportAgent', 'assignedTickets', { nullable: true })
  @JoinColumn({ name: 'assignedAgentId' })
  assignedAgent: any;

  @Column({ nullable: true })
  assignedAgentId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
