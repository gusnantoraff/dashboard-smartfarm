import { Module } from '@nestjs/common';
import { ManagementControllerService } from './management-controller.service';
import { ManagementControllerController } from './management-controller.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagementController } from './entities/management-controller.entity';
import { MembershipModule } from 'src/membership/membership.module';
import { ControllerModule } from 'src/controller/controller.module';

@Module({
  imports: [TypeOrmModule.forFeature([ManagementController]), MembershipModule, ControllerModule],
  controllers: [ManagementControllerController],
  providers: [ManagementControllerService],
  exports: [TypeOrmModule]
})
export class ManagementControllerModule {}
