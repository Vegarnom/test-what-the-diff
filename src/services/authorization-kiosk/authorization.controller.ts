import {
    Body,
    Controller,
    Post,
    Logger,
    Res,
		Put,
		Delete,
		Param,
		Get,
} from '@nestjs/common';
import { AuthorizationKioskService } from './authorization.service';
import { AuthorizationKioskDto } from './dto/authorization-kiosk.dto';
import { Response } from 'express';
import { responseData } from '../../common/helper/response';

@Controller('authorization-kiosk')
export class AuthorizationKioskController {
	private readonly logger = new Logger(AuthorizationKioskController.name);

	constructor(private readonly authorizationKioskService: AuthorizationKioskService) {}

	@Get()
	async findAll(@Res() res: Response) {
		const result = await this.authorizationKioskService.findAll();
		return responseData(res, result);
	}

	@Get('api-key/:apiKey')
	async getApiKey(@Param('apiKey') apiKey: string, @Res() res: Response) {
		const result = await this.authorizationKioskService.getApiKey(apiKey);
		return responseData(res, result);
	}

	@Post()
	async create(@Body() authorizationKioskDto: AuthorizationKioskDto, @Res() res: Response) {
		const result = await this.authorizationKioskService.create(authorizationKioskDto);
		return responseData(res, result);
	}

	@Post('reset-token/:id')
	async resetApiKey(@Param('id') id: number, @Res() res: Response) {
		const result = await this.authorizationKioskService.resetApiKey(id);
		return responseData(res, result);
	}

	@Put()
	async update(@Body() authorizationKioskDto: AuthorizationKioskDto, @Res() res: Response) {
		const result = await this.authorizationKioskService.update(authorizationKioskDto);
		return responseData(res, result);
	}

	@Delete(':id')
	async delete(@Param('id') id: number, @Res() res: Response) {
		const result = await this.authorizationKioskService.remove(id);
		return responseData(res, result);
	}

}
