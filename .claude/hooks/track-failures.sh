#!/bin/bash
# .claude/hooks/track-failures.sh
# PostToolUse(Bash) — Bash 출력에서 실패 패턴 추적

INPUT=$(cat)
TOOL_OUTPUT=$(echo "$INPUT" | jq -r '.tool_response.stdout // ""')
TOOL_STDERR=$(echo "$INPUT" | jq -r '.tool_response.stderr // ""')

# 실패 시그니처 추출 (테스트명/에러 첫 줄)
SIGNATURE=$(echo "$TOOL_STDERR$TOOL_OUTPUT" \
  | grep -E "FAIL|Error:|revert|✗" \
  | head -1 \
  | sha256sum | cut -c1-16)

[ -z "$SIGNATURE" ] && exit 0  # 실패 없으면 종료

# 카운터 파일에 누적
COUNTER_FILE="/tmp/claude-failures-$$.log"
COUNT=$(grep -c "^$SIGNATURE$" "$COUNTER_FILE" 2>/dev/null || echo 0)
echo "$SIGNATURE" >> "$COUNTER_FILE"

if [ "$COUNT" -ge 1 ]; then
  # 2회째 — advisor 호출 강제
  cat <<EOF
{
  "decision": "block",
  "reason": "같은 에러가 2회 반복됨. 같은 방법으로 재시도 금지. 즉시 advisor 호출하여 다른 접근법 받을 것. 형식: 'Loop break: [에러 시그니처], [지금까지 시도한 것 3개], [근본 원인 가설]'. 100단어 이내."
}
EOF
fi