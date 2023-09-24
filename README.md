<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Table of contents

- [세팅파일](#세팅파일)
- [모듈](#모듈)
- [컨트롤러](#컨트롤러)
- [프로바이더](#프로바이더)
- [Services](#services)
- [DTO](#DTO)
- [LifeCycle](#lifecycle)
- [Middleware](#middleware)
- [Pipes](#pipes)
- [TypeORM](#typeORM)
- [Data Associations](#associations)
- [Intercepter](#intercepter)
- [Logging](#Logging)
- [Configuration](#Configuration)

## 세팅파일

- eslintrc.js
  
  타입 스크립트 가이드라인 제시, 문법에 오류가 나면 알려주는 역할 등

- prettierrc
  
  코드 포맷터

- nest-cli.json

  nest프로젝트를 위해 특정한 설정을 할 수 있는 json파일

- tsconfig.json

  컴파일 관련 설정

- tsconfig.build.json

  tsconfig.json파일의 확장 파일로써 build할 때 필요한 셋팅을 설정

- package.json

  build: 운영환경을 위한 빌드

  format: 린트 에러가 났을지 수정

  start: 앱 시작


## 모듈

@Module 데코레이터가 붙어있는 클래스를 의미

### 생성 CLI

```zsh
nest g module boards
```

## 컨트롤러

@Controller 데코레이터를 클래스에 설정하여 정의

### 생성 CLI

```zsh
nest g controller boards
```

### 핸들러(handler)

@Get, @Post, @Delete 등과 같은 데코레이터로 장식된 컨트롤러 클래스 내의 메소드

#### request.body를 획득하는 방법

request.body전체 획득
```ts
handler_name(@Body() body) {
  console.log('body', body);
}
```

request.body에서 특정 프로퍼티만 획득
```ts
handler_name(
  @Body('title') title: string,
  @Body('description') description: string
) {
  console.log('title', title);
  console.log('description', description);
}
```

#### 파라미터 획득 방법

id만 획득
```ts
handler_name(@Param('id') id: string)
```

여러개의 파라미터 획득
```ts
handler_name(@Param() params: string[])
```

## 프로바이더

종속성 주입을 통해 다른 클래스에 기능을 제공하는 객체

@Injectable 데코레이터를 사용하여 프로바이더로 설정한다

많은 Nest의 기본 클래스들(services, repositories, factories, helpers 등)이 provider로 취급될 수 있습니다.

모듈에 등록해야 애플리케이션에서 사용할 수 있다. 

## services

데이터베이스 관련 로직을 처리

컨트롤러에서는 생성자에 서비스를 지정해주어야 Dependency Injection이 이루어진다.

```ts
constructor(private boardsService: BoardsService){}
```

생성 CLI
```zsh
nest g service boards
```

## DTO

Data Transfer Object

계층간 데이터 교환을 위한 객체

DB에서 데이터를 얻어 service나 controller등으로 보낼 때 사용한다.

interface나 class를 이용해서 정의 가능하고, nestjs에서는 class를 추천

dto.ts라는 확장자를 가진다. (예 : createBoard.dto.ts)
```ts
export class CreateBoardDto {
  title: string;
  description: string;
}
```

컨트롤러에서 사용하는 예제

```ts
// 서비스 코드
createBoard(createBoardDto: CreateBoardDto) {
  const {title, description} = createBoardDto
}
```

```ts
handler_name(
  @Body('title') title: string,
  @Body('description') description: string
) {
  return this.boardService.createBoard(title, description);
}

// 위의 컨트롤러 코드를 DTO를 이용하면 아래와 같이 변경할 수 있다. 
handler_name(
  @Body() createBoardDto: CreateBoardDto
) {
  return this.boardService.createBoard(createBoardDto);
}
```
## lifecycle

<p align="center">
  <img src="https://github.com/thesoul214/nestjs-cheatsheet/blob/main/lib/attached_images/lifecycle.png" alt="TypeScript"/>
</p>

> 참조 : https://assu10.github.io/dev/2023/04/08/nest-middleware-guard-interceptor-pipe-exceptionfilter-lifecycle/

## middleware

`route handler`가 클라이언트 요청을 처리하기 전에 수행되는 기능

request객체, response객체, next()라는 미들웨어 메소드에 접근할 수 있다.

`next()` 메소드는 호출 스택상 다음 미들웨어에게 제어권을 전달하기 위해 사용한다.

### 기본 구조

#### custom middleware 정의하기
```ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}
```

function으로 정의하는 것도 가능하다.

```ts
import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`Request...`);
  next();
};

```

#### 모듈에 등록하기

LoggerMiddleware를 AppModule에 등록

```ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // CatsController에 정의된 /cats router handler에 적용
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('cats');

    // 특정 path와 method만을 지정하거나 제외하는 방법도 있음
    // consumer
    //   .apply(LoggerMiddleware)
    //   .exclude({ path: 'cats', method: RequestMethod.POST })
    //   .forRoutes({ path: 'cats', method: RequestMethod.GET });
  }
}
```

### Global middleware

모든 경로에 대해 middleware를 적용할 경우, main.ts에 use() 메소드를 이용한다.

```ts
const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(3000);
```

## Pipes

data transformation과 data validation 기능을 담당

컨트롤러에서 클라이언트의 request를 처리하기 전에 파라미터를 받아서 처리해주는 역할

### 종류

- Handler-level Pipes

  `@UsePipes()` 데코레이터를 이용하여 사용한다

  이 파이프는 모든 파라미터에 적용된다.

  ```ts
  @post()
  @UsePipes(pipe)
  createBoard(
    @Body('title') title,
    @Body('description') description
  )
  ```

- Parameter-level Pipes

  특정 파라미터에만 적용되는 파이프

  title파라미터에만 적용되는 파이프 예

  ```ts
  @post()
  createBoard(
    @Body('title', ParameterPiple) title,
    @Body('description') description
  )
  ```

- Global-level Pipes

  어플리케이션 레벨의 파이프로써, 클라이언트에서 들어오는 모든 요청에 적용된다.

  main.ts에 지정해준다.ㄴ

  ```ts
  app.useGlobalPipes(GlobalPipes);
  ```

### Built-in Pipes

- ValidationPipe
- ParseIntPipe
- ParseBoolPipe
- ParseArrayPipe
- ParseUUIDPipe
- DefaultValuePipe 

#### 필요한 모듈 설치

```zsh
npm install class-validator class-transformer --save
```

#### 사용법

createBoard.dto.ts

IsNotEmpty 데코레이터 사용 예
```ts
import { IsNotEmpty } from "class-validator";

export class CreateBoardDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}
```

boards.controller.ts

컨트롤러에 Built-in Pipes인 ValidationPipe를 사용한다고 지정
```ts
@post()
@UsePipes(ValidationPipe)
createBoard(createBoardDto: CreateBoardDto) {
  const {title, description} = createBoardDto
}
```

> 데코레이터 종류 : https://github.com/typestack/class-validator#validation-decorators

> transformer(string을 int로 변환 등) 종류 : https://github.com/typestack/class-transformer

### Custom Pipes

PipeTransform 인터페이스를 구현하여 정의할 수 있다.

모든 파이프는 `transform()` 메소드가 필요

#### transform() 메소드

파라미터 

- value : 클라이언트에서 전송된 파라미터의 값

- metadata : 인자에 대한 메타 데이터를 포함한 객체

#### 사용법

board-status-validation.pipe.ts

상태(status)가 PRIVATE과 PUBLIC만 가질 수 있도록 제한하는 pipe 예제
```ts
export class BoardStatusValidationPipe implements PipeTransform
{
  readonly StatusOptions = {
    BoardStatus.PRIVATE,
    BoardStatus.PUBLIC,
  }

  transform(value: any, metadata: ArgumentMetadata){
    value = value.toUpperCase();

    if (!this.isStatusValid(valid)){
      throw new BadRequestException(`${value} isn't in the status options`)
    }
    return value;
  }

  private isStatusValid(status: any){
    const index = this.StatusOptions.indexOf(status);
    return index !== -1
  }
}
```

controller.ts

Parameter-level Pipes로 사용
```ts
@patch('/:id/status')
handler_name(
  @Body('status', BoardStatusValidationPipe) status: BoardStatus
)
```

## typeORM

TypeORM : Object Relational Mapping

객체 관계형 매퍼 라이브러리

### 필요한 모듈 설치

- @nestjs/typeorm : NestJS에서 TypeORM을 사용하기 위해 연동시켜주는 모듈
- typeorm : TypeORM 모듈
- pg : Postgresql 모듈

```zsh
npm install pg typeorm @nestjs/typeorm --save
```

참고 : https://docs.nestjs.com/techniques/database

### 프로젝트에 설정하기

1. configs/typeorm.config.ts 파일 생성하여 설정

- Entities : 엔티티를 이용해서 데이터베이스 테이블을 생성하므로, 엔티티 파일이 어디에 있는지 설정해준다.

- synchronize : true의 경우 어플리케이션을 다시 실행할 때 엔티티안에서 수정된 내용을 반영하기 위해 해당 테이블을 Drop한 후 다시 생성해주므로 운영서버에서는 false로 설정해야 한다.

2. app.module.ts에 import하기

### Entity

엔티티를 이용하여 데이터베이스 테이블을 정의한다.

@Entity() 데코레이터를 클래스에 설정하여 해당 클래스를 엔티티로 인식시킨다.

board.entity.ts
```ts
import { BaseEntity } from "typeorm";

@Entity()
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @column()
  title: string;

  ...
}
```

### Repository

엔티티 객체와 함께 작동하며 DB 데이터를 처리한다.

참고 : https://typeorm.delightful.studio/classes/_repository_repository_.repository.html

데이터베이스에 관련된 로직은 Services가 아닌 Repository에 작성하는데 이러한 디자인 패턴을 Repository Pattern이라고 한다.

#### 사용법

1. board.repository.ts 생성

```ts
import { EntityRepository, Repository } from "typeorm";
import { Board } from "./board.entity";

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  ...
}
```

2. 생성한 repository 파일을 board.module.ts에 설정

#### Service에서 사용하기

Repository를 Services에서 사용하기 위해서는 주입을 해주어야 한다.

```ts
export class BoardService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository
  ) {}

  async getAllBoard(): Promise<Board[]> {
    return this.boardRepository.find();
  }
}
```

## associations

참고 : https://orkhan.gitbook.io/typeorm/docs/many-to-one-one-to-many-relations

파라미터

- type

- inverseSide ( 연결된 반대편에서 해당 엔티티에 접근하는 방법 지정 )

- option

  - eager, lazy 등

```ts
// user.entity.ts
export class User extends BaseEntity{
  컬럼 정의

  // 두번째 파라미터 : board에서 user에 접근할 때는 board.user로 접근한다고 지정
  @OneToMany(type => Board, board => board.user, { eager: true })
  boards: Board[];
}

// board.entity.ts
export class Board extends BaseEntity{
  컬럼 정의

  @ManyToOne(type => User, user => user.boards, { eager: false })
  user: User;
}
```

위와 같은 엔티티를 지정할 경우, board테이블에 userId 칼럼이 추가된다. 

칼럼명을 임의로 지정하려면 `@JoinColumn({ name: 'cusotm_col_name '})` 처럼 설정한다.


### queryBuilder 사용 예

```ts
const query = this.boardRepository.createQueryBuilder('board');

query.where('board.userId = :userId', {userId: user.id});

const boards = await query.getMany();

return boards;
```

## Intercepter

client에서 들어오는 요청이나 controller에서 client에 보내는 응답을 가로채서 특정한 처리를 하는 기능

### user정보에서 password를 제거해서 클라이언트에 돌려주는 에제

#### 1. intercepter와 관련 코드(Dto, 커스템 데코레이터 등) 정의

intercept 메소드를 필수로 정의해야 하며, 이 메소드는 인터셉터가 실행될 때마다 자동으로 호출된다.

파라미터 
- context: 들어오는 요청에 대한 일부 정보를 감싸는 래퍼

- next: 핸들러에 대한 참조

실제 코드 

src/interceptors/serialize.interceptors.ts

#### 2. intercepter 사용

컨트롤러에 커스텀 데코레이터 지정

```ts
@Serialize(UserDto)
```

2번까지 진행하면, user.dto.ts에 정의된 id, email 프로퍼티만 클라이언트에 전달한다.

## Logging

built-in된 logger 클래스가 존재

controller에서 로그 남기는 예

```ts
export class BoardsController {
  private logger = new Logger('BoardsController');

  logger.log('log');
}
```

> [BoardsController] log
라는 로그가 출력된다.


## Configuration

코드가 실행되고 있는 환경을 구분하여 변수를 관리하는 방법

```zsh
npm install @nestjs/config
```

@nestjs/config는 내부적으로 dotenv라는 라이브러리를 사용한다.

dotenv 라이브러리는 .env파일과 환경변수 양쪽에서 구성 정보를 읽고 모든 정보를 단일 개체로 조합한다. 

만일 같은 이름의 변수가 양쪽에 정의되어 있을 경우, 환경변수가 우선된다.

### 예제

`.env.development`, `.env.test` 두 파일이 있고 각각의 파일에는 하기의 환경변수들이 담겨있다고 가정한다.

- DATABASE_HOST
- DATABASE_PORT

#### 1. root 모듈에 configModule을 설정

```ts
importb { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({
  isGlobal: true,

  // NODE_ENV를 지정하여 서버를 실행함으로써 실행환경마다 다른 .env 파일을 참고하게 한다.
  envFilePath: `.env.${process.env.NODE_ENV}`
})
```

#### 2. 환경변수를 사용하고자 하는 곳에서 ConfigService 사용

서비스나 컨트롤러 등 환경변수를 사용하고자 하는 곳에 ConfigService를 주입하여 사용한다.

root 모듈에서 `isGlobal: true`로 설정해 주었기 때문에 따로 module에서 ConfigModule을 import하지 않아도 된다.

app.service.ts의 예
```ts
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello() {
    const host = this.configService.get<string>("DATABASE_HOST");

    // DATABASE_PORT가 정의되지 않은 경우, 3000을 default로 설정한다.
    const port = this.configService.get<number>("DATABASE_PORT", 3000);
  }
}
```

## 기타 등등

- guard, filter

- 커스텀 데코레이터?





## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
