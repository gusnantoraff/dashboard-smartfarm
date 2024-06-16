import { Controller, Post, Body, Param, Put } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.login(email, password);
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
