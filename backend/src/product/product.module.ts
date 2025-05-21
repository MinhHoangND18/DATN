import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductVariant]),
    HttpModule.register({ timeout: 30000 }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
