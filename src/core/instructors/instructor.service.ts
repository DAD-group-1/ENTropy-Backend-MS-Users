import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Instructor } from './entities/instructor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InstructorService {
  constructor(
    @InjectRepository(Instructor)
    private instructorRepository: Repository<Instructor>,
  ) {}

  async create(createData: Partial<Instructor>): Promise<Instructor> {
    const instructor = this.instructorRepository.create(createData);
    return this.instructorRepository.save(instructor);
  }

  findAll(): Promise<Instructor[]> {
    return this.instructorRepository.find();
  }

  async findOne(id: number): Promise<Instructor | null> {
    return this.instructorRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateData: Partial<Instructor>,
  ): Promise<Instructor | null> {
    const instructor = await this.findOne(id);
    if (!instructor) return null;

    this.instructorRepository.merge(instructor, updateData);
    return this.instructorRepository.save(instructor);
  }

  async remove(id: number): Promise<Instructor | null> {
    const instructor = await this.findOne(id);
    if (!instructor) return null;

    await this.instructorRepository.remove(instructor);
    return instructor;
  }
}
