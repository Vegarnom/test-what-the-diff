import {
  Body,
  Controller,
  Post,
  Logger,
  UsePipes,
  ValidationPipe,
  Res,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { responseCreated, responseOk } from '../../common/helper/response';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @UsePipes(new ValidationPipe({ transform: true }))
  async signUp(@Body() authDto: AuthDto, @Res() res: Response) {
    this.logger.log(`[auth]: ${authDto.email}`);
    const result = await this.authService.signUp(authDto);
    responseCreated(res, result);
  }

  @Post('sign-in')
  @UsePipes(new ValidationPipe({ transform: true }))
  async signIn(@Body() authDto: AuthDto, @Res() res: Response) {
    const result = await this.authService.signIn(authDto);
    responseOk(res, result);
  }

  @Get('check-auth')
  async checkAuth(@Res() res: Response) {
    return responseOk(res, 'oke');
  }
}
