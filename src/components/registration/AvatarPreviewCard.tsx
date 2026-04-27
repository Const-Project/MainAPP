import { Image, StyleSheet, Text, View } from "react-native";

type Props = {
  imageUrl?: string | null;
  title: string;
  description?: string;
};

export default function AvatarPreviewCard({
  imageUrl,
  title,
  description,
}: Props) {
  return (
    <View style={styles.card}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>{title}</Text>
        </View>
      )}
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: "#F2F8EE",
    gap: 12,
    alignItems: "center",
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 18,
    backgroundColor: "#E5E7EB",
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  placeholderText: {
    textAlign: "center",
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "700",
    color: "#1F5C27",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4B5563",
    textAlign: "center",
  },
});
