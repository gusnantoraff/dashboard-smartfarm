import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import { ClusterModule } from 'src/cluster/cluster.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Membership]), ClusterModule, UserModule],
  controllers: [MembershipController],
  providers: [MembershipService],
  exports: [TypeOrmModule]
})
export class MembershipModule {}
