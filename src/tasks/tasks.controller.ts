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
  Query,
} from '@nestjs/common';
import {
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
import {
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from 'src/common/swagger/decorators/api-exceptions-response.decorators';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ApiOkPaginatedResponse } from 'src/common/swagger/decorators/api-pagineted-response.decotors';

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
  @ApiOkPaginatedResponse(TaskResponseDto)
  @ApiInternalServerErrorResponse()
  async findAllTasks(@Query() query: PaginationQueryDto) {
    return await this.tasksService.findAll(query);
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Busca uma tarefa específica',
    description:
      'Retorna uma tarefa específica baseada no ID fornecido. Se a tarefa não for encontrada, retorna um erro 404.',
  })
  @ApiOkResponse({
    description: 'Tarefa encontrada com sucesso',
    type: TaskResponseDto,
  })
  @ApiNotFoundResponse('Tarefa não encontrada')
  @ApiInternalServerErrorResponse()
  async findOneTask(@Param('id', ParseIntPipe) id: number) {
    return await this.tasksService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Cria uma nova tarefa',
    description:
      'Cria uma nova tarefa no sistema com os dados fornecidos. Todos os campos obrigatórios devem ser preenchidos.',
  })
  @ApiCreatedResponse({
    description: 'Tarefa criada com sucesso',
    type: TaskResponseDto,
  })
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  async create(@Body() createTaskDto: CreateTaskDto) {
    return await this.tasksService.create(createTaskDto);
  }

  @Patch('/:id')
  @ApiOperation({
    summary: 'Atualiza uma tarefa existente',
    description:
      'Atualiza uma tarefa existente com os dados fornecidos. Apenas os campos fornecidos serão atualizados.',
  })
  @ApiOkResponse({
    description: 'Tarefa atualizada com sucesso',
    type: TaskResponseDto,
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse('Tarefa não encontrada')
  @ApiInternalServerErrorResponse()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return await this.tasksService.update(id, updateTaskDto);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Remove uma tarefa',
    description:
      'Remove uma tarefa do sistema baseada no ID fornecido. A operação é irreversível.',
  })
  @ApiNoContentResponse({ description: 'Tarefa removida com sucesso' })
  @ApiNotFoundResponse('Tarefa não encontrada')
  @ApiInternalServerErrorResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.tasksService.remove(id);
  }
}
