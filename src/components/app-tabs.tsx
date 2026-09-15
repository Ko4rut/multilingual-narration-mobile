import { Tabs } from "expo-router";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/hooks/use-theme";
import { getTabIcon, type TabName } from "@/constants/tab-icons";

type TabConfig = {
  name: TabName;
  title: string;
};

const tabs: TabConfig[] = [
  { name: "index", title: "Explore" },
  { name: "map", title: "Map" },
  { name: "qr-scan", title: "QR Scan" },
  { name: "offline", title: "Offline" },
  { name: "settings", title: "Settings" },
];

export default function AppTabs() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 12);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: theme.colors.background },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelPosition: "below-icon",
        tabBarLabelStyle: styles.label,
        tabBarIconStyle: styles.iconContainer,
        tabBarStyle: [styles.bar, {
          backgroundColor: theme.colors.background,
          height: 76 + bottomPadding,
          paddingBottom: bottomPadding,
        }],
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <View style={[
                styles.iconBackground,
                { backgroundColor: focused ? theme.colors.primary : "transparent" },
              ]}>
                <Image
                  source={getTabIcon(tab.name, focused ? theme.colors.white : theme.colors.textSecondary)}
                  contentFit="contain"
                  transition={0}
                  tintColor={focused ? theme.colors.white : theme.colors.textSecondary}
                  style={styles.icon}
                />
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingTop: 10,
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 5,
  },
  iconContainer: {
    width: 44,
    height: 44,
  },
  iconBackground: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 28,
    height: 28,
  },
});
