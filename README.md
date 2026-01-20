# Fetching Project V2 - API Server

이 프로젝트는 기존 SSR(Server-Side Rendering) 방식의 이커머스 백엔드를 **RESTful API 서버**로 리팩토링한 V2 버전입니다.
프론트엔드와 백엔드가 완전히 분리되었으며, **Swagger (OpenAPI)**를 통해 API 문서를 제공합니다.

## 🚀 주요 변경 사항 (V2)

1. **Frontend 제거**: HTML 렌더링 로직(`Template.ts`, `views`) 및 정적 파일 서빙 기능을 모두 제거했습니다.
2. **RESTful API**: 모든 응답을 JSON 형식으로 표준화했습니다.
3. **Swagger 도입**: `/api` 엔드포인트에서 대화형 API 문서를 제공합니다.
4. **보안 강화**: 쿠키 기반 인증을 **Bearer Token (JWT)** 방식으로 변경하여 표준 API 보안을 준수합니다.
5. **DTO 적용**: 입력 데이터의 유효성을 검증하고 문서화하기 위해 DTO(Data Transfer Object) 패턴을 적용했습니다.

## 📚 API 문서 (Swagger)

서버 실행 후 아래 주소에서 API 명세를 확인하고 직접 테스트할 수 있습니다.

- **URL**: `http://localhost:3000/api`
- **기능**:
    - **Auth**: 회원가입, 로그인 (JWT 토큰 발급)
    - **Products**: 상품 목록 조회(필터/정렬), 상세 조회, 생성, 수정, 삭제
    - **Reviews/Likes**: 리뷰 작성, 좋아요 기능

> **Tip**: 로그인 후 발급받은 `access_token`을 Swagger 상단의 **Authorize** 버튼에 입력하면 인증이 필요한 API(상품 생성 등)를 테스트할 수 있습니다.

## 🛠 실행 방법

### 1. 설치
```bash
npm install
```

### 2. 환경 변수 설정 (.env)
루트 경로에 `.env` 파일을 생성하세요.
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=fetching_v2
JWT_SECRET=your_secret_key
PORT=3000
```

### 3. 서버 실행
```bash
npm run start
```
서버가 3000번 포트에서 실행됩니다.

## 📝 구현 기능 상세

| 기능 | 설명 | API |
| :--- | :--- | :--- |
| **인증** | JWT 기반 토큰 인증 (Bearer Header) | `POST /auth/login`, `POST /auth/register` |
| **상품 목록** | 필터(브랜드, 가격, 검색) 및 정렬(가격순, 최신순 등) | `GET /` |
| **상품 상세** | 상품 정보, 옵션(사이즈/색상), 리뷰 목록 조회 | `GET /product/:id` |
| **상품 관리** | 상품 생성, 수정, 삭제 (Seller 권한 필요) | `POST /product/create`, `update`, `delete` |
| **사용자 반응** | 상품 좋아요 및 리뷰 작성 | `POST /product/like`, `review` |

## 🏗 프로젝트 구조
- `src/main.ts`: 앱 진입점, Swagger 설정
- `src/app.controller.ts`: 메인 상품 목록 API
- `src/auth/*`: 인증 관련 로직 (Controller, Service, JWT Strategy, DTO)
- `src/product/*`: 상품 관련 로직 (Controller, Service, DTO, Entities)
