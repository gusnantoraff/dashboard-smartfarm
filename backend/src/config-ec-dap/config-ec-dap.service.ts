import { Injectable } from '@nestjs/common';
import { CreateConfigEcDapDto } from './dto/create-config-ec-dap.dto';
import { UpdateConfigEcDapDto } from './dto/update-config-ec-dap.dto';

@Injectable()
export class ConfigEcDapService {
  create(createConfigEcDapDto: CreateConfigEcDapDto) {
    return 'This action adds a new configEcDap';
  }

  findAll() {
    return `This action returns all configEcDap`;
  }

  findOne(id: number) {
    return `This action returns a #${id} configEcDap`;
  }

  update(id: number, updateConfigEcDapDto: UpdateConfigEcDapDto) {
    return `This action updates a #${id} configEcDap`;
  }

  remove(id: number) {
    return `This action removes a #${id} configEcDap`;
  }
}
