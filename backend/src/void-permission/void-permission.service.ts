import { Injectable } from '@nestjs/common';
import { CreateVoidPermissionDto } from './dto/create-void-permission.dto';
import { UpdateVoidPermissionDto } from './dto/update-void-permission.dto';

@Injectable()
export class VoidPermissionService {
  create(createVoidPermissionDto: CreateVoidPermissionDto) {
    return 'This action adds a new voidPermission';
  }

  findAll() {
    return `This action returns all voidPermission`;
  }

  findOne(id: number) {
    return `This action returns a #${id} voidPermission`;
  }

  update(id: number, updateVoidPermissionDto: UpdateVoidPermissionDto) {
    return `This action updates a #${id} voidPermission`;
  }

  remove(id: number) {
    return `This action removes a #${id} voidPermission`;
  }
}
