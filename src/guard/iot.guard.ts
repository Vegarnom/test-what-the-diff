import { Injectable, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/services/auth/guards/jwt-auth.guard';

@Injectable()
export class IoTGuard {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const url = context.getArgs()[0].url;
    console.log(url);
    if (
      url.includes('/mapping-api/request') ||
      url.includes('/auth/sign-in') ||
      url.includes('/auth/sign-up') ||
      url.includes('/device') ||
      url.includes('/brand') ||
      url.includes('/type-brand-device') ||
      url.includes('/type-device')||
      url.includes('/token-device')
    )
      return true;
    return new JwtAuthGuard().canActivate(context);
  }
}
