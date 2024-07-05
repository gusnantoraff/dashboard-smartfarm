import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Controller } from './entities/controller.entity';
import { Repository } from 'typeorm';
import { Cluster } from 'src/cluster/entities/cluster.entity';
import { Template } from 'src/template_controller/entities/template_controller.entity';
import { CreateControllerDto } from './dto/create-controller.dto';
import { v4 as uuidv4 } from 'uuid';
import { PageDto } from 'src/dto/page.dto';
import { PageOptionsDto } from 'src/dto/page-options.dto';
import { PageMetaDto } from 'src/dto/page-meta.dto';

@Injectable()
export class ControllerService {
  constructor(
    @InjectRepository(Controller)
    private readonly controllerRepository: Repository<Controller>,
    @InjectRepository(Cluster)
    private readonly clusterRepository: Repository<Cluster>,
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
  ) { }

  async create(createControllerDto: CreateControllerDto): Promise<Controller>{
    const { cluster_id, template_id, ...rest } = createControllerDto;

    const cluster = await this.clusterRepository.findOneOrFail({ where: { cluster_id } });
    const template = await this.templateRepository.findOneOrFail({ where: { template_id } });

    const controller_id = uuidv4();

    const controller = new Controller();
    controller.controller_id = controller_id;
    controller.cluster = cluster;
    controller.template = template;
    controller.controllerSessions = template.config_ec_dap.controllerSessions;
    controller.logControllers = template.config_ec_dap.logControllers;

    Object.assign(controller, rest);

    return await this.controllerRepository.save(controller);
  }


  async findAll(): Promise<Controller[]> {
    return this.controllerRepository.find();
  }

  public async getController(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Controller>> {
    const queryBuilder = this.controllerRepository.createQueryBuilder('controller');

    queryBuilder.leftJoinAndSelect('controller.template', 'template');
    queryBuilder.leftJoinAndSelect('controller.cluster', 'cluster');

    queryBuilder
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: string): Promise<Controller> {
    return this.controllerRepository.findOneOrFail({ where: { controller_id: id } });
  }

  async update(id: string, data: Partial<Controller>): Promise<Controller> {
    await this.controllerRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.controllerRepository.delete(id);
  }

  async deleteAll(): Promise<void> {
    await this.controllerRepository.clear();
  }

  async getDetailController(id: string): Promise<any> {
    const controller = await this.controllerRepository.findOne({
      where: { controller_id: id },
      relations: [
        'template',
        'cluster',
        'configSensors',
        'controllerSessions',
        'logControllers'
      ],
    });

    const controllerDetails = {
      controller_id: controller.controller_id,
      name: controller.name,
      is_active: controller.is_active,
      template_id: controller.template.template_id,
      template: controller.template,
      cluster: controller.cluster,
      configs: controller.controllerSessions.map(config => config.config_sensor),
      controllerSessions: controller.controllerSessions,
      logControllers: controller.logControllers
    };

    return controllerDetails;
  }

}
