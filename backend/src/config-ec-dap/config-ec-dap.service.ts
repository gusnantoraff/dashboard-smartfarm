import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigEcDap } from './entities/config-ec-dap.entity';
import { CreateConfigEcDapDto} from './dto/create-config-ec-dap.dto';
import { UpdateConfigEcDapDto } from './dto/update-config-ec-dap.dto';

@Injectable()
export class ConfigEcDapService {
  constructor(
    @InjectRepository(ConfigEcDap)
    private readonly configEcDapRepository: Repository<ConfigEcDap>,
  ) {}

  async findAll(): Promise<ConfigEcDap[]> {
    return this.configEcDapRepository.find();
  }

  async findOne(id: string): Promise<ConfigEcDap> {
    return this.configEcDapRepository.findOne({ where: { config_ec_dap_id:id } });
  }

  async create(createConfigEcDapDto: CreateConfigEcDapDto): Promise<ConfigEcDap> {
    const configEcDap = this.configEcDapRepository.create(createConfigEcDapDto);
    return this.configEcDapRepository.save(configEcDap);
  }

  async update(id: string, updateConfigEcDapDto: UpdateConfigEcDapDto): Promise<ConfigEcDap> {
    await this.configEcDapRepository.update(id, updateConfigEcDapDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.configEcDapRepository.delete(id);
  }

  async deleteAll(): Promise<void> {
    await this.configEcDapRepository.createQueryBuilder().delete().execute();
  }
}
