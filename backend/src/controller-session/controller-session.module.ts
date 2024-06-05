import { Module } from '@nestjs/common';
import { ControllerSessionService } from './controller-session.service';
import { ControllerSessionController } from './controller-session.controller';
import { ControllerSession } from './entities/controller-session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ControllerSession])],
  controllers: [ControllerSessionController],
  providers: [ControllerSessionService],
  exports: [TypeOrmModule]
})
export class ControllerSessionModule {}
