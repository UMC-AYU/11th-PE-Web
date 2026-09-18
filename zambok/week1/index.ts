// ================================
// 필수 미션
// 스터디 회원 관리 프로그램
// ================================

type MemberRole = "leader" | "member";

interface StudyMember {
    id: number;
    name: string;
    role: MemberRole;
    githubId?: string;
}

const members: StudyMember[] = [
    {
        id: 1,
        name: "광수",
        role: "leader",
        githubId: "gwangsoo",
    },
    {
        id: 2,
        name: "지수",
        role: "member",
    },
];

function createMemberMessage(memberId: number) {
    const member = members.find((member) => member.id === memberId);

    if (!member) {
        return "회원을 찾을 수 없어요.";
    }

    const roleMessage =
        member.role === "leader"
            ? "스터디를 이끌어요."
            : "스터디에 참여해요.";

    const githubId = member.githubId ?? "등록되지 않음";

    return (
        member.name +
        " 님 / " +
        roleMessage +
        " / GitHub: " +
        githubId
    );
}

console.log("=== 필수 미션 ===");
console.log(createMemberMessage(1));
console.log(createMemberMessage(2));
console.log(createMemberMessage(999));


// ================================
// 선택 미션 1
// interface와 같은 모양을 type으로 작성
// ================================

type StudyMemberType = {
    id: number;
    name: string;
    role: MemberRole;
    githubId?: string;
};

const typeMember: StudyMemberType = {
    id: 3,
    name: "현우",
    role: "member",
    githubId: "hyunwoo",
};

console.log("\n=== 선택 미션 1 ===");
console.log(typeMember);


// ================================
// 선택 미션 2
// || 와 ?? 비교
// ================================

const studyHour: number | undefined = 0;

console.log("\n=== 선택 미션 2 ===");
console.log("studyHour || 1 :", studyHour || 1);
console.log("studyHour ?? 1 :", studyHour ?? 1);


// ================================
// 선택 미션 3
// unknown 값 안전하게 처리
// ================================

function formatMemberId(input: unknown) {
    if (typeof input === "number") {
        return "MEMBER-" + input;
    }

    if (typeof input === "string") {
        return input.toUpperCase();
    }

    return "회원 ID를 확인할 수 없어요.";
}

console.log("\n=== 선택 미션 3 ===");
console.log(formatMemberId(1));
console.log(formatMemberId("member-02"));
console.log(formatMemberId(true));