import { Module } from '@nestjs/common';
import { VoidPermissionService } from './void-permission.service';
import { VoidPermissionController } from './void-permission.controller';
import { VoidPermission } from './entities/void-permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipModule } from 'src/membership/membership.module';

@Module({
  imports: [TypeOrmModule.forFeature([VoidPermission]), MembershipModule],
  controllers: [VoidPermissionController],
  providers: [VoidPermissionService],
  exports: [TypeOrmModule]
})
export class VoidPermissionModule {}
