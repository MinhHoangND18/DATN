import { AbstractEntity } from '@/base/service/abstract-entity.service';
import { User } from '@/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BillStatus } from '../bill.constant';
import { Cart } from '@/cart/entities/cart.entity';

@Entity()
export class Bill extends AbstractEntity {
  @OneToOne(() => Cart, cart => cart.bill)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @Column()
  total: number;

  @Column({ type: 'enum', enum: BillStatus, default: BillStatus.pending })
  status: BillStatus;
}
