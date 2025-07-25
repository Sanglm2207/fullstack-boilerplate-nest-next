// src/products/products.controller.ts
import { Controller, Get, Query, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/products/entities/category.entity';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Post('bulk')
  createBulk(@Body() dtoList: CreateProductDto[]) {
    return Promise.all(dtoList.map(dto => this.productsService.create(dto)));
  }

  @Get('/categories')
  async getCategories() {
    const categories = await this.categoryRepo.find({ order: { name: 'ASC' } });
    return categories.map((c) => c.name);
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.productsService.findAll(Number(page), Number(limit));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(Number(id));
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productsService.findOne(+id);
  }
}
