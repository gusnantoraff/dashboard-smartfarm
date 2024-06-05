import { Module } from '@nestjs/common';
import { TemplateService } from './template_controller.service';
import { TemplateController } from './template_controller.controller';
import { Template } from './entities/template_controller.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClusterModule } from 'src/cluster/cluster.module';

@Module({
  imports: [TypeOrmModule.forFeature([Template]), ClusterModule],
  controllers: [TemplateController],
  providers: [TemplateService],
  exports: [TypeOrmModule]
})
export class TemplateControllerModule {}
