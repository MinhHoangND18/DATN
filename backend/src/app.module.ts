import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// BASE
import { LoggerModule } from '@base/logger/logger.module';
import { MailerModule } from '@base/mailer/mailer.module';

// APPS
import { UserModule } from '@/user/user.module';
import { AuthModule } from '@/auth/auth.module';
import { RoleModule } from '@/role/role.module';

// SHARED
import { SeedersModule } from '@shared/seeder/seeder.module';

import { CacheModule } from '@nestjs/cache-manager';
import { UploadFileModule } from './base/multer/upload-file.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { dbConfig } from './base/db';
import { CustomerModule } from './customer/customer.module';
import { CartModule } from './cart/cart.module';
import { BillModule } from './bill/bill.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { BehaviorModule } from './behavior/behavior.module';
import { StatiticModule } from './statitic/statitic.module';

const appModule = [AuthModule, UserModule, RoleModule, MailerModule];
const baseModule = [LoggerModule, UploadFileModule];

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forRoot(dbConfig),
    EventEmitterModule.forRoot(),
    ...baseModule,
    ...appModule,
    SeedersModule,
    CustomerModule,
    CartModule,
    BillModule,
    CategoryModule,
    ProductModule,
    BehaviorModule,
    StatiticModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
