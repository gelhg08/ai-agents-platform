import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Like, Repository } from 'typeorm';
import { QueryCategoryDto } from './dto/query-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly repoCategories: Repository<Category>,
  ) { }

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      return await this.repoCategories.save(createCategoryDto);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Category name already exists')
      }
      throw error;
    }
  }

  async findAll(query: QueryCategoryDto) {
    const { name, limit, offset } = query;

    const where = name
      ? { name: Like(`%${name}%`) }
      : {};

    const [data, total] = await this.repoCategories.findAndCount({
      where,
      skip: offset,
      take: limit,
      order: {createdAt: 'DESC'}
    });
    return { data, total, limit, offset }; 
  }

  async findOne(id: number) {
    const category = await this.repoCategories.findOneBy({id})
    if (!category) {
      throw new NotFoundException('Category not found')
    }
    return category
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);
    return this.repoCategories.update(id, updateCategoryDto)
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repoCategories.delete(id);
    return {deleted: true}
  }
}
