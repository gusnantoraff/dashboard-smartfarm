import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OpenaiModule } from './openai/openai.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ClusterModule } from './cluster/cluster.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ControllerModule } from './controller/controller.module';
import { TemplateControllerModule } from './template_controller/template_controller.module';
import { LogControllerModule } from './log-controller/log-controller.module';
import { ManagementControllerModule } from './management-controller/management-controller.module';
import { MembershipModule } from './membership/membership.module';
import { VoidPermissionModule } from './void-permission/void-permission.module';
import { ConfigSensorModule } from './config-sensor/config-sensor.module';
import { ControllerSessionModule } from './controller-session/controller-session.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    EventEmitterModule.forRoot(),
    OpenaiModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [join(process.cwd(), 'dist/**/*.entity.js')],
        synchronize: true
      }),
    }),
    OpenaiModule,
    ClusterModule,
    UserModule,
    AuthModule,
    ControllerModule,
    TemplateControllerModule,
    LogControllerModule,
    ManagementControllerModule,
    MembershipModule,
    VoidPermissionModule,
    ConfigSensorModule,
    ControllerSessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}