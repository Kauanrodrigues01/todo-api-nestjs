import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Query,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ApiOkPaginatedResponse } from 'src/common/swagger/decorators/api-pagineted-response.decotors';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
} from 'src/common/swagger/decorators/api-exceptions-response.decorators';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto, UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna uma lista paginada de usuários' })
  @ApiOkPaginatedResponse(UserResponseDto)
  @ApiInternalServerErrorResponse()
  async findAllUsers(@Query() query: PaginationQueryDto) {
    return await this.usersService.findAll(query);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Retorna um usuário' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  async findOneUser(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cria um usuário' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    description: 'Usuário criada com sucesso',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  async create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.usersService.create(createUserDto);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Atualiza um usuário existente' })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({
    description: 'Usuário atualizado com sucesso',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse('Usuário não encontrado')
  @ApiInternalServerErrorResponse()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Patch('/:id/password')
  @ApiOperation({ summary: 'Atualiza a senha de um usuário existente' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiOkResponse({
    description: 'Senha do usuário atualizado com sucesso',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse('Usuário não encontrado')
  @ApiInternalServerErrorResponse()
  async updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return await this.usersService.updatePassword(id, updatePasswordDto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Remove um usuário' })
  @ApiNoContentResponse({ description: 'Usuário removido com sucesso' })
  @ApiNotFoundResponse('Usuário não encontrado')
  @ApiInternalServerErrorResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.remove(id);
  }
}
