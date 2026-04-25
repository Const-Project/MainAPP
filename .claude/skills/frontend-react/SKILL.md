---
name: frontend-react
description: "Use this skill when writing or reviewing React components, Next.js pages, or TypeScript frontend code. Covers component composition rules, props discipline, event handler naming, loading/error states, mock data patterns, and styling conventions. Triggers on React, Next.js, TSX, JSX, component, frontend, Tailwind keywords."
---

# React 컴포넌트 규칙

## 5개 핵심 규칙

```
1. 컴포넌트 하나당 파일 하나
2. 데이터를 직접 fetch하지 말 것 — props로만 받기
3. 버튼 onClick은 반드시 props로 받기 (내부에서 API 호출 금지)
4. useState는 최대한 위로 올리기 (페이지 레벨에서 관리)
5. 파일명 = 컴포넌트명 (<Entity>Card.tsx, <Entity>Panel.tsx)
```

---

## 절대 쓰지 말 것

```
- any 타입
- useEffect 안에서 fetch
- 컴포넌트 안에서 router.push 직접 호출
- console.log (디버깅 후 반드시 제거)
- 인라인 스타일 (style={{ }}) — Tailwind 클래스만
- 파일 안에 타입 직접 선언 (types/index.ts에서 import)
```

---

## 올바른 컴포넌트 패턴

**잘못된 것:**

```tsx
// <Entity>Card.tsx
export function <Entity>Card({ <entityId> }) {
  const [<entity>, set<Entity>] = useState(null);

  useEffect(() => {
    fetch(`/api/<entities>/${<entityId>}`)   // ← API 직접 호출 금지
      .then(r => r.json())
      .then(set<Entity>);
  }, [<entityId>]);

  return (
    <div onClick={() => fetch(`/api/<entities>/${<entityId>}/<action>`)}>
      {<entity>?.name}
    </div>
  );
}
```

**올바른 것:**

```tsx
// <Entity>Card.tsx — 데이터는 props, 액션은 콜백
import { <Entity> } from '@/types';

type Props = {
  name: string;
  status: <Entity>['status'];
  revision: string;
  isLoading: boolean;
  error: string | null;
  onClick: () => void;       // 내부에서 뭘 할지 모름, 위에서 결정
};

export function <Entity>Card({ name, status, revision, isLoading, error, onClick }: Props) {
  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div onClick={onClick}>
      <span>{name}</span>
      <Badge status={status} />
      <span>{revision}</span>
    </div>
  );
}
```

API 연결은 페이지 레벨에서만:

```tsx
// app/<entities>/page.tsx — API는 여기서만
const <entities> = await fetch<Entity>List(<parentEntityId>);

<<Entity>Card
  name={<entity>.name}
  status={<entity>.status}
  revision={`v${<entity>.version}`}
  isLoading={isLoading}
  error={error}
  onClick={() => router.push(`/<entities>/${<entity>.id}`)}
/>
```

---

## 이벤트 핸들러 네이밍

```
컨벤션: on + 명사 + 동사

on<Entity>Click            ← <Entity> 클릭
on<Entity>Approve          ← 승인 버튼
on<Entity>RequestChanges   ← 변경 요청
on<Action>Copy             ← 복사 버튼
on<SubEntity>Resolve       ← 댓글 resolve
```

---

## 로딩/에러 슬롯 — 반드시 포함

모든 컴포넌트 props에 아래 두 개 포함:

```tsx
type Props = {
  isLoading: boolean;
  error: string | null;
  // ... 나머지
};

if (isLoading) return <div>로딩 중...</div>;
if (error) return <div>{error}</div>;
```

---

## 목업 데이터 — 파일 하나로 통일

```tsx
// mocks/index.ts
import { <Entity>, <ParentEntity>, <RelatedEntity> } from '@/types';

export const mock<Entity>: <Entity> = {
  id: '<entity>-001',
  <parentEntityId>: '<parentEntity>-001',
  title: '<예시 제목>',
  status: 'in_review',
  createdBy: 'user-001',
  createdAt: '2026-04-14T10:00:00Z',
};

export const mock<ParentEntity>: <ParentEntity> = {
  id: '<parentEntity>-001',
  projectId: 'project-001',
  title: '<예시 제목>',
  assigneeId: 'user-001',
  startDate: '2026-04-14',
  endDate: '2026-04-27',
  status: 'in_progress',
};
```

컴포넌트 안에 하드코딩 금지. 무조건 이 파일에서 import.

---

## 컴포넌트 완성 기준

아래 네 개 체크 후 개발자에게 알릴 것:

```
□ props 타입 정의됨 (types/index.ts에서 import)
□ 로딩/에러 상태 처리됨
□ 목업 데이터로 렌더링 확인됨
□ lint/형식 위반 없음 (any 타입, 인라인 스타일 등)
```

---

## Placeholder 치환 가이드

| 플레이스홀더 | 의미 | 치환 예시 |
|---|---|---|
| `<Entity>` | 컴포넌트 대상 (PascalCase) | `Order`, `Asset`, `Post` |
| `<entity>` | 변수/파일명 (camelCase) | `order`, `asset`, `post` |
| `<entities>` | 라우트 경로 (복수형) | `orders`, `assets`, `posts` |
| `<entityId>` | ID prop 이름 | `orderId`, `assetId` |
| `<ParentEntity>` | 상위 엔티티 | `Project`, `Workspace` |
| `<parentEntityId>` | 상위 엔티티 ID | `projectId`, `workspaceId` |
| `<RelatedEntity>` | 연관 엔티티 | `Comment`, `Tag`, `Review` |
| `<SubEntity>` | 하위 엔티티 (네이밍용) | `Comment`, `Item` |
| `<Action>` | 액션 동사 (PascalCase) | `Submit`, `Cancel`, `Share` |