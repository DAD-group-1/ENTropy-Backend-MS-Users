import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './interfaces/dtos/create-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { UpdateStudentDto } from './interfaces/dtos/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}

  async create(createData: CreateStudentDto): Promise<Student> {
    const user = this.studentRepository.create(createData);
    return this.studentRepository.save(user);
  }

  findAll(): Promise<Student[]> {
    return this.studentRepository.find();
  }

  async findOne(id: number): Promise<Student | null> {
    return this.studentRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateData: UpdateStudentDto,
  ): Promise<Student | null> {
    const student = await this.findOne(id);
    if (!student) return null;

    this.studentRepository.merge(student, updateData);
    return this.studentRepository.save(student);
  }

  async remove(id: number): Promise<Student | null> {
    const student = await this.findOne(id);
    if (!student) return null;

    await this.studentRepository.remove(student);
    return student;
  }
}
