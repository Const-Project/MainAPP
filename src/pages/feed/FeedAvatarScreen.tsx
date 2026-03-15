import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
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
import { useAvatarPostDetail } from "@/hooks/feed/useAvatarPostDetailApi";
import { useRandomFeedSession } from "@/hooks/feed/useRandomFeedSession";
import type { FeedDetailResult } from "@/types/feed/detail";
import type { RandomFeedPostType } from "@/types/feed/randomFeedApi.type";
import { createTimingLogger } from "@/utils/debug";

type Props = RootStackScreenProps<"FeedAvatar">;

type FeedListItem = {
  key: string;
  postId: number;
  postType: RandomFeedPostType;
  isSeed: boolean;
};

export default function FeedAvatarScreen({ navigation, route }: Props) {
  const { postId } = route.params;

  const id = Number(postId);
  const isValidId = Number.isFinite(id) && id > 0;
  const { data, error, isLoading, refetch } = useAvatarPostDetail(isValidId ? id : 0);
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
    sessionKey: `AVATAR_POST:${id}`,
    size: 6,
  });

  useEffect(() => {
    initialLoadTimingRef.current = createTimingLogger("FeedAvatarScreen", "initial detail load", { postId: id });
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
      await mutateAsync({ content, targetId: id, targetType: "AVATAR_POST" });
      setContent("");
    } catch (commentError) {
      console.error("[FeedAvatarScreen] Failed to post comment:", commentError);
    }
  };

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
        <ScreenHeader title="둘러보기" onBack={handleBackClick} />
        <StatusView title="게시글을 불러오는 중입니다." loading />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScreenHeader title="둘러보기" onBack={handleBackClick} />
        <StatusView
          title="게시글을 불러오지 못했습니다."
          description="현재 API 응답을 다시 확인해야 합니다."
          actionLabel="다시 시도"
          onAction={() => void refetch()}
        />
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScreenHeader title="둘러보기" onBack={handleBackClick} />
        <StatusView
          title="게시글 정보가 없습니다."
          description="현재 API에서 반환된 상세 데이터가 비어 있습니다."
          actionLabel="목록으로"
          onAction={handleBackClick}
        />
      </SafeAreaView>
    );
  }

  const seedResult: FeedDetailResult = {
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
  };

  const seenKeys = new Set<string>([`AVATAR_POST:${id}`]);
  const listData: FeedListItem[] = [
    {
      key: `seed-AVATAR_POST-${id}`,
      postId: id,
      postType: "AVATAR_POST",
      isSeed: true,
    },
  ];

  for (const item of randomSession?.items ?? []) {
    const itemKey = `${item.postType}:${item.postId}`;
    if (seenKeys.has(itemKey)) {
      continue;
    }
    seenKeys.add(itemKey);
    listData.push({
      key: `random-${item.postType}-${item.postId}`,
      postId: item.postId,
      postType: item.postType,
      isSeed: false,
    });
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScreenHeader title="둘러보기" onBack={handleBackClick} />
        <FlatList
          data={listData}
          keyExtractor={item => item.key}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
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
