type MemberRole = "leader" | "member";

// StudyMember와 같은 모양을 type으로도 작성하고 interface와 어떤 점이 같은지, 어떤 점이 다른지 세 문장으로 정리해 보세요.
type StudyMember = {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
};

interface StudyMemberInterface {
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

function findMemberById(id: number): string {
  const member = members.find((member) => member.id === id);

  if (member === undefined) {
    return "존재하지 않는 회원입니다.";
  }

  const githubId = member.githubId ?? "GitHub 아이디 없음";

  return `${member.name} / ${member.role} / ${githubId}`;
}

console.log(findMemberById(1));
console.log(findMemberById(2));
console.log(findMemberById(999));


// `const studyHour: number | undefined = 0`을 작성하고 `studyHour || 1`과 `studyHour ?? 1`의 결과가 다른 이유를 정리해 보세요.
const studyHour: number | undefined = 0;

console.log(studyHour || 1); // 1
console.log(studyHour ?? 1); // 0


// formatMemberId(input: unknown)을 만들고 숫자, 문자열, 그 밖의 값을 안전하게 구분하여 처리해 보세요.
function formatMemberId(input: unknown): string {
  if (typeof input === "number") {
    return `숫자 회원 ID: ${input}`;
  }

  if (typeof input === "string") {
    return `문자열 회원 ID: ${input}`;
  }

  return "올바른 회원 ID가 아닙니다.";
}

console.log(formatMemberId(1));
console.log(formatMemberId("2"));
console.log(formatMemberId(true));