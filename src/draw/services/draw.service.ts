import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Draw } from '../entities/draw.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDrawDto } from '../dtos/create-draw.dto';
import { UpdateDrawDto } from '../dtos/update-draw.dto';
import { plainToInstance } from 'class-transformer';
import { DrawResponseDto } from '../dtos/draw-response.dto';

@Injectable()
export class DrawService {
  constructor(
    @InjectRepository(Draw)
    private drawRepository: Repository<Draw>,
  ) {}

  async create(createDrawDTO: CreateDrawDto): Promise<DrawResponseDto> {
    try {
      const draw = this.drawRepository.create(createDrawDTO);
      const savedDraw = await this.drawRepository.save(draw);

      return plainToInstance(DrawResponseDto, savedDraw, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error creating draw');
    }
  }

  async findAll(): Promise<DrawResponseDto[]> {
    try {
      const draws = await this.drawRepository.find();

      return draws.map((draw) => {
        return plainToInstance(DrawResponseDto, draw, {
          excludeExtraneousValues: true,
        });
      });
    } catch (error) {
      throw new InternalServerErrorException('Error fetching draws');
    }
  }

  async findOne(id: string): Promise<DrawResponseDto> {
    const draw = await this.fetchDrawById(id);
    return plainToInstance(DrawResponseDto, draw, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    updateDrawDto: UpdateDrawDto,
  ): Promise<DrawResponseDto> {
    const draw = await this.fetchDrawById(id);
    try {
      this.drawRepository.merge(draw, updateDrawDto);
      return plainToInstance(DrawResponseDto, draw, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error updating draw');
    }
  }

  async remove(id: string): Promise<DrawResponseDto> {
    const draw = await this.fetchDrawById(id);
    try {
      await this.drawRepository.delete(id);
      return plainToInstance(DrawResponseDto, draw, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error removing draw');
    }
  }

  async fetchDrawById(id: string): Promise<Draw> {
    const draw = await this.drawRepository.findOneBy({ id });
    if (!draw) {
      throw new NotFoundException(`Draw ID ${id} not found`);
    }
    return draw;
  }
}
