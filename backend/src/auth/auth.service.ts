import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import * as nodemailer from 'nodemailer';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { user_id: user.user_id, name: user.name , email: user.email, role: user.role };
    return {
      ...user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const resetToken = uuidv4();
  
    user.forgot_token = resetToken;
    await this.userService.update(user.user_id, { forgot_token: resetToken });
  
    await this.sendResetPasswordEmail(email, resetToken);
  
    return { message: 'Reset password instructions have been sent to your email' };
  }  

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userService.findByResetToken(token);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.forgot_token = null; // Reset the token after password reset
    await this.userService.update(user.user_id, { password: hashedPassword, forgot_token: null });

    return { message: 'Password has been reset successfully' };
  }

  private async sendResetPasswordEmail(email: string, resetToken: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'gusnantorafly@gmail.com',
        pass: 'umsq jaoi gokq lxia'
      }
    });

    const mailOptions = {
      from: 'gusnantorafly@gmail.com',
      to: email,
      subject: 'Reset Password',
      html: `
      <p>Please click the button below to reset your password.</p>
      <p><a href="http://localhost:3000/reset-password?token=${resetToken}">
          <button style="background-color:#4CAF50; border:none; color:white; padding:10px 20px; text-align:center; text-decoration:none; display:inline-block; font-size:16px; cursor:pointer; border-radius:5px;">Reset Password</button>
      </a></p>
      `
    };

    await transporter.sendMail(mailOptions);
  }
}
