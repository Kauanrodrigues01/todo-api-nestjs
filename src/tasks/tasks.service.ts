import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TASK_ERRORS } from 'src/common/errors/messages';

@Injectable()
export class TasksService {
  private readonly tasks: Task[] = [];
  private idCounter = 1;

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: number): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(TASK_ERRORS.NOT_FOUND(id));
    }
    return task;
  }

  create(createTaskDto: CreateTaskDto): Task {
    const task: Task = {
      id: this.idCounter++, // primeiro associa depois incrementa
      ...createTaskDto,
    };
    this.tasks.push(task);
    return task;
  }

  update(id: number, updateTaskDto: UpdateTaskDto): Task {
    const task: Task = this.findOne(id);
    Object.assign(task, updateTaskDto); // passa os valores de updateTaskDto para a task
    const index: number = this.tasks.findIndex((task) => task.id === id);
    this.tasks[index] = task;
    return task;
  }

  remove(id: number): void {
    const index: number = this.tasks.findIndex((task) => task.id === id);
    if (index === -1) {
      throw new NotFoundException(TASK_ERRORS.NOT_FOUND(id));
    }
    this.tasks.splice(index, 1);
  }
}
