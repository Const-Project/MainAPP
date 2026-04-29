import { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { MainTabParamList } from "./types";

import HomeScreen from "@/pages/home/HomeScreen";
import FeedScreen from "@/pages/feed/FeedScreen";
import LogScreen from "@/pages/log/LogScreen";
import OptionScreen from "@/pages/option/OptionScreen";
import {
  HomeIcon,
  CalendarIcon,
  SearchIcon,
  UserIcon,
  ACTIVE_COLOR,
  INACTIVE_COLOR,
} from "@/assets/icons/TabIcons";
import { debugLog } from "@/utils/debug";

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    debugLog("MainTabNavigator", "mounted");
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E5E5",
          height: 64 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 10),
          paddingTop: 8,
        },
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "홈",
          tabBarIcon: ({ focused }) => (
            <HomeIcon color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} />
          ),
        }}
      />
      <Tab.Screen
        name="Log"
        component={LogScreen}
        options={{
          tabBarLabel: "키움일지",
          tabBarIcon: ({ focused }) => (
            <CalendarIcon color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} />
          ),
        }}
      />
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarLabel: "둘러보기",
          tabBarIcon: ({ focused }) => (
            <SearchIcon color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} />
          ),
        }}
      />
      <Tab.Screen
        name="Option"
        component={OptionScreen}
        options={{
          tabBarLabel: "설정",
          tabBarIcon: ({ focused }) => (
            <UserIcon color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
