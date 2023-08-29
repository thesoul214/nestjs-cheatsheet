<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Table of contents

- [세팅파일](#세팅파일)

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
