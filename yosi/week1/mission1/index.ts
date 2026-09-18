function addScore(currentScore: number, bonusScore: number) {
  return currentScore + bonusScore;
}

console.log(addScore(80, 10)); // 90

const currentLevel: number = 1;
console.log("현재 레벨: " + currentLevel);

function introduceStudent(studentName: string, currentLevel: number) {
  return studentName + " 님은 현재 " + currentLevel + "레벨이에요.";
}

console.log(introduceStudent("광수", 1));

let studentName = "광수";
let studentLevel = 1;
let isCompleted = false;

console.log(studentName, studentLevel, isCompleted);

// 미니 실습: 값의 종류와 추론 확인하기
let myName = "홍길동"; // string으로 추론
let myCurrentWeek = 3; // number로 추론
let myIsCompleted = false; // boolean으로 추론

console.log(myName, myCurrentWeek, myIsCompleted);

const techStack: string[] = ["TypeScript", "React", "Node.js"];
console.log(techStack);

const objA = { name: "광수", level: 1 };
const objB = { name: "광수", level: 1 };
console.log(objA === objB); // false: 내용은 같지만 서로 다른 객체(참조)라서

// 4. 객체와 함수에 타입 붙이기
const student: {
  name: string;
  level: number;
  isCompleted: boolean;
} = {
  name: "광수",
  level: 1,
  isCompleted: false,
};

console.log(student);

// 미니 실습: 오류를 고쳐 회원 카드 만들기
type StudyCardMember = {
  name: string;
  level: number;
  isLeader: boolean;
};

const cardMember: StudyCardMember = {
  name: "광수",
  level: 1,
  isLeader: true,
};

function createMemberCard(studyMember: StudyCardMember) {
  return studyMember.name + " 님, " + studyMember.level + "레벨";
}

console.log(createMemberCard(cardMember));

// 5. 유니언 타입과 타입 좁히기
function printMemberId(memberId: string | number) {
  console.log(memberId);
}

printMemberId("member-01");
printMemberId(1);

// 미니 실습: 회원 역할에 따라 문구 바꾸기
type MemberRole = "leader" | "member";

function getRoleDescription(role: MemberRole) {
  if (role === "leader") {
    return "스터디를 이끌어요.";
  }
  return "스터디에 참여해요.";
}

console.log(getRoleDescription("leader"));
console.log(getRoleDescription("member"));

// 6. null과 undefined를 안전하게 다루기
type StudyMember = {
  name: string;
  githubId?: string;
};

const studyMembers: StudyMember[] = [
  { name: "광수", githubId: "gwangsoo" },
  { name: "지수" },
];

let selectedMember: StudyMember | null = null;
const foundMember = studyMembers.find((member) => member.name === "현우");

console.log(selectedMember); // null
console.log(foundMember); // undefined

// 미니 실습: 값이 없는 경우와 기본값 비교하기
if (foundMember) {
  console.log(foundMember.name);
}

const studyHours = 0;
console.log(studyHours || 10); // 10: 0은 falsy라서 || 는 오른쪽 값을 선택
console.log(studyHours ?? 10); // 0: null/undefined가 아니라서 ?? 는 왼쪽 값을 선택

const jisu = studyMembers[1];
console.log(jisu?.githubId ?? "등록되지 않음");

// 7. any 대신 unknown 사용하기
// 미니 실습: unknown 값 구분하기
function formatStudyWeek(value: unknown) {
  if (typeof value === "number") {
    return `현재 ${value}주차에요.`;
  }
  if (typeof value === "string") {
    return `입력한 주차: ${value}`;
  }
  return "주차를 확인할 수 없어요.";
}

console.log(formatStudyWeek(3));
console.log(formatStudyWeek("3주차"));
console.log(formatStudyWeek(true));

// 8. 제네릭 <T>로 타입 관계 지키기
// 미니 실습: createBox<T> 사용하기
function createBox<T>(value: T) {
  return { value };
}

const stringBox = createBox("TypeScript");
const numberBox = createBox(3);
const memberBox = createBox({ name: "민선", level: 1 });

console.log(stringBox.value); // string
console.log(numberBox.value); // number
console.log(memberBox.value); // { name: string; level: number }

// 9. strict 모드와 타입 오류 읽기
// 미니 실습: 오류 두 개 해결하기
type WeeklyGoal = {
  title: string;
  targetCount: number;
};

const weeklyGoal: WeeklyGoal = {
  title: "TypeScript 예제 연습",
  targetCount: 3,
};

function printGoal(goal: WeeklyGoal): string {
  console.log(goal.title);
  return goal.title + " (목표 " + goal.targetCount + "회)";
}

console.log(printGoal(weeklyGoal));
