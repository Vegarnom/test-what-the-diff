import { AuthService } from './auth.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
