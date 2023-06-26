import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly authRepo;
    private readonly jwtService;
    private readonly logger;
    constructor(authRepo: Repository<Auth>, jwtService: JwtService);
    signUp(authDto: AuthDto): Promise<AuthDto & Auth>;
    signIn(authDto: AuthDto): Promise<{
        email: string;
        access_token: string;
    }>;
}
