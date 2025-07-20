import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';
import { ApiIdParam } from 'src/common/swagger/api-id-param.decorator';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({
    summary: 'Lista todas as tarefas',
    description:
      'Retorna uma lista de todas as tarefas disponíveis no sistema. A lista pode estar vazia se não houver tarefas cadastradas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tarefas recuperada com sucesso',
    type: [TaskResponseDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  findAllTasks() {
    return this.tasksService.findAll();
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Busca uma tarefa específica',
    description:
      'Retorna uma tarefa específica baseada no ID fornecido. Se a tarefa não for encontrada, retorna um erro 404.',
  })
  @ApiIdParam()
  @ApiResponse({
    status: 200,
    description: 'Tarefa encontrada com sucesso',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'ID inválido fornecido',
  })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não encontrada',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  findOneTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Cria uma nova tarefa',
    description:
      'Cria uma nova tarefa no sistema com os dados fornecidos. Todos os campos obrigatórios devem ser preenchidos.',
  })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({
    status: 201,
    description: 'Tarefa criada com sucesso',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos fornecidos',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Patch('/:id')
  @ApiOperation({
    summary: 'Atualiza uma tarefa existente',
    description:
      'Atualiza uma tarefa existente com os dados fornecidos. Apenas os campos fornecidos serão atualizados.',
  })
  @ApiBody({ type: UpdateTaskDto })
  @ApiIdParam()
  @ApiResponse({
    status: 200,
    description: 'Tarefa atualizada com sucesso',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos fornecidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não encontrada',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Remove uma tarefa',
    description:
      'Remove uma tarefa do sistema baseada no ID fornecido. A operação é irreversível.',
  })
  @ApiIdParam()
  @ApiResponse({
    status: 204,
    description: 'Tarefa removida com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'ID inválido fornecido',
  })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não encontrada',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    this.tasksService.remove(id);
  }
}
