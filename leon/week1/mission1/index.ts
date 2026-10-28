// 스터디 회원 관리 프로그램 완성하기

// 회원의 ID, 이름, 역할과 선택 값인 GitHub 아이디를 타입으로 표현하고, 서로 다른 정보를 가진 회원 두 명 이상을 작성해요.
type MemberRole = "leader" | "member";

type StudyMemberInfo = {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
};

const studyMembers: StudyMemberInfo[] = [
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


// 회원 ID로 정보를 찾아 안내 문구를 만들고, GitHub 아이디가 없는 회원과 존재하지 않는 회원도 오류 없이 처리해요.
function findMemberById(id: number): string {
  const member = studyMembers.find((member) => member.id === id);

  if (member === undefined) {
    return "존재하지 않는 회원입니다.";
  }

  const githubId = member.githubId ?? "GitHub 아이디 없음";

  return `${member.name} / ${member.role} / ${githubId}`;
}

// - 회원 ID `1`, `2`, `999`를 전달한 결과를 확인하고 `pnpm exec tsc --noEmit`, 컴파일과 실행을 모두 완료해요.
console.log(findMemberById(1));
console.log(findMemberById(2));
console.log(findMemberById(999));