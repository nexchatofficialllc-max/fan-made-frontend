import { Stack } from "expo-router";
import { LoopaThemeProvider } from "../lib/loopa-theme";

export default function RootLayout() {
  return (
    <LoopaThemeProvider>
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

      <Stack.Screen
        name="fami"
        options={{
          headerShown: false,
        }}
      />
      </Stack>
    </LoopaThemeProvider>
  );
}
