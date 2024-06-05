import { Injectable } from '@nestjs/common';
import { CreateControllerSessionDto } from './dto/create-controller-session.dto';
import { UpdateControllerSessionDto } from './dto/update-controller-session.dto';

@Injectable()
export class ControllerSessionService {
  create(createControllerSessionDto: CreateControllerSessionDto) {
    return 'This action adds a new controllerSession';
  }

  findAll() {
    return `This action returns all controllerSession`;
  }

  findOne(id: number) {
    return `This action returns a #${id} controllerSession`;
  }

  update(id: number, updateControllerSessionDto: UpdateControllerSessionDto) {
    return `This action updates a #${id} controllerSession`;
  }

  remove(id: number) {
    return `This action removes a #${id} controllerSession`;
  }
}
