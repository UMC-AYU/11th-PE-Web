type MemberRole = "leader" | "member";

interface StudyMember {
  id: number; //회원 ID
  name: string; // 이름
  role: MemberRole; //역할
  githubId?: string; //GitHub아이디
}

//서로 다른 정보 가진 회원 두 명 작성
const members: StudyMember[] = [
  {
    id: 1,
    name: "광수",
    role: "leader",
    githubId: "gwansoo",
  },
  {
    id: 2,
    name: "지수",
    role: "member",
  },
];

function createMemberGuide(memberId: number): string {
  const foundMember = members.find((member) => member.id === memberId);

  if (!foundMember) {
    return `ID ${memberId} 회원을 찾을 수 없습니다.`;
  }

  const roleMessage =
    foundMember.role === "leader" ? "스터디를 이끌어요." : "스터디에 참여해요.";
  const githubMessage = foundMember.githubId ?? "등록되지 않음";

  return `${foundMember.name} 님은 ${roleMessage} GitHub ID: ${githubMessage}`;
}

console.log(createMemberGuide(1));
console.log(createMemberGuide(2));
console.log(createMemberGuide(999));
