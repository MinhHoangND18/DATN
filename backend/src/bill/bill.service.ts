import { Injectable } from '@nestjs/common';
import { BaseService } from '@/base/service/base.service';
import { Bill } from './entities/bill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListDto } from '@/shared/dtos/common.dto';
import { PaginateConfig } from '@/base/service/paginate/paginate';
import { BillStatus } from './bill.constant';
import { BadExcetion } from '@/base/api/exception.reslover';
import { User } from '@/user/entities/user.entity';
import { ERole } from '@/role/enum/roles.enum';

@Injectable()
export class BillService extends BaseService<Bill> {
  constructor(@InjectRepository(Bill) protected repository: Repository<Bill>) {
    super(repository);
  }

  async findAll(query: ListDto, user: User) {
    const config: PaginateConfig<Bill> = {
      sortableColumns: ['updated_at'],
      defaultSortBy: [['updated_at', 'DESC']],
    };

    const queryB = this.repository
      .createQueryBuilder('bill')
      .leftJoinAndSelect('bill.cart', 'cart')
      .leftJoinAndSelect('cart.cart_items', 'ci')
      .leftJoinAndSelect('ci.variant', 'v')
      .leftJoinAndSelect('v.product', 'p')
      .leftJoinAndSelect('cart.user', 'u');
    // const [results, total] = await Promise.all([
    //   this.repository.find({
    //     relations: { cart: { cart_items: { variant: { product: true } } } },
    //     where: user.role == ERole.CUSTOMER ? { cart: { user: { id: user.id } } } : {},
    //   }),
    //   this.repository.count({
    //     where: user.role == ERole.CUSTOMER ? { cart: { user: { id: user.id } } } : {},
    //   }),
    // ]);

    if (user.role != ERole.SUPER_ADMIN) {
      queryB.where('u.id = :userID', { userID: user.id });
    }

    // return {
    //   results,
    //   metadata: { total },
    // };
    return this.listWithPage(query, config, queryB);
  }

  findOne(id: number) {
    return `This action returns a #${id} bill`;
  }

  async update(id: number, status: BillStatus) {
    const bill = await this.repository.findOneBy({ id });
    if (bill.status !== BillStatus.pending && status == BillStatus.cancel)
      throw new BadExcetion({ message: 'Không thể huỷ đơn hàng' });
    bill.status = status;
    return bill.save();
  }
}
