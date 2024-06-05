import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from './entities/template_controller.entity';
import { Cluster } from 'src/cluster/entities/cluster.entity';
import { CreateTemplateDto } from './dto/create-template_controller.dto';
import { UpdateTemplateDto } from './dto/update-template_controller.dto';
import { v4 as uuidv4 } from 'uuid';
import { PageOptionsDto } from 'src/dto/page-options.dto';
import { PageDto } from 'src/dto/page.dto';
import { PageMetaDto } from 'src/dto/page-meta.dto';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
    @InjectRepository(Cluster)
    private readonly clusterRepository: Repository<Cluster>,
  ) {}

  async create(createTemplateDto: CreateTemplateDto): Promise<Template> {
    const { cluster_id, ...rest } = createTemplateDto;

    const cluster = await this.clusterRepository.findOneOrFail({ where: { cluster_id } });
    const template_id = uuidv4();

    const template: Template = this.templateRepository.create({
      ...rest,
      template_id,
      cluster
    });

    return this.templateRepository.save(template);
  }

  public async getTemplate(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Template>> {
    const queryBuilder = this.templateRepository.createQueryBuilder('template_ecdap');

    queryBuilder
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }
  
  async findAll(): Promise<Template[]> {
    return this.templateRepository.find({ relations: ['cluster'] });
  }

  async findOne(id: string): Promise<Template> {
    return this.templateRepository.findOneOrFail({ where: { template_id: id }, relations: ['cluster'] });
  }

  async update(id: string, updateTemplateDto: UpdateTemplateDto): Promise<Template> {
    const { cluster_id, ...rest } = updateTemplateDto;

    const cluster = await this.clusterRepository.findOne({ where: { cluster_id } });

    await this.templateRepository.update(id, { ...rest, cluster });
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.templateRepository.delete(id);
  }
}
