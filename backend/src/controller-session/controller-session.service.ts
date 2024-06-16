import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ControllerSession } from './entities/controller-session.entity';
import { CreateControllerSessionDto } from './dto/create-controller-session.dto';
import { UpdateControllerSessionDto } from './dto/update-controller-session.dto';

@Injectable()
export class ControllerSessionService {
  constructor(
    @InjectRepository(ControllerSession)
    private readonly controllerSessionRepository: Repository<ControllerSession>,
  ) {}

  async findAll(): Promise<ControllerSession[]> {
    return this.controllerSessionRepository.find();
  }

  async findOne(id: string): Promise<ControllerSession> {
    return this.controllerSessionRepository.findOne({ where: { controller_session_id:id } });
  }

  async create(createControllerSessionDto: CreateControllerSessionDto): Promise<ControllerSession> {
    const controllerSession = this.controllerSessionRepository.create(createControllerSessionDto);
    return this.controllerSessionRepository.save(controllerSession);
  }

  async update(id: string, updateControllerSessionDto: UpdateControllerSessionDto): Promise<ControllerSession> {
    await this.controllerSessionRepository.update(id, updateControllerSessionDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.controllerSessionRepository.delete(id);
  }
}
