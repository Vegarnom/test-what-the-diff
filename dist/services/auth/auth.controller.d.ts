import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    private readonly logger;
    constructor(authService: AuthService);
    signUp(authDto: AuthDto, res: Response): Promise<void>;
    signIn(authDto: AuthDto, res: Response): Promise<void>;
    checkAuth(res: Response): Promise<void>;
}
