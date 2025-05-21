import { User } from '@/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { ProductVariant } from '@/product/entities/product-variant.entity';
import { AbstractEntity } from '@/base/service/abstract-entity.service';

@Entity()
export class CartItem extends AbstractEntity {
  @ManyToOne(() => Cart, cart => cart.cart_items)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @ManyToOne(() => ProductVariant, variant => variant.product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @Column()
  quantity: number;
}
