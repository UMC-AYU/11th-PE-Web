export interface MemberProfile {
    email: string;
    nickname: string;
    favoriteGenre: string;
    introduction: string;
}

const STORAGE_KEY = "umcine-member-profile";

export const exampleProfile: MemberProfile = {
    email: "cine@example.com",
    nickname: "영화로운 하루",
    favoriteGenre: "드라마",
    introduction: "좋아하는 영화를 발견하고 기록하는 시간을 즐겨요.",
};

export function getMemberProfile(): MemberProfile {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return exampleProfile;

        const parsed: unknown = JSON.parse(stored);
        if (!parsed || typeof parsed !== "object") return exampleProfile;

        const profile = parsed as Partial<MemberProfile>;
        if (
            typeof profile.email !== "string" ||
            typeof profile.nickname !== "string" ||
            typeof profile.favoriteGenre !== "string" ||
            typeof profile.introduction !== "string"
        ) return exampleProfile;

        return profile as MemberProfile;
    } catch {
        return exampleProfile;
    }
}

export function saveMemberProfile(profile: MemberProfile) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
