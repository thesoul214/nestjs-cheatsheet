import { Expose } from 'class-transformer';

export class UserDto {
  // client에 보내는 응답에 포함시키고 싶은 프로퍼티에 Expose 데코레이터를 지정해준다.
  @Expose()
  id: number;

  @Expose()
  email: string;
}