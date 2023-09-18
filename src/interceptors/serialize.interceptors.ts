import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

// 모든 클래스를 의미하는 인터페이스
interface ClassConstructor {
  new (...args: any[]): {};
}

// 커스텀 데코레이터를 정의하여 UserDto가 아닌 다른 Dto도 처리할 수 있도록 대응
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // client에서 들어오는 요청은 여기에서 처리

    return handler.handle().pipe(
      map((data: any) => {
        // controller에서 client에 보내는 응답은 여기서 처리
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
