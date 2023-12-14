import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { SALT_OR_ROUNDS } from '../../common/helper/constant';
import { AuthDto } from './dto/auth.dto';
import { Auth } from './entities/auth.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(Auth) private readonly authRepo: Repository<Auth>,
    private readonly jwtService: JwtService,
  ) { }

  async signUp(authDto: AuthDto) {
    try {
      this.logger.log(`[signUp]: email=${authDto.email}`);

      const userExisted = await this.authRepo.find({
        where: { email: authDto.email },
      });

      if (userExisted.length > 0) {
        throw new HttpException('Email is existed.', HttpStatus.CONFLICT);
      }

      this.logger.log(`[signUp]: check data - ` + JSON.stringify(userExisted));

      // generate password hash
      const hash = await bcrypt.hash(authDto.password, SALT_OR_ROUNDS);

      // set default active account
      authDto.isActive = true;
      authDto.password = hash;
      this.logger.log(`[signUp]: isActive=${authDto.isActive}`);

      const auth = await this.authRepo.save(authDto);

      // not get password attribute in auth object
      delete auth.password;

      this.logger.log(`[signUp]: ${auth.email}`);

      // return auth
      return auth;
    } catch (error) {
      this.logger.error('[sign-up error]: ' + JSON.stringify(error));
      throw error;
    }
  }

  async signIn(authDto: AuthDto) {
    try {
      this.logger.log(`[signIn]: email - ${authDto.email}`);

      // find by email
      const auth = await this.authRepo.findOne({
        where: { email: authDto.email, isActive: true },
      });

      this.logger.log(`[signIn]: query - ` + JSON.stringify(auth));
      if (!auth)
        throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);

      // compare password
      const pwdMatches = await bcrypt.compare(authDto.password, auth?.password);

      if (!pwdMatches)
        throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);

      delete auth.password;

      this.logger.log(`[signIn]: success - atuhId=${auth?.id}`);

      // token expire in 7 days
      const result = this.jwtService.sign(
        { email: auth?.email, id: auth?.id, is_active: auth?.isActive },
        {
          expiresIn: '7d',
        },
      );

      return {
        email: auth.email,
        access_token: result,
      };
    } catch (error) {
      this.logger.error('[signIn]: ' + JSON.stringify(error));
      throw error;
    }
  }
  async findById(id: string): Promise<User | undefined> {
    return this.authRepo.findOne(id);
  }

}
