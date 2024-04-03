/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Body, Param, Delete } from '@nestjs/common';
import { ClusterService } from './cluster.service';
import { CreateClusterDto } from './dto/create-cluster.dto';
import { UpdateClusterDto } from './dto/update-cluster.dto';
import { Cluster } from './entities/cluster.entity';

@Controller('clusters')
export class ClusterController {
  constructor(private readonly clusterService: ClusterService) {}

  @Post()
  async create(@Body() createClusterDto: CreateClusterDto): Promise<Cluster> {
    return this.clusterService.create(createClusterDto);
  }

  @Get()
  async findAll(): Promise<Cluster[]> {
    return this.clusterService.findAll();
  }

  @Get(':id')
  async getClusterById(@Param('id') id: string) {
    return this.clusterService.getClusterById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateClusterDto: UpdateClusterDto): Promise<Cluster> {
    return this.clusterService.update(id, updateClusterDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<string> {
    return this.clusterService.delete(id);
  }

}
