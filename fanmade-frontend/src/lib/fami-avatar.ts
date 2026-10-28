import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAMI_AVATAR_KEY = "loopa_fami_avatar";

export async function getFamiAvatar(): Promise<string | null> {
  return AsyncStorage.getItem(FAMI_AVATAR_KEY);
}

async function makeWebAvatarPersistent(uri: string): Promise<string> {
  if (Platform.OS !== "web") {
    return uri;
  }

  if (uri.startsWith("data:")) {
    return uri;
  }

  const response = await fetch(uri);
  const blob = await response.blob();

  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Unable to convert Fami avatar."));
      }
    };

    reader.onerror = () => {
      reject(new Error("Unable to read Fami avatar."));
    };

    reader.readAsDataURL(blob);
  });
}

export async function setFamiAvatar(uri: string): Promise<void> {
  const persistentUri = await makeWebAvatarPersistent(uri);
  await AsyncStorage.setItem(FAMI_AVATAR_KEY, persistentUri);
}

export async function clearFamiAvatar(): Promise<void> {
  await AsyncStorage.removeItem(FAMI_AVATAR_KEY);
}
