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

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  customerName: string;

  @Column({ length: 200, nullable: true })
  companyName: string;

  @Column({ length: 150 })
  primaryEmail: string;

  @Column({ length: 50, nullable: true })
  phoneNumber: string;

  @Column({ length: 200, nullable: true })
  address: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToOne('UserAccount', 'customerProfile', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userAccountId' })
  userAccount: any;

  @Column()
  userAccountId: string;

  @OneToMany('SupportTicket', 'customer')
  supportTickets: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
