import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResponseDto } from 'src/common/dto/pagination-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdatePasswordDto, UpdateUserDto } from './dto/update-user.dto';

const userSelectFields = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    paginationDto: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [allUsers, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: userSelectFields,
      }),
      this.prisma.user.count(),
    ]);

    const totalPages = Math.ceil(total / limit);
    return {
      meta: {
        totalItems: total,
        itemCount: allUsers.length,
        itemsPerPage: limit,
        totalPages: totalPages,
        currentPage: page,
      },
      data: allUsers,
    };
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userSelectFields,
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordConfirm, ...data } = createUserDto;
    return await this.prisma.user.create({
      data,
      select: userSelectFields,
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: { ...updateUserDto },
        select: userSelectFields,
      });
    } catch {
      throw new NotFoundException('Usuário não encontrado');
    }
  }

  async updatePassword(
    id: number,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (user.password != updatePasswordDto.oldPassword) {
      throw new BadRequestException('Senha antiga incorreta');
    }

    return await this.prisma.user.update({
      where: { id },
      data: { password: updatePasswordDto.newPassword },
      select: userSelectFields,
    });
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Usuário não encontrado');
    }
  }
}
