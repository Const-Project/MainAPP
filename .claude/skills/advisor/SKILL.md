---
name: advisor
description: "아키텍처·구현 접근법에 대한 Opus 모델 어드바이저. CLAUDE.md 워크플로우 규칙에 따라 Approach check / Completion check 시 호출. 100단어 이내, 단계 나열로만 응답."
---

# Advisor 규칙

이 스킬이 로드되면 반드시 **Agent tool (model: "opus")** 을 통해 어드바이저 응답을 위임한다.

## 호출 방식

```
Agent({
  subagent_type: "general-purpose",
  model: "opus",
  description: "Advisor check",
  prompt: "<사용자의 Approach check / Completion check 질문 그대로 전달>"
})
```

## 응답 형식 (Opus에게 전달할 프롬프트에 포함)

- 100단어 이내
- 단계 나열로만 (산문 금지)
- Approach check: 접근 순서 + 핵심 판단 지점만
- Completion check: 회귀 위험 항목 + 검증 필요 포인트만
