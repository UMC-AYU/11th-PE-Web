### type vs interface

- 둘 다 객체의 구조와 프로퍼티 타입을 정의
- interface: 같은 이름으로 여러 번 선언 시 자동으로 합쳐지는 선언 병합이 가능
- type: union, primitive 등 다양한 타입 표현 가능

---

### **studyHour || 1** 과 **studyHour ?? 1** 의 결과가 다른 이유

- `console.log(studyHour || 1);`: 1
- `console.log(studyHour ?? 1);`: 0
- `||`가 `0`을 **falsy 값**으로 판단 → 오른쪽의 `1`을 선택