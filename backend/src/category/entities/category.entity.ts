import { AbstractEntity } from '@/base/service/abstract-entity.service';
import { Product } from '@/product/entities/product.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Category extends AbstractEntity {
  @Column()
  name: string;

  @OneToMany(() => Product, p => p.category)
  products: Product[];
}
