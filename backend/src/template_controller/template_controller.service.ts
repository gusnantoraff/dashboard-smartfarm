import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getManager, Repository, UpdateResult } from 'typeorm';
import { Template } from './entities/template_controller.entity';
import { Cluster } from 'src/cluster/entities/cluster.entity';
import { CreateTemplateDto } from './dto/create-template_controller.dto';
import { UpdateTemplateDto } from './dto/update-template_controller.dto';
import { v4 as uuidv4 } from 'uuid';
import { PageOptionsDto } from 'src/dto/page-options.dto';
import { PageDto } from 'src/dto/page.dto';
import { PageMetaDto } from 'src/dto/page-meta.dto';
import { LogController } from 'src/log-controller/entities/log-controller.entity';
import { ConfigEcDap } from 'src/config-ec-dap/entities/config-ec-dap.entity';
import axios from 'axios';
import { ControllerSession } from 'src/controller-session/entities/controller-session.entity';
import { Controller } from 'src/controller/entities/controller.entity';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
    @InjectRepository(Cluster)
    private readonly clusterRepository: Repository<Cluster>,
    private readonly connection: Connection, 
  ) {}

  async create(createTemplateDto: CreateTemplateDto): Promise<Template> {
    const { cluster_id, dap_num, ec, ph, humidity, temperature_water, temperature_air, water_flow, ...rest } = createTemplateDto;

    const cluster = await this.clusterRepository.findOneOrFail({ where: { cluster_id } });

    const template_id = uuidv4();

    const configEcDaps = new ConfigEcDap();
    configEcDaps.config_ec_dap_id= rest.config_ec_dap.config_ec_dap_id;
    configEcDaps.ec= rest.config_ec_dap.ec;
    configEcDaps.date_start= new Date;
    configEcDaps.date_end= new Date;
    configEcDaps.dap_num= rest.config_ec_dap.dap_num;

    const logController = new LogController();
    logController.log_controller_id= rest.config_ec_dap.log_controller_id;
    logController.dap_first_time = new Date();
    logController.temperature_water = temperature_water;
    logController.humidity = humidity;
    logController.ec = ec;
    logController.ph = ph;
    logController.water_flow = water_flow;
    logController.temperature_air = temperature_air;
    logController.dap_num = rest.dap_count;

    const template = new Template();
    template.template_id = template_id;
    template.cluster = cluster;
    template.name = rest.name;
    template.dap_count = rest.dap_count;
    template.is_active= rest.is_active;
    template.config_ec_dap = rest.config_ec_dap;
    template.config_ec_dap.logControllers = [logController];

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(template);
      await queryRunner.manager.save(logController);
      await queryRunner.manager.save(configEcDaps);

      await queryRunner.commitTransaction();
      return this.getTemplateDetails(template_id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error creating template:', error);
      throw new Error('Failed to create template');
    } finally {
      await queryRunner.release();
    }
  }

  async getTemplate(pageOptionsDto: PageOptionsDto): Promise<PageDto<Template>> {
    const { skip, take } = pageOptionsDto;

    const [entities, itemCount] = await this.templateRepository.findAndCount({
      relations: ['cluster', 'controllers'],
      skip,
      take,
    });

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
  
  async findAll(): Promise<Template[]> {
    return this.templateRepository.find({ relations: ['cluster', 'controllers'] });
  }

  async findOne(id: string): Promise<Template> {
    return this.templateRepository.findOneOrFail({ where: { template_id: id }, relations: ['cluster', 'controllers'] });
  }

  async update(id: string, updateTemplateDto: UpdateTemplateDto): Promise<Template> {
    const { cluster_id, ...rest } = updateTemplateDto;

    let cluster: Cluster | undefined;
    if (cluster_id) {
      cluster = await this.clusterRepository.findOne({ where: { cluster_id } });
      if (!cluster) {
        throw new Error(`Cluster with id ${cluster_id} not found`);
      }
    }

    await this.templateRepository.update(id, { ...rest, cluster });
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.templateRepository.delete(id);
  }

  async getTemplateDetails(id: string): Promise<any> {
    const template = await this.templateRepository.findOne({
      where: { template_id: id },
      relations: [
        'cluster',
        'controllers',
        'controllers.configEcDaps',
        'controllers.logControllers',
        'controllers.controllerSessions',
        'controllers.configSensors',
      ],
    });

    if (!template) {
      throw new NotFoundException(`Template with id ${id} not found`);
    }

    const config_ec_dap_id = template.config_ec_dap.config_ec_dap_id;
    const configEcDapApiResponse = await axios.get(`http://localhost:4000/config-ec-dap/${config_ec_dap_id}`);
    const configEcDapData = configEcDapApiResponse.data;

    const configEcDap: ConfigEcDap = {
      config_ec_dap_id: configEcDapData.config_ec_dap_id,
      ec: configEcDapData.ec,
      date_start: configEcDapData.date_start,
      date_end: configEcDapData.date_end,
      dap_num: configEcDapData.dap_num,
      created_at: configEcDapData.created_at,
      updated_at: configEcDapData.updated_at,
      deleted_at: configEcDapData.deleted_at,
      controllers: new Controller,
      controllerSessions: new ControllerSession,
      logControllers: []
    };

    const log_controller_id = template.config_ec_dap.log_controller_id;
    const logControllerApiResponse = await axios.get(`http://localhost:4000/log-controllers/${log_controller_id}`);
    const logControllerData = logControllerApiResponse.data;

    const logController: LogController = {
      log_controller_id: logControllerData.log_controller_id,
      dap_first_time: logControllerData.dap_first_time,
      temperature_water: logControllerData.temperature_water,
      humidity: logControllerData.humidity,
      ec: logControllerData.ec,
      ph: logControllerData.ph,
      water_flow: logControllerData.water_flow,
      temperature_air: logControllerData.temperature_air,
      dap_num: logControllerData.dap_num,
      created_at: logControllerData.created_at,
      updated_at: logControllerData.updated_at,
      deleted_at: logControllerData.deleted_at,
      controllers: new Controller,
      configEcDaps: new ConfigEcDap,
      controllerSessions: new ControllerSession
    };

    const templateDetails = {
      template_id: template.template_id,
      cluster_id: template.cluster,
      config_ec_dap: template.config_ec_dap,
      name: template.name,
      dap_count: template.dap_count,
      is_active: template.is_active,
      created_at: template.created_at,
      updated_at: template.updated_at,
      controllers: template.controllers.map(controller => ({
        controller_id: controller.controller_id,
        name: controller.name,
        is_active: controller.is_active,
        created_at: controller.created_at,
        updated_at: controller.updated_at,
        cluster: {
          cluster_id: controller.cluster.cluster_id,
          name: controller.cluster.name,
          latitude: controller.cluster.latitude,
          longitude: controller.cluster.longitude,
          timezone: controller.cluster.timezone,
          created_at: controller.cluster.created_at,
          updated_at: controller.cluster.updated_at,
        },
        template: {
          template_id: controller.template.template_id,
          name: controller.template.name,
          dap_count: controller.template.dap_count,
          is_active: controller.template.is_active,
          created_at: controller.template.created_at,
          updated_at: controller.template.updated_at,
        },
        configEcDaps: [configEcDap],
        logControllers: [logController],
        controllerSessions: controller.controllerSessions.map(controllerSession => ({
          controller_session_id: controllerSession.controller_session_id,
          controller_id: controllerSession.controllers,
          template_id: controllerSession.template,
          config_sensor: controllerSession.config_sensor,
          dap_first_date_time: controllerSession.dap_first_date_time,
          dap_first_end_time: controllerSession.dap_first_end_time,
          created_at: controllerSession.created_at,
          updated_at: controllerSession.updated_at,
          deleted_at: controllerSession.deleted_at,
        })),
        configSensors: controller.configSensors.map(configSensor => ({
          config_sensor_id: configSensor.config_sensor_id,
          controller_id: configSensor.controllers,
          ph_up: configSensor.ph_up,
          humidity: configSensor.humidity,
          ec: configSensor.ec,
          ph_down: configSensor.ph_down,
          water_flow: configSensor.water_flow,
          temperature_air_min: configSensor.temperature_air_min,
          temperature_air_max: configSensor.temperature_air_max,
          peristaltic_pump_duration: configSensor.peristaltic_pump_duration,
          peristaltic_pump_period: configSensor.peristaltic_pump_period,
          ec_mode: configSensor.ec_mode,
          created_at: configSensor.created_at,
          updated_at: configSensor.updated_at,
          deleted_at: configSensor.deleted_at,
        })),
      })),
    };

    return templateDetails;
  }
}
