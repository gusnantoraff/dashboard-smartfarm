import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cluster } from './entities/cluster.entity';
import { ClusterService } from './cluster.service';
import { ClusterController } from './cluster.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cluster]),AuthModule],
  controllers: [ClusterController],
  providers: [ClusterService],
  exports: [TypeOrmModule]
})
export class ClusterModule {}