import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from 'src/products/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) { }

  async getOrCreateCategory(name: string): Promise<Category> {
    console.log('Received category name:', name);
    if (!name) throw new Error('Category name is required');

    let category = await this.categoryRepo.findOneBy({ name });

    if (!category) {
      category = this.categoryRepo.create({ name });
      category = await this.categoryRepo.save(category);
    }

    return category;
  }

  async create(dto: CreateProductDto) {
    const category = await this.getOrCreateCategory(dto.category);
    const product = this.productRepo.create({
      product: dto.product,
      price: dto.price,
      category,
    });
    return this.productRepo.save(product);
  }

  async findAll(page = 1, limit = 10) {
    const [data, total] = await this.productRepo.findAndCount({
      relations: ['category'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });

    return {
      data: data.map((item, idx) => ({
        no: (page - 1) * limit + idx + 1,
        id: item.id,
        product: item.product,
        price: item.price,
        lastUpdate: item.lastUpdate,
        category: item.category.name,
      })),
      total,
      page,
      limit,
    };
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.productRepo.findOne({ where: { id }, relations: ['category'] });
    if (!product) throw new NotFoundException();

    if (dto.category) {
      product.category = await this.getOrCreateCategory(dto.category);
    }
    if (dto.product) product.product = dto.product;
    if (dto.price !== undefined) product.price = dto.price;

    return this.productRepo.save(product);
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) throw new NotFoundException(`Product ${id} not found`);

    return {
      id: product.id,
      product: product.product,
      price: product.price,
      category: product.category.name,
      lastUpdate: product.lastUpdate,
    };
  }

  async remove(id: number) {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) throw new NotFoundException();
    return this.productRepo.remove(product);
  }
}
