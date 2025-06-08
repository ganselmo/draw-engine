import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Draw } from './entities/draw.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDrawDto } from './dtos/create-draw.dto';
import { UpdateDrawDto } from './dtos/update-draw.dto';

@Injectable()
export class DrawService {
  constructor(
    @InjectRepository(Draw)
    private drawRepository: Repository<Draw>,
  ) {}

  async create(createDrawDTO: CreateDrawDto): Promise<Draw> {
    try {
      const draw = this.drawRepository.create(createDrawDTO);
      return await this.drawRepository.save(draw);
    } catch (error) {
      throw new InternalServerErrorException('Error creating draw');
    }
  }

  async findAll(): Promise<Draw[]> {
    try {
      return await this.drawRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Error fetching draws');
    }
  }

  async findOne(id: string): Promise<Draw> {
    return await this.fetchDrawById(id);
  }

  async update(id: string, updateDrawDto: UpdateDrawDto): Promise<Draw> {
    const draw = await this.fetchDrawById(id);
    try {
      this.drawRepository.merge(draw, updateDrawDto);
      return await this.drawRepository.save(draw);
    } catch (error) {
      throw new InternalServerErrorException('Error updating draw');
    }
  }

  async remove(id: string): Promise<Draw> {
    const draw = await this.fetchDrawById(id);
    try {
      await this.drawRepository.delete(id);
      return draw;
    } catch (error) {
      throw new InternalServerErrorException('Error removing draw');
    }
  }

  private async fetchDrawById(id:string): Promise<Draw> {
    const draw = await this.drawRepository.findOneBy({ id });
    if (!draw) {
      throw new NotFoundException(`Draw ID ${id} not found`);
    }
    return draw;
  }
}
