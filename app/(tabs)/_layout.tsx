import { Stack, Tabs } from "expo-router";
import React from "react";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Platform } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function AppLayout() {
    const colorScheme = useColorScheme();

    return (
        // <Stack
        //   screenOptions={{
        //     headerStyle: {
        //       backgroundColor: Colors[colorScheme ?? 'light'].background,
        //     },
        //     headerTintColor: Colors[colorScheme ?? 'light'].tint,
        //     headerTitleStyle: {
        //       fontWeight: 'bold',
        //     },
        //     headerTitle: 'App para perrites', // Cambia esto al nombre de tu aplicación
        //   }}>
        //   {/* <Stack.Screen name="index" /> */}
        //   {/* <Stack.Screen name="explore" /> */}
        // </Stack>

        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        position: "absolute",
                    },
                    default: {},
                }),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Registro",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="house.fill" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="ambient"
                options={{
                    title: "Ambient",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={28}
                            name="paperplane.fill"
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
