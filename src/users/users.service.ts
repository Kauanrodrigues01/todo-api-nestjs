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
import { BcryptService } from 'src/auth/hash/bcrypt.service';
import { ValidationMessages } from 'src/common/messages/validation-messages';
import { UserPayload } from 'src/auth/types/user-payload.type';
import { Request } from 'express';

const userSelectFields = {
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
  createdAt: true,
  updatedAt: true,
  tasks: true,
};

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcrypt: BcryptService,
  ) {}

  async findAll(
    paginationDto: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [allUsers, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where: {
          isActive: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: userSelectFields,
      }),
      this.prisma.user.count({ where: { isActive: true } }),
    ]);

    const totalPages = Math.ceil(total / limit);
    return {
      meta: {
        totalItems: total,
        itemCount: allUsers.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
      data: allUsers,
    };
  }

  async findOne(userPayload: UserPayload): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userPayload.sub, isActive: true },
      select: userSelectFields,
    });

    if (!user)
      throw new NotFoundException(
        ValidationMessages.USER.NOT_FOUND(userPayload.sub),
      );

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordConfirm, ...data } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException(`O e-mail '${data.email}' já está em uso.`);
    }

    data.password = await this.bcrypt.hashPassword(data.password);

    return this.prisma.user.create({
      data,
      select: userSelectFields,
    });
  }

  async update(
    updateUserDto: UpdateUserDto,
    userPayload: UserPayload,
  ): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userPayload.sub, isActive: true },
    });

    if (!user) {
      throw new NotFoundException(
        ValidationMessages.USER.NOT_FOUND(userPayload.sub),
      );
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (emailExists) {
        throw new BadRequestException(
          `O e-mail '${updateUserDto.email}' já está em uso.`,
        );
      }
    }

    return this.prisma.user.update({
      where: { id: userPayload.sub },
      data: updateUserDto,
      select: userSelectFields,
    });
  }

  async updatePassword(
    updatePasswordDto: UpdatePasswordDto,
    userPayload: UserPayload,
  ): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userPayload.sub, isActive: true },
    });

    if (!user) {
      throw new NotFoundException(
        ValidationMessages.USER.NOT_FOUND(userPayload.sub),
      );
    }

    const isPasswordValid = await this.bcrypt.comparePassword(
      updatePasswordDto.oldPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException(ValidationMessages.AUTH_INVALID_PASSWORD);
    }

    if (updatePasswordDto.oldPassword === updatePasswordDto.newPassword) {
      throw new BadRequestException(
        'A nova senha não pode ser igual à anterior.',
      );
    }

    const hashedPassword = await this.bcrypt.hashPassword(
      updatePasswordDto.newPassword,
    );

    return this.prisma.user.update({
      where: { id: userPayload.sub },
      data: { password: hashedPassword },
      select: userSelectFields,
    });
  }

  async remove(userPayload: UserPayload): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userPayload.sub, isActive: true },
    });

    if (!user) {
      throw new NotFoundException(
        ValidationMessages.USER.NOT_FOUND(userPayload.sub),
      );
    }

    await this.prisma.user.update({
      where: { id: userPayload.sub },
      data: {
        isActive: false,
      },
    });
  }

  async uploadAvatarImage(
    userPayload: UserPayload,
    file: Express.Multer.File,
  ): Promise<UserResponseDto> {
    if (!/^(image\/jpeg|image\/jpg|image\/png)$/.test(file.mimetype)) {
      throw new BadRequestException(ValidationMessages.IMAGE.INVALID_FORMAT);
    }

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(ValidationMessages.IMAGE.MAX_SIZE('2MB'));
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userPayload.sub, isActive: true },
    });

    if (!user) {
      throw new NotFoundException(
        ValidationMessages.USER.NOT_FOUND(userPayload.sub),
      );
    }

    return await this.prisma.user.update({
      where: { id: userPayload.sub },
      data: {
        avatarUrl: `/media/${file.filename}`,
      },
      select: userSelectFields,
    });
  }
}
