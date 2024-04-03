import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cluster } from './entities/cluster.entity';
import { ClusterService } from './cluster.service';
import { ClusterController } from './cluster.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cluster])],
  providers: [ClusterService],
  controllers: [ClusterController],
})
export class ClusterModule {}