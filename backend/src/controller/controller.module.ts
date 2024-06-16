import { forwardRef, Module } from '@nestjs/common';
import { ControllerService } from './controller.service';
import { ControllerController } from './controller.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Controller } from './entities/controller.entity';
import { ClusterModule } from 'src/cluster/cluster.module';
import { TemplateControllerModule } from 'src/template_controller/template_controller.module';

@Module({
  imports: [TypeOrmModule.forFeature([Controller]),  ClusterModule, TemplateControllerModule],
  controllers: [ControllerController],
  providers: [ControllerService],
  exports: [TypeOrmModule]
})
export class ControllerModule {}
