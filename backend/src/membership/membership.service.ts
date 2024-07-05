import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './entities/membership.entity';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { v4 as uuidv4 } from 'uuid';
import { Cluster } from 'src/cluster/entities/cluster.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
    @InjectRepository(Cluster)
    private readonly clusterRepository: Repository<Cluster>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createMembershipDto: CreateMembershipDto): Promise<Membership> {
    const { cluster_id, user_id, ...rest } = createMembershipDto;

    const cluster = await this.clusterRepository.findOneOrFail({ where: { cluster_id } });
    const user = await this.userRepository.findOneOrFail({ where: { user_id } });

    const membership_id = uuidv4();

    const membership = new Membership();
    membership.membership_id = membership_id;
    membership.cluster = cluster;
    membership.users = user;

    Object.assign(membership, rest);

    return await this.membershipRepository.save(membership);
  }

  findAll(): Promise<Membership[]> {
    return this.membershipRepository.find();
  }

  async findOne(id: string): Promise<Membership> {
    const membership = await this.membershipRepository.findOne({where: { membership_id:id }});
    if (!membership) {
      throw new NotFoundException(`Membership with ID ${id} not found`);
    }
    return membership;
  }

  async update(id: string, updateMembershipDto: UpdateMembershipDto): Promise<Membership> {
    await this.membershipRepository.update(id, updateMembershipDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.membershipRepository.delete(id);
  }
}
