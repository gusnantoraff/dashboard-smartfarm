import { Injectable } from '@nestjs/common';
import { CreateManagementControllerDto } from './dto/create-management-controller.dto';
import { UpdateManagementControllerDto } from './dto/update-management-controller.dto';

@Injectable()
export class ManagementControllerService {
  create(createManagementControllerDto: CreateManagementControllerDto) {
    return 'This action adds a new managementController';
  }

  findAll() {
    return `This action returns all managementController`;
  }

  findOne(id: number) {
    return `This action returns a #${id} managementController`;
  }

  update(id: number, updateManagementControllerDto: UpdateManagementControllerDto) {
    return `This action updates a #${id} managementController`;
  }

  remove(id: number) {
    return `This action removes a #${id} managementController`;
  }
}
