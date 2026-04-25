---
name: design-principles
description: "Use this skill when designing class structures, refactoring code for maintainability, evaluating coupling and cohesion, or applying SOLID principles. Triggers on SOLID, refactoring, design pattern, coupling, cohesion, single responsibility, dependency injection, interface segregation keywords."
---

# 설계 원칙 — SOLID & 결합도/응집도

## 핵심 방향

```
결합도는 낮게 (모듈 간 의존 최소화)
응집도는 높게 (하나의 모듈 = 하나의 책임)
```

---

## 절대 쓰지 말 것

```
- 전역 변수로 모듈 간 상태 공유 (공통 결합)
- public 필드 직접 접근 (내용 결합)
- boolean 플래그를 함수 인자로 넘겨 내부 분기 제어 (제어 결합)
- 하나의 클래스에서 저장 + 출력 + 계산 동시 처리 (단일책임 위반)
- 부모 클래스 메서드를 자식이 throw로 막기 (리스코프 위반)
- 쓰지 않는 인터페이스 메서드를 구현 강제 (인터페이스 분리 위반)
- 고수준 모듈 안에서 저수준 구현체 직접 new (의존역전 위반)
- 새 기능 추가 시 기존 함수 내부 수정 (개방폐쇄 위반)
```

---

## 결합도 — 나쁜 것부터 좋은 것 순서

| 등급 | 이름 | 특징 | 대처 |
|---|---|---|---|
| 최악 | 내용 결합 | 다른 모듈 내부 필드 직접 수정 | private + getter/setter |
| 나쁨 | 공통 결합 | 전역 변수 공유 | 생성자 주입으로 교체 |
| 나쁨 | 제어 결합 | boolean 플래그로 흐름 제어 | 함수 분리 또는 전략 패턴 |
| 보통 | 외부 결합 | 외부 자료구조 직접 참조 | 자료 결합으로 낮추기 |
| 보통 | 스탬프 결합 | 객체 전체를 넘김 | 필요한 필드만 추출해서 넘기기 |
| 좋음 | 자료 결합 | 기본 자료형만 주고받기 | 목표 상태 |

---

## 제어 결합 — 가장 자주 실수하는 패턴

**잘못된 것:**

```java
// boolean 플래그가 함수 내부 흐름을 결정
<processor>.<process>(<data>, true);  // true가 뭔지 호출부에서 알 수 없음

public void <process>(<DataType>[] <data>, boolean <flag>) {
    if (<flag>) { System.out.println("started"); }
    // ...
    if (<flag>) { System.out.println("done"); }
}
```

**올바른 것:**

```java
// 부가 책임은 별도 클래스가 담당
public class <Processor> {
    public void <process>(<DataType>[] <data>) { /* 순수 처리만 */ }
}

public class <Processor>WithLogging {
    private <Processor> <processor>;
    public void <process>(<DataType>[] <data>) {
        System.out.println("started");
        <processor>.<process>(<data>);
        System.out.println("done");
    }
}
```

→ **함수에 boolean 인자가 있으면 제어 결합 의심**. 함수를 두 개로 나누거나 래퍼 클래스를 만들 것.

---

## 응집도 — 낮은 것부터 높은 것 순서

| 등급 | 이름 | 특징 |
|---|---|---|
| 최악 | 우연적 | 연관 없는 기능들이 한 클래스에 |
| 나쁨 | 논리적 | switch/if로 유사한 기능 묶음 |
| 보통 | 시간적 | 초기화처럼 "같은 시점"에 실행 |
| 보통 | 절차적 | 순서대로 여러 기능 호출 |
| 좋음 | 교환적 | 같은 입력을 다른 방식으로 처리 |
| 좋음 | 순차적 | 이전 출력이 다음 입력으로 연결 |
| 최고 | 기능적 | 단 하나의 목적만 |

---

## 논리적 응집도 — switch/if가 신호

**잘못된 것:**

```java
// 새 타입 추가마다 이 함수를 수정해야 함 → 개방폐쇄 원칙 위반
public void <handle>(<EnumType> type, <PayloadType> payload) {
    switch (type) {
        case <CASE_A>: <handlerA>(payload); break;
        case <CASE_B>: <handlerB>(payload); break;
        case <CASE_C>: <handlerC>(payload); break;
    }
}
```

**올바른 것:**

```java
// 타입 추가 시 새 클래스만 추가, 기존 코드 수정 없음
interface <Handler> { void handle(<PayloadType> payload); }

class <HandlerA> implements <Handler> { ... }
class <HandlerB> implements <Handler> { ... }
class <HandlerC> implements <Handler> { ... }

// 호출부
<Handler> handler = registry.resolve(type);
handler.handle(payload);
```

→ **switch/if로 타입 분기 중이면 인터페이스 분리 + 전략 패턴 적용** 검토.

---

## SOLID — 위반 신호와 대처

### S — 단일 책임

```
위반 신호: 하나의 클래스가 계산도 하고, 출력도 하고, DB 저장도 함
대처: 역할별로 클래스 분리
       (<Calculator> / <Renderer> / <Repository>)
```

### O — 개방 폐쇄

```
위반 신호: 새 기능 추가할 때 기존 함수 내부를 열어서 else if 추가
대처: 인터페이스 하나 만들고 새 클래스로 확장 (기존 코드 수정 없이)
```

### L — 리스코프 대체

```
위반 신호: 자식 클래스의 오버라이드 메서드가 throw 던짐
대처: 인터페이스를 분리, 불가능한 동작은 처음부터 계약에 넣지 않기
```

```java
// 잘못된 것
class <SubType> extends <BaseType> {
    @Override
    public void <capability>() { throw new UnsupportedOperationException(); }
}

// 올바른 것
interface <BaseType> { void <commonCapability>(); }
interface <CapableType> extends <BaseType> { void <capability>(); }
class <SubTypeWithoutCapability> implements <BaseType> { ... }
class <SubTypeWithCapability> implements <CapableType> { ... }
```

### I — 인터페이스 분리

```
위반 신호: implements 후 일부 메서드를 빈 구현이나 throw로 채움
대처: 인터페이스를 쪼갬. 클라이언트가 쓰는 메서드만 계약에 포함
```

```java
// 잘못된 것
class <SubType> implements <BroadInterface> {
    public void <unsupportedMethod>() {
        throw new UnsupportedOperationException();
    }
}

// 올바른 것
interface <CapabilityA> { void <methodA>(); }
interface <CapabilityB> { void <methodB>(); }
class <SubTypeA> implements <CapabilityA> { ... }              // <methodB> 강제 없음
class <SubTypeAB> implements <CapabilityA>, <CapabilityB> { ... }
```

### D — 의존 역전

```
위반 신호: 고수준 클래스 생성자 안에서 new <저수준구현체>() 직접 생성
대처: 인터페이스에 의존, 구현체는 생성자 주입으로 외부에서 받기
```

```java
// 잘못된 것
class <HighLevel> {
    private <ConcreteLowLevel> <dependency> = new <ConcreteLowLevel>();
}

// 올바른 것
class <HighLevel> {
    private <LowLevelInterface> <dependency>;
    public <HighLevel>(<LowLevelInterface> <dependency>) {
        this.<dependency> = <dependency>;
    }
}
```

---

## 설계 완성 기준

```
□ 함수 인자에 boolean 플래그가 없음 (제어 결합 없음)
□ public 필드가 없음, 모든 접근은 메서드 경유 (내용 결합 없음)
□ 전역 변수 없음, 상태는 생성자 주입으로 전달 (공통 결합 없음)
□ 하나의 클래스 = 하나의 책임 (계산/출력/저장 분리됨)
□ 새 타입 추가 시 기존 함수를 수정하지 않아도 됨 (switch 분기 없음)
□ 자식 클래스 메서드가 throw를 던지지 않음
□ implements한 인터페이스의 모든 메서드를 실제로 구현함
□ 고수준 클래스 안에서 new <저수준구현체>() 없음
```

---

## Placeholder 치환 가이드

| 플레이스홀더 | 의미 | 치환 예시 |
|---|---|---|
| `<Processor>` | 처리 클래스 | `OrderProcessor`, `Validator` |
| `<process>` | 처리 메서드 | `process`, `validate`, `compute` |
| `<DataType>` | 데이터 타입 | `int`, `Order`, `Record` |
| `<Handler>` | 핸들러 인터페이스 | `MessageSender`, `EventHandler` |
| `<EnumType>` | 분기 enum | `MessageType`, `EventType` |
| `<CASE_A/B/C>` | enum 멤버 | `EMAIL/SMS/PUSH` |
| `<BaseType>` | 베이스 인터페이스 | `Bird`, `Worker`, `Vehicle` |
| `<CapableType>` | 능력 추가 인터페이스 | `FlyingBird`, `EatableWorker` |
| `<SubType>` | 구현 클래스 | `Sparrow`, `RobotWorker` |
| `<HighLevel>` | 의존하는 쪽 | `Computer`, `App` |
| `<LowLevelInterface>` | 의존받는 인터페이스 | `InputDevice`, `Logger` |
| `<ConcreteLowLevel>` | 구체 구현체 | `Keyboard`, `FileLogger` |