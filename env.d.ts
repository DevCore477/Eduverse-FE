import 'expo-constants';

declare module 'expo-constants' {
  interface Constants {
    expoConfig: {
      extra: {
        router: Record<string, unknown>;
        eas: { projectId: string };
        API_BASE_URL: string;
      };
    };
  }
}
