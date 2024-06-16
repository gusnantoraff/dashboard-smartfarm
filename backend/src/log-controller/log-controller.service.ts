import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogController } from './entities/log-controller.entity';
import { CreateLogControllerDto } from './dto/create-log-controller.dto';

@Injectable()
export class LogControllerService {
  constructor(
    @InjectRepository(LogController)
    private readonly logControllerRepository: Repository<LogController>,
  ) {}

  async create(createLogControllerDto: CreateLogControllerDto): Promise<LogController> {
    const logController = new LogController();
    Object.assign(logController, createLogControllerDto);

    return this.logControllerRepository.save(logController);
  }

  async findAll(): Promise<LogController[]> {
    return this.logControllerRepository.find();
  }

  async findOne(id: string): Promise<LogController> {
    return this.logControllerRepository.findOne({ where: { log_controller_id:id } });
  }

  async update(id: string, updateLogControllerDto: CreateLogControllerDto): Promise<LogController> {
    const logController = await this.logControllerRepository.findOne({ where: { log_controller_id:id } });
    if (!logController) {
      throw new Error('LogController not found');
    }

    Object.assign(logController, updateLogControllerDto);

    return this.logControllerRepository.save(logController);
  }

  async remove(id: string): Promise<void> {
    await this.logControllerRepository.delete(id);
  }

  async deleteAll(): Promise<void> {
    await this.logControllerRepository.clear();
  }
}
