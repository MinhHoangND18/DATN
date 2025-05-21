import { AbstractEntity } from '@/base/service/abstract-entity.service';
import { Column, Entity } from 'typeorm';

@Entity()
export class Behavior extends AbstractEntity {
  @Column()
  product_id: number;

  @Column()
  customer_id: number;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  cart_adds: number;

  @Column({ default: 0 })
  purchases: number;

  @Column({ nullable: true })
  product_name: string;

  @Column({ nullable: true })
  customer_name: string;
}
