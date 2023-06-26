import { ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class IoTGuard {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
