import { StatusBar } from "expo-status-bar";
import { Redirect, Tabs } from "expo-router";
import { Image, Text, View, StyleSheet } from "react-native";

import { icons } from "../../constants";
import { Loader } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import React from "react";

const styles = StyleSheet.create({
  tabIcon: {
    width: 24,
    height: 24,
  },
  tabBarStyle: {
    backgroundColor: "#161622",
    borderTopWidth: 1,
    borderTopColor: "#232533",
    height: 64,
  },
});

const TabIcon = ({ icon, color, name, focused }) => (
  <View className="flex items-center justify-center gap-2">
    <Image
      source={icon}
      resizeMode="contain"
      style={[styles.tabIcon, { tintColor: color }]}
      accessibilityLabel={`${name} Icon`}
    />
    <Text
      className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
      style={{ color }}
    >
      {name}
    </Text>
  </View>
);

const TabLayout = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && !isLogged) {
    return <Redirect href="/sign-in" />;
  }

  const tabs = [
    { name: "home", title: "Home", icon: icons.home },
    { name: "bookmark", title: "Bookmark", icon: icons.bookmark },
    { name: "create", title: "Create", icon: icons.plus },
    { name: "profile", title: "Profile", icon: icons.profile },
  ];

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBarStyle,
        }}
      >
        {tabs.map(({ name, title, icon }) => (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              title,
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icon}
                  color={color}
                  name={title}
                  focused={focused}
                />
              ),
            }}
          />
        ))}
      </Tabs>

      <Loader isLoading={loading} />
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default TabLayout;
