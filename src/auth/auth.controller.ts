import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiUnauthorizedResponse } from 'src/common/swagger/decorators/api-exceptions-response.decorators';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignInResponseDto } from './dto/signin-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Realiza o login do usuário' })
  @ApiOkResponse({
    description: 'Usuário Logado com sucesso',
    type: SignInResponseDto,
  })
  @ApiUnauthorizedResponse()
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.authenticate(signInDto);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Realiza o logout do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário deslogado com sucesso' })
  signOut() {
    return 'Deslogado';
  }
}
