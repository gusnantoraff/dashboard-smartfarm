import { Controller, Post, Body, HttpException, HttpStatus, Param, Put } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    const user = await this.authService.validateCredentials(email, password);
    if (!user) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }

    return { message: 'Login successful', user };
  }

  @Post('forgot-password')
  async forgotPassword(
  @Body('email') email: string,
  ) {
  return this.authService.forgotPassword(email);
  }

  @Put('reset-password/:token')
  async resetPassword(@Param('token') token: string, @Body() newPasswordDto: { newPassword: string }) {
    return this.authService.resetPassword(token, newPasswordDto.newPassword);
  }

}
