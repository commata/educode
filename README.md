# EduCode Backend

Spring Boot 3 + MySQL 8 + JPA + JWT + Flyway + Swagger + Judge0(Local) 기반 백엔드입니다.

## 실행

```bash
./gradlew bootRun
```

환경변수 예시:

```bash
export DB_USERNAME=root
export DB_PASSWORD=root
export JWT_SECRET=ZmFrZWZha2VmYWtlZmFrZWZha2VmYWtlZmFrZWZha2VmYWtlZmFrZQ==
export JUDGE0_BASE_URL=http://localhost:2358
```

Swagger:
- http://localhost:8080/swagger-ui.html

## 설계 보완
- Run API는 과제와 독립적으로 동작해야 하므로 기본 제한시간/메모리를 application.yml에서 분리했습니다.
- Submit API는 deadline 이후 제출을 막도록 구현했습니다. 과제의 핵심 속성인 deadline을 실제 정책에 반영하기 위해서입니다.
- Judge0 language_id는 서버마다 다를 수 있어 application.yml의 language-map으로 외부화했습니다.
