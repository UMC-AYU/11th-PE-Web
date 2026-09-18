type MemberId = number;

type Role = "PM" | "iOS" | "Android" | "PE(web)" | "모바일";

interface Member {
  id: MemberId;
  name: string;
  role: Role;
  githubId?: string;
}

const members: Member[] = [
  { id: 1, name: "민선", role: "PE(web)", githubId: "minseon-kim" },
  { id: 2, name: "항준", role: "PE(web)" },
  { id: 3, name: "현석", role: "PE(web)", githubId: "hyeongseok-choi" },
];

function findMemberById(id: MemberId): Member | undefined {
  return members.find((member) => member.id === id);
}

function getMemberIntro(id: MemberId): string {
  const member = findMemberById(id);

  if (!member) {
    return `ID ${id}에 해당하는 회원을 찾을 수 없습니다.`;
  }

  const githubInfo = member.githubId ? `GitHub: @${member.githubId}` : "GitHub 정보 없음";

  return `안녕하세요, ${member.role} 역할을 맡고 있는 ${member.name}입니다. (${githubInfo})`;
}

[1, 2, 999].forEach((id) => {
  console.log(getMemberIntro(id));
});
