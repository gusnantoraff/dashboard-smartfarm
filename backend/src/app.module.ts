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
        url: configService.get<string>('DATABASE_URL'), // Membaca langsung dari 1 string DATABASE_URL
        entities: [join(process.cwd(), 'dist/**/*.entity.js')],
        synchronize: true, // Otomatis membuat/memperbarui tabel
        ssl: {
          rejectUnauthorized: false, // Wajib untuk SSL Neon.tech
        },
      }),
    }),
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
