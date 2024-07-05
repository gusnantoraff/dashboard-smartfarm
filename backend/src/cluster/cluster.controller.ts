/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Body, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ClusterService } from './cluster.service';
import { CreateClusterDto } from './dto/create-cluster.dto';
import { UpdateClusterDto } from './dto/update-cluster.dto';
import { Cluster } from './entities/cluster.entity';
import { PageOptionsDto } from 'src/dto/page-options.dto';
import { PageDto } from 'src/dto/page.dto';

@Controller('clusters')
export class ClusterController {
  constructor(private readonly clusterService: ClusterService) { }

  @Post()
  async createCluster(@Body() createClusterDto: CreateClusterDto) {
    return this.clusterService.create(createClusterDto);
  }

  @Get('all')
  async getAll(): Promise<Cluster[]> {
    return this.clusterService.getAllClusters();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getClusters(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Cluster>> {
    return this.clusterService.getClusters(pageOptionsDto);
  }

  @Get(':id')
  async getDetailCluster(@Param('id') id: string) {
    return this.clusterService.getDetailCluster(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateClusterDto: UpdateClusterDto): Promise<Cluster> {
    return this.clusterService.update(id, updateClusterDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<string> {
    return this.clusterService.delete(id);
  }

  @Delete()
  deleteAll() {
    return this.clusterService.deleteAll();
  }
}
