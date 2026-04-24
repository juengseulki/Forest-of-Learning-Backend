# 🌳 Forest of Learning Backend

<p align="center">
  <b>지속 가능한 학습을 위한 API 서버</b><br/>
  <i>Reliable API for habit, focus, and reward system</i>
</p>

---

## 🔗 Related Links

<p align="center">
  👉 <a href="https://forest-of-learning-frontend.vercel.app/" target="_blank">Frontend 서비스 바로가기</a> </br>
    👉 Backend Deploy: Render </br>
    👉 Database: PostgreSQL
</p>

---

## 📌 Overview

**Forest of Learning Backend**는  
스터디, 습관, 집중, 포인트 데이터를 관리하는 API 서버입니다.

단순 데이터 전달을 넘어

- 🔐 인증 (Session 기반)
- 🧠 비즈니스 로직 처리
- 🗄 데이터 일관성 유지

를 중심으로  
👉 **안정적인 서비스 구조를 만드는 데 초점을 맞췄습니다.**

---

## 🛠 Tech Stack

<p align="center">

<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js"/>
<img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express"/>
<img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma"/>
<img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql"/>

</p>

---

## ✨ Main Features

### 🏡 Study

- 스터디 생성 / 조회 / 수정 / 삭제
- 비밀번호 기반 인증
- 스터디 상세 정보 조회

### 📅 Habit

- 습관 생성 / 조회 / 수정 / 삭제
- 습관 체크 및 상태 관리
- 주간 습관 기록 처리

### ⏱ Focus

- 집중 세션 완료 데이터 저장
- 집중 시간 기반 포인트 계산
- FocusSession 기록 관리

### 🎯 Point

- 스터디별 누적 포인트 관리
- 포인트 로그 조회
- 집중 완료 시 포인트 반영

### 😀 Emoji

- 스터디별 이모지 반응 추가
- 이모지 카운트 관리

### 🖼 Background

- 배경 이미지 데이터 조회
- 스터디 카드 배경 정보 제공

---

## 🏗 Project Structure

```bash

src/
├── controllers/ # 요청/응답 처리
├── services/ # 비즈니스 로직
├── routes/ # API 라우팅 정의
├── middlewares/ # 인증, 검증, 에러 처리
├── utils/ # 공통 유틸 함수
├── lib/ # 외부 라이브러리 설정 (prisma 등)
├── public/ # 정적 파일 (이미지 등)
└── app.js # 서버 진입점

prisma/
├── schema.prisma # DB 스키마 정의
├── migrations/ # 마이그레이션 파일
└── seed.js # 초기 데이터

.env # 환경 변수
package.json # 프로젝트 설정

```

---

## 🧠 Architecture Design

### 1. Layered Architecture (계층형 구조)

본 프로젝트는 다음과 같이 계층을 분리하여 설계했습니다.

- **Routes** → API 엔드포인트 정의
- **Controllers** → 요청/응답 처리
- **Services** → 핵심 비즈니스 로직
- **Prisma** → DB 접근

👉 역할을 분리하여 코드 가독성과 유지보수성을 높였습니다.

---

### 2. Service Layer 중심 설계

비즈니스 로직을 서비스 레이어에 집중시켜

- Controller는 얇게 유지
- 로직 재사용 가능
- 테스트 및 유지보수 용이

👉 확장 가능한 구조로 설계했습니다.

---

### 3. Middleware 기반 처리

공통 로직을 미들웨어로 분리했습니다.

- 인증 처리 (verifyPassword)
- 요청 제한 (rate limiter)
- 파라미터 검증
- 에러 처리

👉 코드 중복 제거 및 일관성 유지

---

### 4. Prisma 기반 DB 관리

- Prisma ORM 사용
- schema 기반 데이터 모델링
- migration으로 버전 관리

👉 DB 구조를 명확하게 관리

---

### 5. 환경 분리 및 보안

- `.env` 기반 환경 변수 관리
- DATABASE_URL 분리
- CORS origin 관리

👉 배포 환경 대응 및 보안 강화

---

## 🔥 Design Principle

👉 Controller는 얇게, Service는 두껍게 설계하여  
유지보수성과 확장성을 확보했습니다.

---

## 🚨 Troubleshooting

| 문제                | 원인                          | 해결                                                  |
| ------------------- | ----------------------------- | ----------------------------------------------------- |
| 세션 인증 유지 실패 | 쿠키 미전달                   | CORS credentials 설정 및 프론트 credentials 옵션 추가 |
| CORS 배포 오류      | Vercel / Render origin 불일치 | 허용 origin을 환경 변수로 관리                        |
| DATABASE_URL 오류   | 환경 변수 누락                | `.env` 설정 및 Prisma 환경 변수 확인                  |
| 삭제 오류           | 관계 데이터 cascade 미설정    | Prisma relation에 `onDelete: Cascade` 적용            |
| API 응답 처리 문제  | 응답 형식 불일치              | success / fail 응답 유틸로 통일                       |

---

### 💡 Insight

- 인증, CORS, 세션 문제는 프론트와 백엔드가 함께 맞아야 해결된다는 것을 경험했습니다.
- DB 관계 설정과 API 응답 구조 통일이 서비스 안정성에 큰 영향을 준다는 것을 배웠습니다.

---

## 📊 Results

- 🔐 인증 구조 안정화
- ⚡ API 응답 일관성 확보
- 🧠 데이터 구조 단순화
- 🔧 유지보수성 향상

---

## 👥 Team & Roles

| 이름       | 역할          | 담당 기능                                                                                          |
| ---------- | ------------- | -------------------------------------------------------------------------------------------------- |
| **정슬기** | ⭐ PM / Focus | 요구사항 정의, 데이터 구조 설계, API 명세 설계 주도, DB 설계 및 ERD 작성, 포인트 로직 및 상태 처리 |
| **전강민** | API / Habit   | API 구현, 요청/응답 처리, Prisma 연동, 데이터 흐름 관리, 습관 상태 관리 및 데이터 처리             |
| **박소정** | Study         | 스터디 CRUD, 목록 조회, 검색, 정렬, 페이지네이션                                                   |
| **원세빈** | Detail        | 상세 페이지 데이터 연결, 응원 이모지 기능                                                          |
| **최광헌** | Habit         | 습관 CRUD, 습관 체크/해제 기능, 습관 데이터 처리                                                   |
| **심현수** | Focus         | 타이머 UI, 집중 기능, 집중 완료 흐름 구현                                                          |

---

## 💬 What I Learned

- 백엔드는 단순히 데이터를 주고받는 역할이 아니라  
  서비스 구조의 안정성을 책임지는 영역이라는 것을 경험했습니다.

- 인증, 세션, CORS, DB 관계 설정은 각각 따로 보이는 문제지만  
  실제로는 프론트와 백엔드가 함께 맞아야 해결된다는 점을 배웠습니다.

- Focus 기능을 결과 중심 구조로 설계하며  
  서버에 저장해야 할 데이터와 클라이언트에서 관리해야 할 상태를 분리하는 것이 중요하다는 것을 느꼈습니다.

---

## 🔥 One Line

> **“안정적인 학습 기록과 보상 시스템을 위한 API 서버”**
