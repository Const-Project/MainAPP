import { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { MainTabScreenProps } from "@/navigation/types";
import StatusView from "@/components/common/StatusView";
import useHomeApi from "@/hooks/home/useHomeApi";
import { useHomeSummaryStore } from "@/stores/useHomeSummaryStore";
import {
  getGardenLocked,
  getGardenUnlockable,
  getMissionCompleted,
  type GardenSummary,
  type HomeMissionType,
  type TodayMission,
} from "@/types/home/garden";

type Props = MainTabScreenProps<"Home">;
type MissionRouteName =
  | "DailyMissionWriteDiary"
  | "DailyMissionQuizMultipleChoice"
  | "DailyMissionChecking"
  | null;

export default function HomeScreen({ navigation }: Props) {
  const { data, error, isLoading, refetch } = useHomeApi();
  const { user, gardens, missions, hydrate } = useHomeSummaryStore();

  useEffect(() => {
    if (data) {
      hydrate(data);
    }
  }, [data, hydrate]);

  const userInfo = data?.userInfo ?? user;
  const gardenSummaries = data?.gardenSummaries ?? gardens;
  const todayMissions = data?.todayMissions ?? missions;

  if (isLoading && !userInfo && gardenSummaries.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusView title="홈 정보를 불러오는 중입니다." loading />
      </SafeAreaView>
    );
  }

  if (error && !userInfo && gardenSummaries.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusView
          title="홈 요약 API를 아직 사용할 수 없습니다."
          description="현재 앱에는 홈 화면 뼈대만 연결했고, /api/v1/home 응답이 준비되면 같은 화면에서 실제 데이터를 표시합니다."
          actionLabel="다시 시도"
          onAction={() => void refetch()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>현재 동작하는 홈 정보</Text>
          <Text style={styles.heroTitle}>
            {userInfo ? `${userInfo.username}님의 정원` : "정원 요약"}
          </Text>
          <Text style={styles.heroDescription}>
            {userInfo
              ? `레벨 ${userInfo.level} · 알림 ${userInfo.unreadNotificationCount}개`
              : "홈 요약 API가 연결되면 사용자 정보와 정원 상태가 여기에 표시됩니다."}
          </Text>
        </View>

        <SectionTitle
          title="오늘의 미션"
          subtitle="문구가 아니라 missionType 계약을 기준으로 화면을 연결합니다."
        />
        {todayMissions.length > 0 ? (
          todayMissions.map(mission => (
            <MissionCard
              key={mission.missionId}
              mission={mission}
              onPress={() => {
                const routeName = getMissionRouteName(mission);
                if (routeName) {
                  navigation.navigate(routeName);
                }
              }}
            />
          ))
        ) : (
          <InfoCard
            title="표시할 미션이 없습니다."
            description="미션 패널 API 또는 홈 summary 응답이 준비되면 이 영역을 확장합니다."
          />
        )}

        <SectionTitle
          title="정원 현황"
          subtitle="홈 API에서 내려온 정원 슬롯만 표시합니다."
        />
        {gardenSummaries.length > 0 ? (
          gardenSummaries.map(garden => (
            <GardenCard key={garden.gardenId} garden={garden} />
          ))
        ) : (
          <InfoCard
            title="표시할 정원 정보가 없습니다."
            description="현재는 실제 정원 summary가 있을 때만 슬롯 상태를 렌더링합니다."
          />
        )}

        <SectionTitle
          title="바로가기"
          subtitle="현재 실제로 이어지는 코어 흐름만 노출합니다."
        />
        <View style={styles.quickActions}>
          <QuickAction
            title="키움일지"
            description="캘린더와 월별 일기 목록으로 이동"
            onPress={() => navigation.navigate("Log")}
          />
          <QuickAction
            title="둘러보기"
            description="피드 목록과 상세 화면으로 이동"
            onPress={() => navigation.navigate("Feed")}
          />
          <QuickAction
            title="텃밭 해금하기"
            description="정원 해금과 배송 입력 화면으로 이동"
            onPress={() => navigation.navigate("UnlockGarden")}
          />
          <QuickAction
            title="일기 쓰기"
            description="데일리 미션 일기 작성으로 이동"
            onPress={() => navigation.navigate("DailyMissionWriteDiary")}
          />
          <QuickAction
            title="퀴즈 풀기"
            description="오늘의 퀴즈 화면으로 이동"
            onPress={() => navigation.navigate("DailyMissionQuizMultipleChoice")}
          />
          <QuickAction
            title="오늘의 질문"
            description="체크인형 질문 미션으로 이동"
            onPress={() => navigation.navigate("DailyMissionChecking")}
          />
        </View>

        <SectionTitle
          title="보류된 홈 연결"
          subtitle="이번 단계에서 계약 또는 화면 부재로 남겨둔 항목입니다."
        />
        <InfoCard
          title="정원 상호작용"
          description="물/햇빛 같은 홈 상호작용은 여전히 보류 상태입니다. 배송/정원 확장은 별도 화면으로 연결했습니다."
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionSubtitle}>{subtitle}</Text>
    </View>
  );
}

function MissionCard({
  mission,
  onPress,
}: {
  mission: TodayMission;
  onPress?: () => void;
}) {
  const routeName = getMissionRouteName(mission);
  const completed = getMissionCompleted(mission);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={routeName ? 0.85 : 1}
      disabled={!routeName}
      onPress={routeName ? onPress : undefined}
    >
      <View style={styles.rowBetween}>
        <Text style={styles.cardTitle}>{mission.missionTitle}</Text>
        <Text style={completed ? styles.doneBadge : styles.todoBadge}>
          {completed ? "완료" : routeName ? "진행 전" : "준비 중"}
        </Text>
      </View>
      <Text style={styles.cardDescription}>{getMissionLabel(mission.missionType)}</Text>
    </TouchableOpacity>
  );
}

function getMissionRouteName(mission: TodayMission): MissionRouteName {
  switch (mission.missionType as HomeMissionType) {
    case "DIARY":
      return "DailyMissionWriteDiary";
    case "QUIZ":
      return "DailyMissionQuizMultipleChoice";
    case "CHECKING":
      return "DailyMissionChecking";
    default:
      return null;
  }
}

function getMissionLabel(missionType: TodayMission["missionType"]) {
  switch (missionType as HomeMissionType) {
    case "DIARY":
      return "일기 작성 미션";
    case "QUIZ":
      return "퀴즈 미션";
    case "CHECKING":
      return "오늘의 질문 미션";
    default:
      return `알 수 없는 미션 타입: ${String(missionType)}`;
  }
}

function GardenCard({ garden }: { garden: GardenSummary }) {
  const isLocked = getGardenLocked(garden);
  const isUnlockable = getGardenUnlockable(garden);
  const status = isLocked ? (isUnlockable ? "잠금 해제 가능" : "잠금 상태") : "사용 가능";

  const actionState = isLocked
    ? "정원 해금 대기"
    : `${garden.ownerWateringAble ? "물주기 가능" : "물주기 대기"} · ${
        garden.ownerSunlightAble ? "햇빛 가능" : "햇빛 대기"
      }`;

  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.cardTitle}>정원 슬롯 {garden.gardenSlotNumber}</Text>
        <Text style={styles.cardMeta}>{status}</Text>
      </View>
      <Text style={styles.cardDescription}>
        {garden.avatar?.avatarName ?? "배정된 식물이 없습니다."}
      </Text>
      <Text style={styles.cardMeta}>{actionState}</Text>
    </View>
  );
}

function QuickAction({
  title,
  description,
  onPress,
}: {
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.quickAction}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={styles.quickActionTitle}>{title}</Text>
      <Text style={styles.quickActionDescription}>{description}</Text>
    </TouchableOpacity>
  );
}

function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <View style={[styles.card, styles.infoCard]}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8F4",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 14,
  },
  heroCard: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: "#2F5D3B",
  },
  eyebrow: {
    fontSize: 12,
    color: "#D1E7CF",
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  heroDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#E7F3E4",
  },
  sectionHeader: {
    marginTop: 6,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
  },
  sectionSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: "#6B7280",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  infoCard: {
    backgroundColor: "#F0F4EC",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#171717",
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4B5563",
  },
  cardMeta: {
    fontSize: 12,
    color: "#6B7280",
  },
  doneBadge: {
    fontSize: 12,
    color: "#2F7D32",
    fontWeight: "700",
  },
  todoBadge: {
    fontSize: 12,
    color: "#B45309",
    fontWeight: "700",
  },
  quickActions: {
    gap: 12,
  },
  quickAction: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#171717",
    marginBottom: 4,
  },
  quickActionDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: "#6B7280",
  },
});
