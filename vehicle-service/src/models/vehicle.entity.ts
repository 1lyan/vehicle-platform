import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  make!: string;

  @Column({ type: 'varchar', length: 100 })
  model!: string;

  @Column({ type: 'int', nullable: true })
  year!: number;

  @Column({ type: 'int' })
  userId!: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;
}