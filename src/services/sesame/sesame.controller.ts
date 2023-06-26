import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Logger,
  ParseIntPipe,
  Put,
  Delete,
  UseGuards,
  ValidationPipe,
  UsePipes,
  Res,
  Req,
} from '@nestjs/common';
import { responseOk } from '../../common/helper/response';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SesameDto, SesameLockCodeDto } from './dto/sesame.dto';
import { SesameService } from './sesame.service';
import { Response, Request } from 'express';

@Controller('sesame')
export class SesameController {
  private readonly logger = new Logger(SesameController.name);

  constructor(private readonly sesameService: SesameService) {}

  @UseGuards(JwtAuthGuard)
  @Post('active')
  @UsePipes(new ValidationPipe({ transform: true }))
  async activeLock(
    @Req() req: Request,
    @Body() sesameDto: SesameDto,
    @Res() res: Response,
  ) {
    const token = req.headers.authorization.replace('Bearer ', '');
    const result = await this.sesameService.toggleLock(sesameDto, token);
    responseOk(res, result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history/:id')
  async getLockHistory(@Param('id') id: string, @Res() res: Response) {
    const result = await this.sesameService.getLockHistory(id);
    responseOk(res, result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('status/:id')
  async getLockStatus(@Param('id') id: string, @Res() res: Response) {
    this.logger.log(`[lock id]: ${id}`);
    const result = await this.sesameService.getLockStatus(id);
    responseOk(res, result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('code')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createLockCode(
    @Body() sesameLockCodeDto: SesameLockCodeDto,
    @Res() res: Response,
  ) {
    const result = await this.sesameService.createLockCode(sesameLockCodeDto);
    responseOk(res, result);
  }

  @UseGuards(JwtAuthGuard)
  @Put('code')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateLockCode(
    @Body() sesameLockCodeDto: SesameLockCodeDto,
    @Res() res: Response,
  ) {
    const result = await this.sesameService.updateLockCode(sesameLockCodeDto);
    responseOk(res, result);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('code/:id')
  async deleteLockCode(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const result = await this.sesameService.deleteLockCode(id);
    responseOk(res, result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('code')
  async getAllLockCodes(@Res() res: Response) {
    const result = await this.sesameService.getLockCode();
    responseOk(res, result);
  }
}
