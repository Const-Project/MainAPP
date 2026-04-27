---
name: backend-spring
description: "Use this skill when writing or reviewing Spring Boot REST controllers, services, JPA repositories, or Java backend code. Covers DTO separation, Bean Validation, security context auth, standard response formats with @RestControllerAdvice, @Transactional placement, N+1 query prevention, and constructor injection. Triggers on Spring, Spring Boot, Java backend, JPA, Hibernate, REST controller keywords."
---

# Spring Boot Backend 규칙

## 절대 쓰지 말 것

```
- Entity를 Controller에서 직접 받거나 반환 (반드시 DTO 분리)
- @Autowired 필드 주입 (생성자 주입만, Lombok @RequiredArgsConstructor 권장)
- @Transactional을 Controller에 붙이기 (Service 계층에만)
- @Data on JPA Entity (equals/hashCode/toString 무한루프 + 영속성 깨짐)
- Optional<T>를 필드 / 파라미터 / Entity 필드에 사용 (반환 타입에만)
- userId / tenantId를 RequestBody에서 받기 (반드시 SecurityContext에서 추출)
- findAll() 후 N+1 쿼리 발생 (fetch join 또는 EntityGraph 명시)
- 트랜잭션 내에서 외부 API 호출 (커넥션 점유 + 롤백 일관성 깨짐)
- Native query에서 SELECT * (컬럼 명시)
- Setter 남발 (Builder, record, with-style 메서드 사용)
- Open Session In View true (application.yml에 false 명시)
- 예외를 그냥 throw new RuntimeException (도메인 예외 클래스 사용)
- Lombok @Value 또는 @Getter on Entity (record / explicit accessor 사용)
```

---

## DTO + Bean Validation

모든 RequestBody는 DTO로 받고 `@Valid` 적용:

```java
// dto/<entity>/Create<Entity>Request.java
package <package>.dto.<entity>;

import jakarta.validation.constraints.*;
import java.util.UUID;

public record Create<Entity>Request(
    @NotNull
    UUID <parentEntityId>,

    @NotBlank
    @Size(min = 1, max = 100)
    String title
) {}

public record Create<SubEntity>Request(
    @NotBlank
    String content,

    String context,  // optional은 그대로 둠

    UUID linked<RelatedEntity>Id  // optional은 그대로 둠
) {}

public record <Action>Request(
    @NotNull
    <Action>Method method,  // enum

    UUID presetId,

    @Pattern(regexp = "^https?://.*")
    String destination
) {}
```

UUID 검증은 타입 자체로 처리됨(파싱 실패 시 400). 추가 검증이 필요하면 커스텀 validator.

사용법:

```java
@PostMapping("/api/<entities>")
public ResponseEntity<ApiResponse<<Entity>Response>> create(
    @Valid @RequestBody Create<Entity>Request request
) {
    // 파싱/검증 실패 시 자동 400
    ...
}
```

---

## userId는 SecurityContext에서만

```java
// 잘못된 것
@PostMapping("/api/<entities>")
public ResponseEntity<?> create(@RequestBody Create<Entity>Request req) {
    UUID userId = req.userId();   // ← 클라이언트 조작 가능
    ...
}

// 올바른 것 — @AuthenticationPrincipal 사용
@PostMapping("/api/<entities>")
public ResponseEntity<ApiResponse<<Entity>Response>> create(
    @AuthenticationPrincipal CustomUserDetails principal,
    @Valid @RequestBody Create<Entity>Request request
) {
    if (principal == null) throw new ForbiddenException();
    UUID userId = principal.getUserId();   // ← 서버가 검증한 값
    ...
}
```

`SecurityContextHolder.getContext().getAuthentication()` 직접 호출은 테스트성·결합도 때문에 비권장. 컨트롤러 시그니처에 `@AuthenticationPrincipal`로 박는 게 표준.

---

## 표준 응답 포맷 — `ApiResponse<T>` + `@RestControllerAdvice`

공통 응답 클래스:

```java
// common/ApiResponse.java
public record ApiResponse<T>(
    boolean ok,
    T data,
    String error
) {
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, null);
    }
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, null, message);
    }
}
```

도메인 예외:

```java
// common/exception/DomainException.java
public abstract class DomainException extends RuntimeException {
    public abstract HttpStatus status();
    protected DomainException(String message) { super(message); }
}

public class BadRequestException extends DomainException {
    public BadRequestException(String message) { super(message); }
    public HttpStatus status() { return HttpStatus.BAD_REQUEST; }
}

public class ForbiddenException extends DomainException {
    public ForbiddenException() { super("forbidden"); }
    public HttpStatus status() { return HttpStatus.FORBIDDEN; }
}

public class NotFoundException extends DomainException {
    public NotFoundException(String resource) { super("not_found: " + resource); }
    public HttpStatus status() { return HttpStatus.NOT_FOUND; }
}
```

전역 핸들러:

```java
// common/GlobalExceptionHandler.java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DomainException.class)
    public ResponseEntity<ApiResponse<Void>> handleDomain(DomainException e) {
        return ResponseEntity.status(e.status())
            .body(ApiResponse.error(e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(
        MethodArgumentNotValidException e
    ) {
        String message = e.getBindingResult().getFieldErrors().stream()
            .map(err -> err.getField() + ": " + err.getDefaultMessage())
            .collect(Collectors.joining(", "));
        return ResponseEntity.badRequest().body(ApiResponse.error(message));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleUnknown(Exception e) {
        log.error("Unhandled", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.error("server_error"));
    }
}
```

Controller에서는 정상 응답만 신경 쓰면 됨. `try/catch` 금지 — 전역 핸들러가 잡음.

---

## 상태 전환 — 중앙 함수 통과 필수

Entity 안에 도메인 로직으로 박는 게 정석:

```java
// domain/<Entity>.java
@Entity
@Table(name = "<entities>")
public class <Entity> {

    @Id
    private UUID id;

    @Enumerated(EnumType.STRING)
    private <Entity>Status status;

    private static final Map<<Entity>Status, Set<<Entity>Status>> VALID_TRANSITIONS = Map.of(
        <Entity>Status.DRAFT,     Set.of(<Entity>Status.IN_REVIEW),
        <Entity>Status.IN_REVIEW, Set.of(<Entity>Status.APPROVED, <Entity>Status.REJECTED, <Entity>Status.DRAFT),
        <Entity>Status.APPROVED,  Set.of(),
        <Entity>Status.REJECTED,  Set.of(<Entity>Status.DRAFT)
    );

    public void changeStatus(<Entity>Status to) {
        Set<<Entity>Status> allowed = VALID_TRANSITIONS.get(this.status);
        if (allowed == null || !allowed.contains(to)) {
            throw new BadRequestException(
                "invalid transition: " + this.status + " → " + to
            );
        }
        this.status = to;
    }
}
```

Service에서는 `entity.changeStatus(...)`만 호출. Setter 직접 호출 금지.

---

## Controller 기본 구조

```java
// controller/<Entity>Controller.java
@RestController
@RequestMapping("/api/<entities>")
@RequiredArgsConstructor   // 생성자 주입 (Lombok)
public class <Entity>Controller {

    private final <Entity>Service <entity>Service;

    @PostMapping
    public ResponseEntity<ApiResponse<<Entity>Response>> create(
        @AuthenticationPrincipal CustomUserDetails principal,
        @Valid @RequestBody Create<Entity>Request request
    ) {
        if (principal == null) throw new ForbiddenException();

        <Entity>Response response = <entity>Service.create(
            request,
            principal.getUserId()
        );

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.ok(response));
    }

    @GetMapping("/{<entityId>}")
    public ResponseEntity<ApiResponse<<Entity>Response>> get(
        @AuthenticationPrincipal CustomUserDetails principal,
        @PathVariable UUID <entityId>
    ) {
        if (principal == null) throw new ForbiddenException();

        <Entity>Response response = <entity>Service.findById(
            <entityId>,
            principal.getUserId()
        );

        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
```

Controller는 **얇게**. 검증·인증·라우팅만. 비즈니스 로직 전부 Service.

---

## Service 계층 규칙

```java
// service/<Entity>Service.java
@Service
@RequiredArgsConstructor
public class <Entity>Service {

    private final <Entity>Repository <entity>Repository;
    private final <ParentEntity>Repository <parentEntity>Repository;

    @Transactional   // ← 쓰기는 트랜잭션 명시
    public <Entity>Response create(Create<Entity>Request request, UUID userId) {
        // 1. 사전 조건 확인
        <ParentEntity> parent = <parentEntity>Repository
            .findById(request.<parentEntityId>())
            .orElseThrow(() -> new NotFoundException("<parentEntity>"));

        if (!parent.isAccessibleBy(userId)) {
            throw new ForbiddenException();
        }

        // 2. 도메인 객체 생성
        <Entity> entity = <Entity>.create(parent, request.title(), userId);

        // 3. 저장
        <entity>Repository.save(entity);

        // 4. 응답 변환
        return <Entity>Response.from(entity);
    }

    @Transactional(readOnly = true)   // ← 읽기는 readOnly 명시
    public <Entity>Response findById(UUID <entityId>, UUID userId) {
        <Entity> entity = <entity>Repository
            .findByIdWithParent(<entityId>)   // fetch join 메서드
            .orElseThrow(() -> new NotFoundException("<entity>"));

        if (!entity.isAccessibleBy(userId)) {
            throw new ForbiddenException();
        }

        return <Entity>Response.from(entity);
    }
}
```

규칙:
- 쓰기 메서드: `@Transactional`
- 읽기 메서드: `@Transactional(readOnly = true)` — 1차 캐시 정리 + 성능
- 트랜잭션 안에서 외부 HTTP 호출 / 메시지 발행 금지 — 트랜잭션 커밋 후 발행하려면 `ApplicationEventPublisher` + `@TransactionalEventListener(phase = AFTER_COMMIT)`

---

## Repository — N+1 명시적 회피

```java
// repository/<Entity>Repository.java
public interface <Entity>Repository extends JpaRepository<<Entity>, UUID> {

    // 잘못된 것 — findAll() 호출 후 entity.getParent() 접근하면 N+1
    // 올바른 것 — fetch join 명시
    @Query("""
        SELECT e FROM <Entity> e
        JOIN FETCH e.<parentEntity>
        WHERE e.id = :id
    """)
    Optional<<Entity>> findByIdWithParent(@Param("id") UUID id);

    // 또는 @EntityGraph
    @EntityGraph(attributePaths = {"<parentEntity>", "<subEntities>"})
    Optional<<Entity>> findById(UUID id);

    // 페이징 + fetch join은 주의 — Hibernate가 in-memory paging으로 fallback
    // 페이징이 필요하면 ID만 먼저 가져온 뒤 별도 쿼리로 fetch
}
```

Native query 사용 시:

```java
@Query(value = """
    SELECT id, title, status, created_at
    FROM <entities>
    WHERE <parent_entity>_id = :<parentEntityId>
""", nativeQuery = true)
List<<Entity>Projection> findProjectionsByParent(
    @Param("<parentEntityId>") UUID <parentEntityId>
);
```

`SELECT *` 금지. 필요한 컬럼만.

---

## Entity vs DTO 분리

```java
// domain/<Entity>.java — 영속 객체
@Entity
@Table(name = "<entities>")
@Access(AccessType.FIELD)
public class <Entity> {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)   // ← LAZY가 기본
    @JoinColumn(name = "<parent_entity>_id")
    private <ParentEntity> <parentEntity>;

    private String title;

    @Enumerated(EnumType.STRING)
    private <Entity>Status status;

    private UUID createdBy;

    private Instant createdAt;

    protected <Entity>() {}   // JPA 요구사항, protected로 외부 접근 차단

    public static <Entity> create(<ParentEntity> parent, String title, UUID userId) {
        <Entity> e = new <Entity>();
        e.id = UUID.randomUUID();
        e.<parentEntity> = parent;
        e.title = title;
        e.status = <Entity>Status.DRAFT;
        e.createdBy = userId;
        e.createdAt = Instant.now();
        return e;
    }

    public boolean isAccessibleBy(UUID userId) {
        return this.<parentEntity>.isMember(userId);
    }

    // Setter 없음. 상태 변경은 도메인 메서드(changeStatus 등)로만
}
```

```java
// dto/<entity>/<Entity>Response.java — 외부 응답
public record <Entity>Response(
    UUID id,
    UUID <parentEntityId>,
    String title,
    String status,
    UUID createdBy,
    Instant createdAt
) {
    public static <Entity>Response from(<Entity> entity) {
        return new <Entity>Response(
            entity.getId(),
            entity.get<ParentEntity>().getId(),
            entity.getTitle(),
            entity.getStatus().name(),
            entity.getCreatedBy(),
            entity.getCreatedAt()
        );
    }
}
```

규칙: **Entity는 절대로 Controller 시그니처에 등장하지 않음**.

---

## application.yml 기본 설정

```yaml
spring:
  jpa:
    open-in-view: false                 # ← 반드시 false
    hibernate:
      ddl-auto: validate                # 운영은 validate, 개발도 가급적 update만
    properties:
      hibernate:
        jdbc.batch_size: 50
        order_inserts: true
        order_updates: true
        default_batch_fetch_size: 100   # N+1 완화 안전망

logging:
  level:
    org.hibernate.SQL: DEBUG            # 개발 환경에서만
    org.hibernate.orm.jdbc.bind: TRACE  # 바인드 파라미터 확인
```

`open-in-view: true`(Spring 기본값)는 컨트롤러까지 영속성 컨텍스트가 유지돼서 **숨겨진 N+1 쿼리의 주범**. 무조건 `false`.

---

## API 완성 기준

```
□ 모든 @RequestBody에 DTO + @Valid 적용됨
□ Entity가 Controller 시그니처에 노출되지 않음
□ userId는 @AuthenticationPrincipal에서만 추출
□ Controller에 try/catch 없음 (GlobalExceptionHandler가 처리)
□ Service 메서드에 @Transactional 또는 @Transactional(readOnly=true) 명시
□ 트랜잭션 내부에 외부 HTTP 호출 / 메시지 발행 없음
□ 상태 전환은 Entity의 도메인 메서드 통과 (Setter 직접 호출 없음)
□ findById가 fetch join 또는 EntityGraph 명시 (관련 객체 접근 시)
□ Native query에 SELECT * 없음
□ Optional<T>가 필드 / 파라미터에 사용되지 않음
□ open-in-view: false 적용됨
□ 생성자 주입 (필드 주입 @Autowired 없음)
□ Entity에 @Data, @Setter 없음
```

---

## Placeholder 치환 가이드

| 플레이스홀더 | 의미 | 치환 예시 |
|---|---|---|
| `<package>` | 베이스 패키지 | `com.example.app` |
| `<Entity>` | 핵심 도메인 객체 (PascalCase) | `Order`, `Asset`, `Bundle` |
| `<entity>` | 변수/파일명 (camelCase) | `order`, `asset`, `bundle` |
| `<entities>` | URL 경로 / 테이블명 | `orders`, `assets`, `bundles` |
| `<entityId>` | ID 변수명 | `orderId`, `assetId` |
| `<ParentEntity>` | 상위 엔티티 | `Project`, `Workspace`, `Task` |
| `<parentEntity>` | 상위 엔티티 변수명 | `project`, `workspace` |
| `<parentEntityId>` | 상위 엔티티 ID | `projectId`, `taskId` |
| `<SubEntity>` | 하위 엔티티 | `Revision`, `Comment`, `Item` |
| `<subEntities>` | 하위 컬렉션 필드명 | `revisions`, `comments` |
| `<RelatedEntity>` | 연결 엔티티 | `Intent`, `Source`, `Tag` |
| `<Action>` | 액션 이름 | `Dispatch`, `Approve`, `Submit` |