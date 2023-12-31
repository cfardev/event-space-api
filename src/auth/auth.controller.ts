import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthDto, RegisterDto } from './dto';
import { AuthService } from './auth.service';
import { GetUser } from './decorator';
import { JwtGuard } from './guard/jwt.guard';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('/me')
  async getCurrentUserInfo(@GetUser('id', ParseIntPipe) id: number) {
    return this.authService.getMyInfo(id);
  }
}
