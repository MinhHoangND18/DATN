import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';

// BASE
import * as exc from '@/base/api/exception.reslover';
import { LoggerService } from '@base/logger';
import { BaseService } from '@/base/service/base.service';

// APPS
import { User } from '@/user/entities/user.entity';
import { ICreateUser, IUserGetByUniqueKey } from '@/user/interfaces/user.interface';

import { ListUserDto, UpdateUserDto, UploadAvatarDto } from './dtos/user.dto';
import { PaginateConfig } from '@base/service/paginate/paginate';

import { ActiveUserDto, CmsCreateUserDto, CmsUpdateUserDto } from './dtos/create-user.dto';
import { ERole } from '@/role/enum/roles.enum';
import { RegisterDto } from '@/auth/dtos/auth.dto';
import { EGender } from './user.constant';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
    private readonly loggerService: LoggerService,
  ) {
    super(repository);
  }

  logger = this.loggerService.getLogger(UserService.name);

  // getUserByUniqueKey(option: IUserGetByUniqueKey): Promise<User> {
  //   const findOption: Record<string, any>[] = Object.entries(option).map(
  //     ([key, value]) => ({ [key]: value }),
  //   );
  //   return this.repository
  //     .createQueryBuilder('user')
  //     .where(findOption)
  //     .getOne();
  // }

  async findOne(username: string): Promise<User | undefined> {
    return this.repository.findOne({ where: { username: username } });
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.repository.findOne({ where: { id: id } });
  }

  async getAllUser(query: ListUserDto) {
    const config: PaginateConfig<User> = {
      searchableColumns: ['username', 'email'],
      sortableColumns: ['updated_at'],
    };

    const queryB = this.repository
      .createQueryBuilder('user')
      .where({ role: Not(ERole.SUPER_ADMIN) });

    return this.listWithPage(query, config, queryB);
  }

  async findByUsername(username: string) {
    const user = await this.repository.findOne({
      where: { username },
      select: [
        'id',
        'username',
        'password',
        'active',
        'avatar',
        'full_name',
        'gender',
        'address',
        'phone',
        'email',
        'birthday',
      ],
    });

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.repository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'password',
        'active',
        'avatar',
        'full_name',
        'gender',
        'address',
        'phone',
        'email',
        'birthday',
      ],
    });

    return user;
  }

  async create(payload: CmsCreateUserDto) {
    const user = this.repository.create(payload);
    user.setPassword(payload.password);
    return user.save();
  }

  async update(id: number, payload: UpdateUserDto) {
    const user = await this.repository.findOne({
      where: { id },
    });

    if (!user) throw new exc.BadExcetion({ message: 'Không tồn tại tài khoản này' });

    user.full_name = payload.full_name;
    user.email = payload.email;
    user.gender = payload.gender;
    user.address = payload.address;
    user.phone = payload.phone;
    user.birthday = new Date(payload.birthday);

    return user.save();
  }

  async uploadAvatar(id: number, file: string) {
    await this.repository.update(id, { avatar: file });
    return { avatar: file };
  }

  async active(id: number, payload: ActiveUserDto) {
    const user = await this.repository.findOne({
      where: { id },
    });

    if (!user) throw new exc.BadExcetion({ message: 'Không tồn tại tài khoản này' });

    user.active = payload.active.toString() == 'true';
    await user.save();

    if (payload.active) return 'Chuyển trạng thái hoạt động thành công';
    return 'Khóa tài khoản thành công';
  }

  async register(dto: RegisterDto) {
    const check = await this.repository.findOneBy({ email: dto.email });
    if (check) throw new BadRequestException('Email đã tồn tại!');
    const userTemp = this.repository.create({});
    userTemp.email = dto.email;
    userTemp.active = true;
    userTemp.birthday = new Date(dto.date_of_birth);
    userTemp.full_name = dto.username;
    userTemp.setPassword(dto.password);
    userTemp.username = dto.email;
    userTemp.role = ERole.CUSTOMER;
    userTemp.gender = dto.gender as EGender;

    return await userTemp.save();
  }
}
