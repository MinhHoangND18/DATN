import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductVariant } from '@/product/entities/product-variant.entity';
import { Bill } from '@/bill/entities/bill.entity';
import { Product } from '@/product/entities/product.entity';
import { MomoPaymentService } from './momo.payment';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, ProductVariant, Bill, Product])],
  controllers: [CartController],
  providers: [CartService, MomoPaymentService],
})
export class CartModule {}
