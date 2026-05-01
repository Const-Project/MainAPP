import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "@/navigation/types";
import ScreenHeader from "@/components/common/ScreenHeader";
import StatusView from "@/components/common/StatusView";
import FeedInfiniteDetailItem from "@/components/feed/FeedInfiniteDetailItem";
import usePostComment from "@/hooks/comments/useCommentApi";
import { useRandomFeedSession } from "@/hooks/feed/useRandomFeedSession";
import { useDiaryDetail } from "@/hooks/log/useDiaryDetailApi";
import type { FeedDetailResult } from "@/types/feed/detail";
import type { RandomFeedPostType, RandomFeedSessionItem } from "@/types/feed/randomFeedApi.type";
import { createTimingLogger } from "@/utils/debug";

type Props = RootStackScreenProps<"FeedDiary">;

type FeedListItem = {
  key: string;
  postId: number;
  postType: RandomFeedPostType;
  isSeed: boolean;
  sessionItem?: RandomFeedSessionItem;
};

export default function FeedDiaryScreen({ navigation, route }: Props) {
  const { postId } = route.params;

  const id = Number(postId);
  const isValidId = Number.isFinite(id) && id > 0;
  const { data, error, isLoading, isRefetching, refetch } = useDiaryDetail(isValidId ? id : 0);
  const [content, setContent] = useState("");
  const initialLoadTimingRef = useRef<ReturnType<typeof createTimingLogger> | null>(null);
  const { mutateAsync, isPending } = usePostComment(() => refetch());
  const {
    data: randomSession,
    isLoading: isRandomLoading,
    isError: isRandomError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRandomFeedSession({
    enabled: isValidId && Boolean(data),
    sessionKey: `DIARY:${id}`,
    size: 6,
  });

  useEffect(() => {
    initialLoadTimingRef.current = createTimingLogger("FeedDiaryScreen", "initial detail load", { postId: id });
  }, [id]);

  useEffect(() => {
    if (!data || !initialLoadTimingRef.current) {
      return;
    }

    initialLoadTimingRef.current({ hasRandomSession: Boolean(randomSession) });
    initialLoadTimingRef.current = null;
  }, [data, randomSession]);

  const handleBackClick = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("Main", { screen: "Feed" });
  };

  const handleSend = async () => {
    if (!isValidId || !content.trim()) return;

    try {
      await mutateAsync({ content, targetId: id, targetType: "DIARY" });
      setContent("");
    } catch (commentError) {
      console.error("[FeedDiaryScreen] Failed to post comment:", commentError);
    }
  };

  const seedResult: FeedDetailResult | undefined = data
    ? {
        id: data.id,
        writerId: data.writerId,
        writerName: data.writerName,
        profileImageUrl: data.profileImageUrl,
        content: data.content,
        imageUrl: data.imageUrl,
        isLiked: data.isLiked,
        likeCount: data.likeCount,
        commentCount: data.commentCount,
        comments: data.comments,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        isPublic: data.isPublic,
      }
    : undefined;

  const listData = useMemo<FeedListItem[]>(() => {
    if (!isValidId || !data) {
      return [];
    }

    const seenKeys = new Set<string>([`DIARY:${id}`]);
    const nextListData: FeedListItem[] = [
      { key: `seed-DIARY-${id}`, postId: id, postType: "DIARY", isSeed: true },
    ];

    for (const item of randomSession?.items ?? []) {
      const itemKey = `${item.postType}:${item.postId}`;
      if (seenKeys.has(itemKey)) {
        continue;
      }
      seenKeys.add(itemKey);
      nextListData.push({
        key: `random-${item.postType}-${item.postId}`,
        postId: item.postId,
        postType: item.postType,
        isSeed: false,
        sessionItem: item,
      });
    }

    return nextListData;
  }, [data, id, isValidId, randomSession?.items]);

  if (!isValidId) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScreenHeader title="둘러보기" onBack={handleBackClick} />
        <StatusView
          title="잘못된 게시글입니다."
          description="피드 목록에서 다시 선택해주세요."
          actionLabel="목록으로"
          onAction={handleBackClick}
        />
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScreenHeader
          title="둘러보기"
          onBack={handleBackClick}
          rightActionLabel="새로고침"
          onRightAction={() => void refetch()}
          rightActionDisabled={isLoading || isRefetching}
        />
        <StatusView title="게시글을 불러오는 중입니다." loading />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScreenHeader
          title="둘러보기"
          onBack={handleBackClick}
          rightActionLabel="새로고침"
          onRightAction={() => void refetch()}
          rightActionDisabled={isLoading || isRefetching}
        />
        <StatusView
          title="게시글을 불러오지 못했습니다."
          description="상단 새로고침이나 아래 버튼으로 다시 시도해주세요."
          actionLabel="다시 시도"
          onAction={() => void refetch()}
        />
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScreenHeader
          title="둘러보기"
          onBack={handleBackClick}
          rightActionLabel="새로고침"
          onRightAction={() => void refetch()}
          rightActionDisabled={isLoading || isRefetching}
        />
        <StatusView
          title="게시글 정보가 없습니다."
          description="현재 API에서 반환된 상세 데이터가 비어 있습니다."
          actionLabel="목록으로"
          onAction={handleBackClick}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScreenHeader
          title="둘러보기"
          onBack={handleBackClick}
          rightActionLabel="새로고침"
          onRightAction={() => void refetch()}
          rightActionDisabled={isLoading || isRefetching}
        />
        <FlatList
          data={listData}
          keyExtractor={item => item.key}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          updateCellsBatchingPeriod={80}
          windowSize={5}
          removeClippedSubviews={Platform.OS === "android"}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching && !isLoading}
              onRefresh={() => void refetch()}
              tintColor="#7DC960"
            />
          }
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              void fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.45}
          renderItem={({ item }) => (
            <FeedInfiniteDetailItem
              postId={item.postId}
              postType={item.postType}
              isSeed={item.isSeed}
              sessionItem={item.sessionItem}
              seedResult={item.isSeed ? seedResult : undefined}
              onSeedRefetch={item.isSeed ? refetch : undefined}
              commentValue={item.isSeed ? content : ""}
              onChangeComment={item.isSeed ? setContent : undefined}
              onSubmitComment={item.isSeed ? () => void handleSend() : undefined}
              isCommentPending={item.isSeed ? isPending : false}
            />
          )}
          ListFooterComponent={
            <View style={styles.footer}>
              {/* 한글 주석:
                  seed 포스트 아래 랜덤 카드가 이어 붙기 때문에,
                  다음 페이지 로딩 상태만 하단에서 가볍게 노출한다. */}
              {isFetchingNextPage ? (
                <ActivityIndicator color="#7DC960" />
              ) : null}
              {!isFetchingNextPage && isRandomLoading ? (
                <ActivityIndicator color="#7DC960" />
              ) : null}
              {isRandomError ? (
                <Text style={styles.footerText}>
                  랜덤 피드를 이어서 불러오지 못했습니다.
                </Text>
              ) : null}
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  footer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 8,
  },
  footerText: {
    fontSize: 13,
    color: "#6B7280",
  },
});
