// import { AbstractEntity } from '@/base/service/abstract-entity.service';
// import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
// import { Bill } from './bill.entity';
// import { ProductVariant } from '@/product/entities/product-variant.entity';

// @Entity()
// export class BillItem extends AbstractEntity {
//   @ManyToOne(() => Bill, bill => bill.bill_items, { onDelete: 'CASCADE' })
//   @JoinColumn({ name: 'bill_id' })
//   bill: Bill;

//   @ManyToOne(() => ProductVariant, variant => variant.bill_items)
//   @JoinColumn({ name: 'variant_id' })
//   variant: ProductVariant;

//   @Column({ default: 0 })
//   quantity: number;

//   @Column({ default: 0 })
//   price: number;
// }
