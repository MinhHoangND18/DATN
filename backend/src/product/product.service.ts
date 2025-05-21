import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BaseService } from '@/base/service/base.service';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { PaginateConfig } from '@/base/service/paginate/paginate';
import { ListDto } from '@/shared/dtos/common.dto';
import { ProductVariant } from './entities/product-variant.entity';
import { Category } from '@/category/entities/category.entity';
import { BehaviorService } from '@/behavior/behavior.service';
import { User } from '@/user/entities/user.entity';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { BadExcetion } from '@/base/api/exception.reslover';

interface ProductListQuery extends ListDto {
  price_min?: number;
  price_max?: number;
  sort_by?: 'popular' | 'newest' | 'price_asc' | 'price_desc';
}

@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(
    @InjectRepository(Product)
    protected repository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private productVariantRepository: Repository<ProductVariant>,
    private behaviorService: BehaviorService,
    private httpService: HttpService,
  ) {
    super(repository);
  }
  async create(payload: CreateProductDto) {
    const { variants, ...rest } = payload;
    const product = await this.repository.save({
      ...rest,
      category: { id: rest.category_id } as Category,
    });

    const saves = await this.productVariantRepository.save(variants.map(v => ({ ...v, product })));

    return { ...product, variants: saves };
  }

  findAll(query: ListDto) {
    const config: PaginateConfig<Product> = {
      sortableColumns: ['updated_at'],
      defaultSortBy: [['updated_at', 'DESC']],
      relations: ['category', 'variants'],
      searchableColumns: ['name', 'category.name'],
    };
    return this.listWithPage(query, config);
  }

  listClient(query: ProductListQuery) {
    const config: PaginateConfig<Product> = {
      sortableColumns: ['updated_at', 'views', 'buy', 'price'],
      defaultSortBy: [['updated_at', 'DESC']],
      relations: ['category', 'variants'],
      searchableColumns: ['name'],
    };
    const queryBuilder = this.repository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'category')
      .leftJoinAndSelect('p.variants', 'variants');

    // Lọc theo giá
    if (query.price_min !== undefined) {
      queryBuilder.andWhere('p.price >= :price_min', { price_min: query.price_min });
    }
    if (query.price_max !== undefined) {
      queryBuilder.andWhere('p.price <= :price_max', { price_max: query.price_max });
    }

    // Sắp xếp
    switch (query.sort_by) {
      case 'popular':
        queryBuilder.orderBy('p.views', 'DESC');
        break;
      case 'newest':
        queryBuilder.orderBy('p.updated_at', 'DESC');
        break;
      case 'price_asc':
        queryBuilder.orderBy('p.price', 'ASC');
        break;
      case 'price_desc':
        queryBuilder.orderBy('p.price', 'DESC');
        break;
      default:
        queryBuilder.orderBy('p.updated_at', 'DESC');
    }

    return this.listWithPage(query, config, queryBuilder);
  }

  async listRecommend(query: ListDto, user: User) {
    const { data } = await firstValueFrom(
      this.httpService.get(`http://127.0.0.1:5000/recommend?user_id=${user.id}`).pipe(
        catchError(err => {
          throw new BadExcetion({ message: err.message });
        }),
      ),
    );

    if (!data) return [];
    const products = await this.repository.find({
      where: { id: In(data.product_ids) },
      relations: { variants: true },
    });

    return products;
  }

  async listViews() {
    return this.repository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.variants', 'v')
      .orderBy('views', 'DESC')
      .limit(10)
      .getMany();
  }

  async listBuy() {
    return this.repository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.variants', 'v')
      .orderBy('buy', 'DESC')
      .limit(10)
      .getMany();
  }

  async findOne(id: number, user: User) {
    const product = await this.repository.findOne({
      where: { id },
      relations: { category: true, variants: true },
    });

    await this.behaviorService.createOrUpdate(user.id, product.id, 1, 'views');
    return product;
  }

  async findOneClient(id: number) {
    const product = await this.repository.findOne({
      where: { id },
      relations: { category: true, variants: true },
    });

    product.views += 1;
    product.save();
    return product;
  }

  async update(id: number, payload: UpdateProductDto) {
    const { variants, category_id, ...rest } = payload;
    const variantsDB = await this.productVariantRepository.find({
      where: { product: { id } },
      select: ['id'],
    });

    for (const variant of variants) {
      if (!variant?.id) {
        await this.productVariantRepository.save({ ...variant, product: { id } as Product });
        continue;
      }
      if (variant.id && variantsDB.find(vDb => vDb.id == variant.id)) {
        await this.productVariantRepository.update(variant.id, { ...variant });
        continue;
      } else if (variant.id && !variantsDB.find(vDb => vDb.id == variant.id)) {
        await this.productVariantRepository.delete(variant.id);
      }
    }

    return this.repository.update(id, { ...rest, category: { id: category_id } as Category });
  }

  active(id: number, active: boolean) {
    return this.repository.update(id, { active });
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async findByIds(ids: number[]) {
    return this.repository.find({
      where: { id: In(ids) },
      relations: { category: true, variants: true },
    });
  }

  async getRelatedProducts(id: number, userId?: number) {
    try {
      // Lấy thông tin sản phẩm hiện tại
      const currentProduct = await this.repository.findOne({
        where: { id },
        relations: { category: true },
      });
      if (!currentProduct) {
        throw new BadRequestException('Sản phẩm không tồn tại');
      }

      // Gọi AI service để lấy danh sách ID sản phẩm liên quan
      const { data } = await firstValueFrom(
        this.httpService
          .get(`http://127.0.0.1:5000/recommend`, {
            params: {
              user_id: userId || 0,
              category: currentProduct.category?.name,
              num_recommendations: 4,
            },
          })
          .pipe(
            catchError(err => {
              throw new BadExcetion({ message: err.message });
            }),
          ),
      );

      console.log(data);

      if (!data?.product_ids?.length) {
        return [];
      }

      // Lấy thông tin chi tiết các sản phẩm từ database
      return this.findByIds(data.product_ids);
    } catch (error) {
      throw new BadRequestException('Không thể lấy sản phẩm liên quan');
    }
  }

  async getRelatedProductsClient(id: number) {
    const currentProduct = await this.repository.findOne({
      where: { id },
      relations: { category: true },
    });

    if (!currentProduct) {
      throw new BadRequestException('Sản phẩm không tồn tại');
    }

    return this.repository.find({
      where: { category: { id: currentProduct.category.id }, active: true, id: Not(id) },
      relations: { variants: true },
    });
  }
}
