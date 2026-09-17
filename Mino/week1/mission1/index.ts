type MemberRole = "leader" | "member";

interface StudyMember {
    id: number;
    name: string;
    role: MemberRole;
    githubId?: string;
}

const members: StudyMember[] = [
    { id: 1, name: "광수", role: "leader", githubId: "gwangsoo" },
    { id: 2, name: "지수", role: "member" },
];

function createMemberGuide(memberId: number): string {
    const member = members.find((studyMember) => studyMember.id === memberId);

    if (member === undefined) {
        return `ID ${memberId}번 회원을 찾을 수 없어요.`;
    }

    const githubId = member.githubId?.trim() ?? "등록되지 않음";

    return `${member.name} 님은 ${getRoleMessage(member.role)} GitHub: ${githubId}`;
}