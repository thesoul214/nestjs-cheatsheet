<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Table of contents

- [세팅파일](#세팅파일)
- [모듈](#모듈)
- [컨트롤러](#컨트롤러)

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

@Get, @Post, @Delete 등과 같은 데코레이터로 장식 된 컨트롤러 클래스 내의 메소드

**request.body를 획득하는 방법**

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

**파라미터 획득 방법**

id만 획득
```nest.js
handler_name(@Param('id') id: string)
```

여러개의 파라미터 획득
```nest.js
handler_name(@Param() params: string[])
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
