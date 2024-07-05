import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import { UserModule } from 'src/user/user.module';
import { ClusterModule } from 'src/cluster/cluster.module';

@Module({
  imports: [TypeOrmModule.forFeature([Membership]),ClusterModule, UserModule],
  controllers: [MembershipController],
  providers: [MembershipService],
  exports: [TypeOrmModule]
})
export class MembershipModule {}
