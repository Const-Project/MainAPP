import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LeftIcon, RightIcon } from "@/assets/icons/CommonIcons";
import {
  Level0Icon,
  Level1Icon,
  Level2Icon,
  Level3Icon,
  getLevelIcon,
} from "@/assets/icons/LevelIcons";
import useCalendar from "@/hooks/log/useCalendarApi";

const { width } = Dimensions.get("window");
const CELL_WIDTH = (width - 32) / 7; // 7일 기준

type Props = {
  onSelectDate?: (isoDate: string) => void;
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function toISODateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month - 1, 1);
  while (date.getMonth() === month - 1) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function getStartDayOfWeek(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

export default function LogCalendar({ onSelectDate }: Props) {
  const now = new Date();
  const [ym, setYm] = useState<{ y: number; m: number }>({
    y: now.getFullYear(),
    m: now.getMonth() + 1,
  });

  const { data } = useCalendar(ym.y, ym.m);

  const countMap = useMemo(() => {
    const map = new Map<string, number>();
    if (!data) return map;

    if (data && "days" in data && Array.isArray(data.days)) {
      const { year, month } = data;
      data.days.forEach((d: { day: number; missionCompleteCount: number }) => {
        const iso = toISODateString(new Date(year, month - 1, d.day));
        const clamped = Math.min(3, Math.max(0, d.missionCompleteCount ?? 0));
        map.set(iso, clamped);
      });
    }

    return map;
  }, [data]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isFutureDate = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() > today.getTime();
  };

  const isToday = (date: Date) => {
    return toISODateString(date) === toISODateString(today);
  };

  const canGoToNextMonth = () => {
    const currentMonth = new Date();
    const nextMonth = new Date(ym.y, ym.m, 1); // 다음 달
    return (
      nextMonth.getFullYear() < currentMonth.getFullYear() ||
      (nextMonth.getFullYear() === currentMonth.getFullYear() &&
        nextMonth.getMonth() <= currentMonth.getMonth())
    );
  };

  const goMonth = (diff: number) => {
    if (diff > 0 && !canGoToNextMonth()) return;
    const next = new Date(ym.y, ym.m - 1 + diff, 1);
    setYm({ y: next.getFullYear(), m: next.getMonth() + 1 });
  };

  const days = getDaysInMonth(ym.y, ym.m);
  const startDay = getStartDayOfWeek(ym.y, ym.m);

  // 빈 셀 추가 (월 시작 요일 전)
  const emptyCells = Array(startDay).fill(null);
  const allCells = [...emptyCells, ...days];

  // 주 단위로 그룹화
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < allCells.length; i += 7) {
    weeks.push(allCells.slice(i, i + 7));
  }

  return (
    <View style={styles.container}>
      {/* 월 네비게이션 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goMonth(-1)} style={styles.navButton}>
          <LeftIcon size={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {ym.y}년 {ym.m}월
        </Text>
        <TouchableOpacity
          onPress={() => goMonth(1)}
          style={[styles.navButton, !canGoToNextMonth() && styles.navButtonDisabled]}
          disabled={!canGoToNextMonth()}
        >
          <RightIcon size={24} color={canGoToNextMonth() ? "#171717" : "#D1D5DB"} />
        </TouchableOpacity>
      </View>

      {/* 요일 헤더 */}
      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((day, index) => (
          <View key={index} style={styles.weekdayCell}>
            <Text style={[styles.weekdayText, index === 0 && styles.sundayText]}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* 캘린더 그리드 */}
      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.weekRow}>
          {week.map((date, dayIndex) => {
            if (!date) {
              return <View key={dayIndex} style={styles.dayCell} />;
            }

            const iso = toISODateString(date);
            const isFuture = isFutureDate(date);
            const count = isFuture ? 0 : (countMap.get(iso) ?? 0);
            const LevelIcon = getLevelIcon(count);

            return (
              <TouchableOpacity
                key={dayIndex}
                style={styles.dayCell}
                onPress={() => onSelectDate?.(iso)}
                disabled={isFuture}
              >
                <Text
                  style={[
                    styles.dayText,
                    isFuture && styles.futureDayText,
                    isToday(date) && styles.todayText,
                    dayIndex === 0 && styles.sundayText,
                  ]}
                >
                  {date.getDate()}
                </Text>
                <View style={styles.iconContainer}>
                  <LevelIcon size={28} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    gap: 48,
  },
  navButton: {
    padding: 4,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
    minWidth: 100,
    textAlign: "center",
  },
  weekdayRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekdayCell: {
    width: CELL_WIDTH,
    alignItems: "center",
    paddingVertical: 8,
  },
  weekdayText: {
    fontSize: 14,
    color: "#6B7280",
  },
  sundayText: {
    color: "#EF4444",
  },
  weekRow: {
    flexDirection: "row",
  },
  dayCell: {
    width: CELL_WIDTH,
    height: 64,
    alignItems: "center",
    paddingTop: 4,
  },
  dayText: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 4,
  },
  futureDayText: {
    color: "#D1D5DB",
  },
  todayText: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  iconContainer: {
    marginTop: 2,
  },
});
