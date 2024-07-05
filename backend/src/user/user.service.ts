import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/roles/roles.enum';
import { PageOptionsDto } from 'src/dto/page-options.dto';
import { PageDto } from 'src/dto/page.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    if (!user.user_id) {
      user.user_id = uuidv4();
    }
    user.password = await bcrypt.hash(user.password, 10);
    user.role = createUserDto.role || [Role.USER];
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getUsers(pageOptionsDto: PageOptionsDto, role?: Role, email?: string): Promise<PageDto<User>> {
    const { skip, take } = pageOptionsDto;
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (role) {
      queryBuilder.where('user.role = :role', { role });
    }
    if (email) {
      queryBuilder.where('user.email = :email', { email });
    }

    const [users, totalUsers] = await queryBuilder
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const pageCount = Math.ceil(totalUsers / take);
    const hasPreviousPage = skip > 0;
    const hasNextPage = skip + take < totalUsers;

    const meta = {
      page: Math.floor(skip / take) + 1,
      take,
      itemCount: totalUsers,
      pageCount,
      hasPreviousPage,
      hasNextPage,
    };

    return new PageDto(users, meta);
  }

  async findOne(id: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { user_id: id }, relations: ['memberships'] });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    this.userRepository.merge(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);

  }

  // LOGIN
  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  // token
  async findByResetToken(token: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { forgot_token: token } });
  }

  

}
