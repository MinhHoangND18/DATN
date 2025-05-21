import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { IsNull, Repository, Not, BaseEntity } from 'typeorm';
import { BadExcetion } from '@/base/api/exception.reslover';
import { BaseService } from '@/base/service/base.service';
import { PaginateConfig } from '@/base/service/paginate/paginate';
import { ListDto } from '@/shared/dtos/common.dto';

@Injectable()
export class CategoryService extends BaseService<Category> {
  constructor(
    @InjectRepository(Category)
    protected repository: Repository<Category>,
  ) {
    super(repository);
  }

  create(payload: CreateCategoryDto) {
    return this.repository.save(payload);
  }

  findAll(query: ListDto) {
    const config: PaginateConfig<Category> = {
      sortableColumns: ['updated_at'],
      defaultSortBy: [['updated_at', 'DESC']],
      searchableColumns: ['name'],
    };
    return this.listWithPage(query, config);
  }

  update(id: number, payload: UpdateCategoryDto) {
    return this.repository.update(id, payload);
  }

  remove(id: number) {
    const check = this.repository.findOne({ where: { products: Not(IsNull()) } });
    if (check) throw new BadExcetion({ message: 'Không thể xoá' });
    return this.repository.update(id, { deleted_at: new Date() });
  }
}
