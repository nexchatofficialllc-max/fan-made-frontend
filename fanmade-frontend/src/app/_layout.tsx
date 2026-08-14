import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="intro"
        options={{
          animation: "none",
        }}
      />

      <Stack.Screen
        name="(tabs)"
        options={{
          animation: "none",
        }}
      />
    </Stack>
  );
}
