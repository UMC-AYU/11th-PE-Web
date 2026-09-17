type StudyMemberAsType = {
    id: number;
    name: string;
    role: MemberRole;
    githubId?: string;
};

const studyHour: number | undefined = 0;

function formatMemberId(input: unknown) {
    if (typeof input === "number") {
        return `회원 ID는 ${input}번이에요.`;
    }

    if (typeof input === "string") {
        return `입력한 회원 ID: ${input}`;
    }

    return "회원 ID를 확인할 수 없어요.";
}