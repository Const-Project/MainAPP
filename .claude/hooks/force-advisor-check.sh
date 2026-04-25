#!/bin/bash
# Stop hook — fail-open 원칙: 훅 자체가 실패하면 차단하지 않고 통과

INPUT=$(cat)

# jq 없으면 즉시 통과 (block 안 함)
if ! command -v jq >/dev/null 2>&1; then
  exit 0
fi

# JSON 파싱 실패 시 통과
TRANSCRIPT=$(echo "$INPUT" | jq -r '.transcript_path // empty' 2>/dev/null)
STOP_HOOK_ACTIVE=$(echo "$INPUT" | jq -r '.stop_hook_active // false' 2>/dev/null)

# 무한루프 방지 — 한 번 block 한 적 있으면 무조건 통과
[ "$STOP_HOOK_ACTIVE" = "true" ] && exit 0

# transcript 경로가 비었거나 파일이 없으면 통과
[ -z "$TRANSCRIPT" ] && exit 0
[ ! -f "$TRANSCRIPT" ] && exit 0

# transcript 끝부분 읽기 실패 시 통과
RECENT=$(tail -c 20000 "$TRANSCRIPT" 2>/dev/null) || exit 0

# Completion check 이미 했으면 통과
echo "$RECENT" | grep -q "Completion check" && exit 0

# 여기까지 와야 block 발동
cat <<'EOF'
{
  "decision": "block",
  "reason": "종료 전 강제 advisor 호출 누락. 형식: 'Completion check: [변경 파일 리스트], [회귀 우려 지점 2-3개]'. 100단어 이내 응답을 받은 후 종료할 것."
}
EOF