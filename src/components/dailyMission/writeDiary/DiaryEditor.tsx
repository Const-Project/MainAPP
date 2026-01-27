import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

import ImageUploader from "./ImageUploader";

interface DiaryEditorProps {
  title: string;
  content: string;
  onTitleChange: (text: string) => void;
  onContentChange: (text: string) => void;
  imageUri: string | null;
  onImageSelected: (uri: string) => void;
}

export default function DiaryEditor({
  title,
  content,
  onTitleChange,
  onContentChange,
  imageUri,
  onImageSelected,
}: DiaryEditorProps) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  return (
    <View style={styles.container}>
      {/* 날짜 및 제목 */}
      <View style={styles.headerSection}>
        <Text style={styles.dateText}>{`${year}년 ${month}월 ${day}일`}</Text>
        <TextInput
          style={styles.titleInput}
          placeholder="제목을 입력하세요"
          placeholderTextColor="#9CA3AF"
          value={title}
          onChangeText={onTitleChange}
        />
      </View>

      {/* 이미지 업로더 */}
      <ImageUploader imageUri={imageUri} onImageSelected={onImageSelected} />

      {/* 내용 입력 */}
      <View style={styles.contentSection}>
        {content === "" && (
          <View style={styles.placeholderContainer} pointerEvents="none">
            <Text style={styles.placeholderBold}>내 식물의 겨울나기</Text>
            <Text style={styles.placeholderNormal}>에 대해서</Text>
            <Text style={styles.placeholderNormal}>
              이야기해보는건 어때요?
            </Text>
          </View>
        )}
        <TextInput
          style={styles.contentInput}
          value={content}
          onChangeText={onContentChange}
          multiline
          textAlignVertical="top"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 50,
  },
  headerSection: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 32,
  },
  dateText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: "600",
    color: "#171717",
    marginBottom: 24,
    padding: 0,
  },
  contentSection: {
    position: "relative",
    minHeight: 120,
  },
  placeholderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  placeholderBold: {
    fontSize: 16,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  placeholderNormal: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  contentInput: {
    fontSize: 14,
    color: "#171717",
    minHeight: 120,
    padding: 0,
  },
});
