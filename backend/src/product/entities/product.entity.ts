import { AbstractEntity } from '@/base/service/abstract-entity.service';
import { Category } from '@/category/entities/category.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ProductVariant } from './product-variant.entity';

@Entity()
export class Product extends AbstractEntity {
  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ default: true })
  active: boolean;

  @ManyToOne(() => Category, category => category.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ default: 0 })
  price: number;

  @OneToMany(() => ProductVariant, pV => pV.product)
  variants: ProductVariant[];

  @Column({ default: 0 })
  buy: number;

  @Column({ default: 0 })
  views: number;
}
