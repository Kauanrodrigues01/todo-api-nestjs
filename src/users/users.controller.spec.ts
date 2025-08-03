import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {
  createMockUserFactory,
  createUserDtoFactory,
  createUserPayloadFactory,
} from 'test/factories/user.factory';
import { UpdateUserDto, UpdatePasswordDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  const mockUserPayload = createUserPayloadFactory();
  const mockUser = createMockUserFactory();
  const mockFile = {
    originalname: 'avatar.png',
    buffer: Buffer.from('fake-image'),
    mimetype: 'image/png',
    size: 12345,
    fieldname: 'file',
    encoding: '7bit',
    destination: '',
    filename: '',
    path: '',
    stream: null,
  } as unknown as Express.Multer.File;

  const usersServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updatePassword: jest.fn(),
    remove: jest.fn(),
    uploadAvatarImage: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new UsersController(
      usersServiceMock as unknown as UsersService,
    );
  });

  it('should find One User', async () => {
    usersServiceMock.findOne.mockResolvedValue(mockUser);

    const result = await controller.findOneUser(mockUserPayload);

    expect(usersServiceMock.findOne).toHaveBeenCalledWith(mockUserPayload);
    expect(result).toEqual(mockUser);
  });

  it('should create a new user', async () => {
    const createUserDto = createUserDtoFactory();

    usersServiceMock.create.mockResolvedValue(mockUser);

    const result = await controller.create(createUserDto);

    expect(usersServiceMock.create).toHaveBeenCalledWith(createUserDto);
    expect(result).toEqual(mockUser);
  });

  it('should update user', async () => {
    const updateUserDto: UpdateUserDto = createUserDtoFactory();

    usersServiceMock.update.mockResolvedValue(mockUser);

    const result = await controller.update(updateUserDto, mockUserPayload);

    expect(usersServiceMock.update).toHaveBeenCalledWith(
      updateUserDto,
      mockUserPayload,
    );
    expect(result).toEqual(mockUser);
  });

  it('should find all users with pagination', async () => {
    const query = { page: 1, limit: 10 };
    const paginatedResponse = { data: [mockUser], total: 1 };
    usersServiceMock.findAll.mockResolvedValue(paginatedResponse);

    const result = await controller.findAllUsers(query);

    expect(usersServiceMock.findAll).toHaveBeenCalledWith(query);
    expect(result).toEqual(paginatedResponse);
  });

  it('should update user password', async () => {
    const updatePasswordDto: UpdatePasswordDto = {
      oldPassword: '123456',
      newPassword: '654321',
    };

    usersServiceMock.updatePassword.mockResolvedValue(mockUser);

    const result = await controller.updatePassword(
      updatePasswordDto,
      mockUserPayload,
    );

    expect(usersServiceMock.updatePassword).toHaveBeenCalledWith(
      updatePasswordDto,
      mockUserPayload,
    );
    expect(result).toEqual(mockUser);
  });

  it('should remove (soft delete) the user', async () => {
    usersServiceMock.remove.mockResolvedValue(undefined);

    const result = await controller.remove(mockUserPayload);

    expect(usersServiceMock.remove).toHaveBeenCalledWith(mockUserPayload);
    expect(result).toBeUndefined();
  });

  it('should upload avatar image', async () => {
    usersServiceMock.uploadAvatarImage.mockResolvedValue({
      avatarUrl: 'fake/path/avatar.png',
    });

    const result = await controller.uploadAvatar(mockUserPayload, mockFile);

    expect(usersServiceMock.uploadAvatarImage).toHaveBeenCalledWith(
      mockUserPayload,
      mockFile,
    );
    expect(result).toEqual({ avatarUrl: 'fake/path/avatar.png' });
  });
});
