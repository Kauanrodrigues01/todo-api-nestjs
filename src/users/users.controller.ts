import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Query,
  HttpCode,
  HttpStatus,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ApiOkPaginatedResponse } from 'src/common/swagger/decorators/api-pagineted-response.decotors';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiNoContentResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
} from 'src/common/swagger/decorators/api-exceptions-response.decorators';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto, UpdateUserDto } from './dto/update-user.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/param/token-payload.param';
import { UserPayload } from 'src/auth/types/user-payload.type';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthTokenGuard)
  @ApiOperation({ summary: 'Retorna uma lista paginada de usuários' })
  @ApiOkPaginatedResponse(UserResponseDto)
  @ApiInternalServerErrorResponse()
  async findAllUsers(@Query() query: PaginationQueryDto) {
    return await this.usersService.findAll(query);
  }

  @Get('/me')
  @ApiBearerAuth()
  @UseGuards(AuthTokenGuard)
  @ApiOperation({ summary: 'Retorna um usuário' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  async findOneUser(@TokenPayloadParam() userPayload: UserPayload) {
    return await this.usersService.findOne(userPayload);
  }

  @Post()
  @ApiOperation({ summary: 'Cria um usuário' })
  @ApiCreatedResponse({
    description: 'Usuário criada com sucesso',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch()
  @ApiBearerAuth()
  @UseGuards(AuthTokenGuard)
  @ApiOperation({ summary: 'Atualiza um usuário existente' })
  @ApiOkResponse({
    description: 'Usuário atualizado com sucesso',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse('Usuário não encontrado')
  @ApiInternalServerErrorResponse()
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @TokenPayloadParam() userPayload: UserPayload,
  ) {
    console.log(userPayload);
    return await this.usersService.update(updateUserDto, userPayload);
  }

  @Patch('/password')
  @ApiBearerAuth()
  @UseGuards(AuthTokenGuard)
  @ApiOperation({ summary: 'Atualiza a senha de um usuário existente' })
  @ApiOkResponse({
    description: 'Senha do usuário atualizado com sucesso',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse('Usuário não encontrado')
  @ApiInternalServerErrorResponse()
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @TokenPayloadParam() userPayload: UserPayload,
  ) {
    return await this.usersService.updatePassword(
      updatePasswordDto,
      userPayload,
    );
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(AuthTokenGuard)
  @ApiOperation({ summary: 'Remove um usuário' })
  @ApiNoContentResponse({ description: 'Usuário removido com sucesso' })
  @ApiNotFoundResponse('Usuário não encontrado')
  @ApiInternalServerErrorResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@TokenPayloadParam() userPayload: UserPayload) {
    await this.usersService.remove(userPayload);
  }
}
