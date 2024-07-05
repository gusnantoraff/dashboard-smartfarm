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
  ) { }

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
    const payload = { user_id: user.user_id, name: user.name, email: user.email, role: user.role };
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
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
<style>
    .body {
        font-family: 'Montserrat', sans-serif;
    }

    .header {
        background-color: #014493;
        padding: 20px;
        color: white;
    }

    .button {
        background-color: #2379DC;
        border: none;
        color: white;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        cursor: pointer;
        border-radius: 5px;
        font-family: 'Work Sans', sans-serif;
        font-weight: bold;
        margin-bottom: 5px;
    }

    .container {
        display: flex;
        align-items: center;
    }

    .text {
        color: white;
        font-weight: bold;
        margin-right: auto;
    }

    .logo-container {
        display: flex;
    }

    .logo-container a {
        margin-left: 10px;
    }

    .email {
        font-weight: bold;
    }

    .social-icons {
        display: flex;
        justify-content: space-between;
        width: 300px;
    }

    .icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #000;
        font-size: 20px;
        margin-bottom: 20px;
    }

    .facebook {
        background-color: #fff;
    }

    .twitter {
        background-color: #fff;
    }

    .instagram {
        background-color: #fff;
    }

    .youtube {
        background-color: #fff;
    }

    .whatsapp {
        background-color: #fff;
    }

    .phone {
        background-color: #fff;
    }
</style>
</head>
<body class="body">
    <div class="header">
        <span style="color: white; 
              font-weight: bold;">OS SMART</span><span style="color: #1CDF9B; 
            font-weight: bold;">FARM</span>
    </div>
    <div>
        <br>Dear <span class="email">${email},</span></br>
        <p>Kami telah menerima permintaan pengaturan ulang kata sandi Anda. Untuk mengatur ulang kata sandi Anda,
            klik tombol di bawah:
        </p>
        <div style="text-align: center;">
             <a href="http://localhost:3000/reset-password?token=${resetToken}" target="_blank">
             <button class="button">SET NEW PASSWORD</button></a> 
            <br>atau klik tautan dibawah ini</br>
            <p>http://localhost:3000/reset-password?token=${resetToken}</p>
        </div>
        <p>Jika ada pertanyaan silahkan menghubungi Customer Service Smart Farm.</p>
        <p>Terima kasih</p>
        <br>Salam Hangat</br>
        <p style="margin-top: 2px;
                  margin-bottom: 60px;">
            OS SMARTFARM
        </p>
    </div>
    <div class="header">
        <p style="font-weight: bold;">PT. OEMAH SOLUTION INDONESIA</p>
        <p>Jl. Seturan Raya No9a, Kledokan, Caturtunggal, Kec. Depok, Kab. Sleman,
            Daerah Istimewa Yogyakarta 55281</p>
        <p style="padding-top: 10px;">Kontak Kami:</p>
        <div class="social-icons">
            <div class="social-icons">
                <a href="https://wa.me/1234567890" target="_blank" class="icon whatsapp"><i
                        class="fab fa-whatsapp"></i></a>
                <a href="https://www.facebook.com" target="_blank" class="icon facebook"><i
                        class="fab fa-facebook-f"></i></a>
                <a href="https://twitter.com" target="_blank" class="icon twitter"><i class="fab fa-twitter"></i></a>
                <a href="https://www.instagram.com" target="_blank" class="icon instagram"><i
                        class="fab fa-instagram"></i></a>
                <a href="https://www.youtube.com/@oemahsolutionindonesia3982" target="_blank" class="icon youtube"><i
                        class="fab fa-youtube"></i></a>
                <a href="tel:1234567890" class="icon phone"><i class="fas fa-phone"></i></a>
            </div>
        </div>
        <hr style="color: white;">
        <div class="container">
            <div class="text">
                <span style="color: white; font-weight: bold;">OS SMART</span><span
                    style="color: #1CDF9B; font-weight: bold;">FARM</span>
            </div>
            <div class="logo-container">
                <a href="https://play.google.com/store">
                    <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                        style="width: 200px;">
                </a>
                <a href="https://apps.apple.com/us/app/apple-store/id375380948">
                    <img src="https://logos-download.com/wp-content/uploads/2016/06/Download_on_the_App_Store_logo.png"
                        style="width: 180px; padding: 10px;">
                </a>
            </div>
        </div>
    </div>
</body>
</head>
</html>
      `
    };

    await transporter.sendMail(mailOptions);
  }
}
