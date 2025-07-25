import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product: string;

  @ManyToOne(() => Category, { cascade: true, eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @UpdateDateColumn()
  lastUpdate: Date;
}
