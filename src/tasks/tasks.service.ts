import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResponseDto } from 'src/common/dto/pagination-response.dto';
import { ValidationMessages } from 'src/common/messages/validation-messages';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    paginationDto: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<Task>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [allTasks, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        // busca todas as tarefas no db
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.task.count(),
    ]);

    const totalPages = Math.ceil(total / limit);
    return {
      meta: {
        totalItems: total,
        itemCount: allTasks.length,
        itemsPerPage: limit,
        totalPages: totalPages,
        currentPage: page,
      },
      data: allTasks,
    };
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: {
        id: id,
      },
    });
    if (!task)
      throw new NotFoundException(ValidationMessages.TASK.NOT_FOUND(id));
    return task;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = await this.prisma.task.create({
      data: { ...createTaskDto, userId: 1 },
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
      throw new NotFoundException(ValidationMessages.TASK.NOT_FOUND(id));
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.task.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(ValidationMessages.TASK.NOT_FOUND(id));
    }
  }
}
