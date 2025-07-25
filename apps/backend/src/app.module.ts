import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/entities/product.entity';
import { ProductsModule } from './products/products.module';
import { Category } from './products/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Product, Category],
      synchronize: true,
    }),
    ProductsModule,
  ],
})
export class AppModule {}
