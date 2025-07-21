import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TASK_ERRORS } from 'src/common/errors/messages';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from 'generated/prisma';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Task[]> {
    const allTasks = await this.prisma.task.findMany(); // busca todas as tarefas no db
    return allTasks;
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: {
        id: id,
      },
    });
    if (!task) throw new NotFoundException(TASK_ERRORS.NOT_FOUND(id));
    return task;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = await this.prisma.task.create({
      data: createTaskDto,
    });
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      return await this.prisma.task.update({
        where: { id },
        data: updateTaskDto,
      });
    } catch {
      throw new NotFoundException(TASK_ERRORS.NOT_FOUND(id));
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.task.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(TASK_ERRORS.NOT_FOUND(id));
    }
  }
}
