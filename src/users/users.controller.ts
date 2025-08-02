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
  UseInterceptors,
  UploadedFile,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiFile } from 'src/common/swagger/decorators/api-file.decorator';
import { Express, Request } from 'express';
import { randomUUID } from 'node:crypto';
import { diskStorage } from 'multer';
import * as path from 'node:path';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthTokenGuard)
  @ApiOperation({
    summary: 'Listar usuários',
    description: 'Retorna uma lista paginada de usuários ativos.',
  })
  @ApiOkPaginatedResponse(UserResponseDto)
  @ApiInternalServerErrorResponse()
  async findAllUsers(@Query() query: PaginationQueryDto) {
    return await this.usersService.findAll(query);
  }

  @Get('/me')
  @ApiBearerAuth()
  @UseGuards(AuthTokenGuard)
  @ApiOperation({
    summary: 'Obter perfil do usuário logado',
    description: 'Retorna os dados do usuário autenticado.',
  })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  async findOneUser(@TokenPayloadParam() userPayload: UserPayload) {
    return await this.usersService.findOne(userPayload);
  }

  @Post()
  @ApiOperation({
    summary: 'Criar novo usuário',
    description: 'Cria um novo usuário no sistema.',
  })
  @ApiCreatedResponse({
    description: 'Usuário criado com sucesso',
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
  @ApiOperation({
    summary: 'Atualizar dados do usuário',
    description:
      'Atualiza as informações do usuário autenticado. E-mail duplicado será rejeitado.',
  })
  @ApiOkResponse({
    description: 'Usuário atualizado com sucesso',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @TokenPayloadParam() userPayload: UserPayload,
  ) {
    return await this.usersService.update(updateUserDto, userPayload);
  }

  @Patch('/password')
  @ApiBearerAuth()
  @UseGuards(AuthTokenGuard)
  @ApiOperation({
    summary: 'Alterar senha do usuário',
    description:
      'Atualiza a senha do usuário autenticado. Requer senha atual e nova senha.',
  })
  @ApiOkResponse({
    description: 'Senha atualizada com sucesso',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
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
  @ApiOperation({
    summary: 'Desativar conta de usuário',
    description:
      'Realiza o soft delete da conta do usuário autenticado (define `isActive` como false).',
  })
  @ApiNoContentResponse({ description: 'Conta desativada com sucesso' })
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@TokenPayloadParam() userPayload: UserPayload) {
    await this.usersService.remove(userPayload);
  }

  @Post('upload/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'media'),
        filename: (req, file, cb) => {
          const uniqueName = `${randomUUID()}${path.extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  @ApiBearerAuth()
  @UseGuards(AuthTokenGuard)
  @ApiFile('file')
  @ApiOperation({
    summary: 'Adicionar ou trocar foto do perfil',
    description:
      'Adiciona uma foto de perfil (se não tiver ainda) ou troca a foto (se já tiver)',
  })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async uploadAvatar(
    @TokenPayloadParam() userPayload: UserPayload,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.usersService.uploadAvatarImage(userPayload, file);
  }
}
