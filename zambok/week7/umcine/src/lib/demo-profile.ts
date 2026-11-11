export interface DemoProfile {
  nickname: string;
  email: string;
  introduction: string;
}

const STORAGE_KEY = "umcine-week7-demo-profile";

const DEFAULT_PROFILE: DemoProfile = {
  nickname: "UMCine 사용자",
  email: "demo@umcine.com",
  introduction: "영화를 좋아하는 UMCine 사용자입니다.",
};

export function getDemoProfile(): DemoProfile {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return { ...DEFAULT_PROFILE };
    }

    const parsed: unknown = JSON.parse(saved);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("nickname" in parsed) ||
      typeof parsed.nickname !== "string" ||
      !("email" in parsed) ||
      typeof parsed.email !== "string" ||
      !("introduction" in parsed) ||
      typeof parsed.introduction !== "string"
    ) {
      return { ...DEFAULT_PROFILE };
    }

    return {
      nickname: parsed.nickname,
      email: parsed.email,
      introduction: parsed.introduction,
    };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveDemoProfile(profile: DemoProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}