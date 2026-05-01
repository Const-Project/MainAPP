import { Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { ComponentType } from "react";
import type { WebViewMessageEvent, WebViewProps } from "react-native-webview";

export type SelectedAddress = {
  postalCode: string;
  address: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (address: SelectedAddress) => void;
};

const POSTCODE_HTML = `
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <style>
      html, body, #wrap { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; }
    </style>
    <script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
  </head>
  <body>
    <div id="wrap"></div>
    <script>
      function postMessage(type, payload) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, payload: payload || {} }));
      }

      function openPostcode() {
        if (!window.daum || !window.daum.Postcode) {
          postMessage('error');
          return;
        }

        new window.daum.Postcode({
          oncomplete: function(data) {
            var address = data.roadAddress || data.jibunAddress || '';
            postMessage('selected', {
              postalCode: data.zonecode || '',
              address: address
            });
          },
          width: '100%',
          height: '100%'
        }).embed(document.getElementById('wrap'));
      }

      if (document.readyState === 'complete') {
        openPostcode();
      } else {
        window.onload = openPostcode;
      }
    </script>
  </body>
</html>
`;

function getWebView(): ComponentType<WebViewProps> | null {
  try {
    return require("react-native-webview").WebView as ComponentType<WebViewProps>;
  } catch {
    return null;
  }
}

export default function AddressSearchModal({ visible, onClose, onSelect }: Props) {
  const WebView = visible ? getWebView() : null;

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data) as {
        type?: string;
        payload?: SelectedAddress;
      };

      if (message.type === "selected" && message.payload) {
        onSelect(message.payload);
        onClose();
      }
    } catch {
      // Ignore malformed WebView messages.
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>주소 검색</Text>
          <TouchableOpacity onPress={onClose} activeOpacity={0.8} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
        {WebView ? (
          <WebView
            originWhitelist={["*"]}
            source={{ html: POSTCODE_HTML, baseUrl: "https://postcode.map.daum.net" }}
            onMessage={handleMessage}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            style={styles.webView}
          />
        ) : (
          <View style={styles.fallback}>
            <Text style={styles.fallbackTitle}>주소 검색을 열 수 없습니다.</Text>
            <Text style={styles.fallbackDescription}>
              현재 설치된 development build에 WebView 네이티브 모듈이 포함되어 있지 않습니다.
            </Text>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    minHeight: 56,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
  },
  closeButton: {
    minHeight: 40,
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#46C02B",
  },
  webView: {
    flex: 1,
  },
  fallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 8,
  },
  fallbackTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#171717",
  },
  fallbackDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
    textAlign: "center",
  },
});
