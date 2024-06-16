import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cluster } from './entities/cluster.entity';
import { CreateClusterDto } from './dto/create-cluster.dto';
import { UpdateClusterDto } from './dto/update-cluster.dto';
import { v4 as uuidv4 } from 'uuid';
import { PageDto } from 'src/dto/page.dto';
import { PageMetaDto } from 'src/dto/page-meta.dto';
import { PageOptionsDto } from 'src/dto/page-options.dto';


@Injectable()
export class ClusterService {
  constructor(
    @InjectRepository(Cluster)
    private clusterRepository: Repository<Cluster>,
  ) {}

  async create(createClusterDto: CreateClusterDto): Promise<Cluster> {
    const cluster = this.clusterRepository.create(createClusterDto);
    if (!cluster.cluster_id) {
      cluster.cluster_id = uuidv4();
    }
    return await this.clusterRepository.save(cluster);
  }

  async getAllClusters(): Promise<Cluster[]> {
    return this.clusterRepository.find();
  }

  public async getClusters(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Cluster>> {
    const queryBuilder = this.clusterRepository.createQueryBuilder('cluster');

    queryBuilder
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const entities = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  // eslint-disable-next-line prettier/prettier
  async update(id: string, updateClusterDto: UpdateClusterDto): Promise<Cluster> {
    const cluster = await this.getDetailCluster(id);
    if (!cluster) {
      throw new NotFoundException('Cluster not found');
    }

    Object.assign(cluster, updateClusterDto);
    return await this.clusterRepository.save(cluster);
  }

  async delete(id: string): Promise<string> {
    try {
      const cluster = await this.clusterRepository.findOne({ where: { cluster_id: id }, relations: ['controllers'] });
      if (!cluster) {
        throw new NotFoundException(`Cluster dengan ID ${id} tidak ditemukan`);
      }
  
      const result = await this.clusterRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Cluster dengan ID ${id} tidak ditemukan`);
      }
  
      return `Cluster dengan ID ${id} telah terhapus`;
    } catch (error) {
      console.error(`Error deleting cluster: ${error.message}`);
      throw error; // Rethrow the error to handle it appropriately
    }
  }
  
  async deleteAll(): Promise<void> {
    await this.clusterRepository.clear();
  }



  
  async getDetailCluster(id: string): Promise<Cluster> {
    const cluster = await this.clusterRepository.findOne({
      where: { cluster_id: id },
      relations: ['controllers', 'memberships'],
    });
  
    return cluster;
  }
}
