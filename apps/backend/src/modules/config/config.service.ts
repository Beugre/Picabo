import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemConfig } from './entities/system-config.entity';
import { UpdateConfigDto } from './dto/update-config.dto';

@Injectable()
export class AppConfigService {
  constructor(
    @InjectRepository(SystemConfig) private configRepo: Repository<SystemConfig>,
  ) {}

  async findAll(): Promise<SystemConfig[]> {
    return this.configRepo.find({ order: { key: 'ASC' } });
  }

  async findByKey(key: string): Promise<SystemConfig> {
    const config = await this.configRepo.findOne({ where: { key } });
    if (!config) throw new NotFoundException(`Config key '${key}' not found`);
    return config;
  }

  async upsert(key: string, dto: UpdateConfigDto): Promise<SystemConfig> {
    let config = await this.configRepo.findOne({ where: { key } });
    if (!config) {
      config = this.configRepo.create({ key });
    }
    config.value = dto.value;
    if (dto.description) config.description = dto.description;
    return this.configRepo.save(config);
  }

  async getValue<T>(key: string, defaultValue?: T): Promise<T> {
    try {
      const config = await this.findByKey(key);
      return config.value as T;
    } catch {
      return defaultValue;
    }
  }
}
