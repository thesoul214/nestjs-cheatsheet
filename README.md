<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Table of contents

- [세팅파일](#세팅파일)
- [모듈](#모듈)
- [컨트롤러](#컨트롤러)
- [프로바이더](#프로바이더)
  - [Services](#services)
  - [Pipes](#pipes)
- [DTO](#DTO)

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
```nest.js
handler_name(@Body() body) {
  console.log('body', body);
}
```

request.body에서 특정 프로퍼티만 획득
```nest.js
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
```nest.js
handler_name(@Param('id') id: string)
```

여러개의 파라미터 획득
```nest.js
handler_name(@Param() params: string[])
```

## 프로바이더

종속성 주입을 통해 다른 클래스에 기능을 제공하는 객체

@Injectable 데코레이터를 사용하여 프로바이더로 설정한다

많은 Nest의 기본 클래스들(services, repositories, factories, helpers 등)이 provider로 취급될 수 있습니다.

모듈에 등록해야 애플리케이션에서 사용할 수 있다. 

### services

데이터베이스 관련 로직을 처리

컨트롤러에서는 생성자에 서비스를 지정해주어야 Dependency Injection이 이루어진다.

```nest.js
constructor(private boardsService: BoardsService)
```

생성 CLI
```zsh
nest g service boards
```

### pipes

data transformation과 data validation 기능을 담당

컨트롤러의 핸들러에서 클라이언트의 request를 처리하기 전에 파라미터를 받아서 처리해주는 역할

#### 사용방법

- Handler-level pipes

  `@UsePipes()` 데코레이터를 이용하여 사용한다

  이 파이프는 모든 파라미터에 적용된다.

  ```nest.js
  @post()
  @UsePipes(pipe)
  createBoard(
    @Body('title') title,
    @Body('description') description
  )
  ```

- Parameter-level pipes

  특정 파라미터에만 적용되는 파이프

  title파라미터에만 적용되는 파이프 예

  ```nest.js
  @post()
  createBoard(
    @Body('title', ParameterPiple) title,
    @Body('description') description
  )
  ```

- Global-level pipes

  어플리케이션 레벨의 파이프로써, 클라이언트에서 들어오는 모든 요청에 적용된다.

  main.ts에 넣어주면 된다.

  ```nest.js
  app.useGlobalPipes(GlobalPipes);
  ```

#### Built-in Pipes

- ValidationPipe
- ParseIntPipe
- ParseBoolPipe
- ParseArrayPipe
- ParseUUIDPipe
- DefaultValuePipe 






## DTO

Data Transfer Object

계층간 데이터 교환을 위한 객체

DB에서 데이터를 얻어 service나 controller등으로 보낼 때 사용한다.

interface나 class를 이용해서 정의 가능하고, nestjs에서는 class를 추천

dto.ts라는 확장자를 가진다. (예 : createBoard.dto.ts)
```nest.js
export class CreateBoardDto {
  title: string;
  description: string;
}
```

컨트롤러에서 사용하는 예제

```nest.js
// 서비스 코드
createBoard(createBoardDto: CreateBoardDto) {
  const {title, description} = createBoardDto
}
```

```nest.js
handler_name(
  @Body('title') title: string,
  @Body('description') description: string
) {
  return this.boardService.createBoard(title, description);
}

위의 컨트롤러 코드를 DTO를 이용하면 아래와 같이 변경할 수 있다. 

handler_name(
  @Body() createBoardDto: CreateBoardDto
) {
  return this.boardService.createBoard(createBoardDto);
}
```

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
