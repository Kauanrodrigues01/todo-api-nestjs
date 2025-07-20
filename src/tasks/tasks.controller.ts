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
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';
import { ApiIdParam } from 'src/common/swagger/decorators/api-param.decorators';
import {
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from 'src/common/swagger/decorators/api-exceptions-response.decorators';

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
  @ApiOkResponse({
    description: 'Lista de tarefas recuperada com sucesso',
    type: TaskResponseDto,
    isArray: true,
  })
  @ApiInternalServerErrorResponse()
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
  @ApiOkResponse({
    description: 'Tarefa encontrada com sucesso',
    type: TaskResponseDto,
  })
  @ApiNotFoundResponse('Tarefa não encontrada')
  @ApiInternalServerErrorResponse()
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
  @ApiCreatedResponse({
    description: 'Tarefa criada com sucesso',
    type: TaskResponseDto,
  })
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
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
  @ApiOkResponse({
    description: 'Tarefa atualizada com sucesso',
    type: TaskResponseDto,
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse('Tarefa não encontrada')
  @ApiInternalServerErrorResponse()
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
  @ApiNoContentResponse({ description: 'Tarefa removida com sucesso' })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse('Tarefa não encontrada')
  @ApiInternalServerErrorResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    this.tasksService.remove(id);
  }
}
