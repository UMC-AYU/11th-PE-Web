type MemberRole = "leader" | "member";

// 회원 인터페이스
interface StudyMember {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string; // 옵셔널 프로퍼티
}

//회원 객체
const members: StudyMember[] = [
  { name: "광수", id: 1,githubId: "gwangsoo", role:"leader" },
  { name: "지수" , id:2, role : "member"},
];

// iD값을 입력 받아야 하므로 function으로 작성
function getMemberNotice(id: number): string {
  const foundMember = members.find((member) => member.id === id);

  if (foundMember==undefined) {
    return "id "+id+" : 등록되지 않은 번호";}
  const githubText = foundMember.githubId ?? "등록되지 않음";
  const roleText =
    foundMember.role === "leader"
      ? "스터디를 이끌어요."
      : "스터디에 참여해요.";

  return `${foundMember.name} ${roleText} GitHub: ${githubText}`;
}

console.log(getMemberNotice(1));   
console.log(getMemberNotice(2));   
console.log(getMemberNotice(999)); 