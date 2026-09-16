# 11th PE-Web Git Workflow
UMC AYU 11th PE-Web Git 사용 방법입니다.

<br>

## 1. 로컬 환경 세팅
로컬에 생성하는 폴더 구조입니다.

```
개인 폴더
└ 닉네임
    └ 주차 폴더
        └ 미션 파일
```

예시
```
11th-PE-Web
└ leon
    └ week1
        └ mission1
        └ mission2
        └ mission3
```

<br>

## 2. Git 저장소 생성 및 Github Repository 연결
```
git init
git remote add origin 레포지토리주소
```

<br>

## 3. main 브랜치 동기화
```
git pull origin main
```
- 초기 GitHub 리포지토리에 README.md 파일이 존재하기 때문에 반드시 필요합니다.

<br>

## 4. 개인 브랜치 생성
자신의 닉네임(소문자)으로 브랜치를 생성합니다.
```
git checkout -b 닉네임
```

예시
```
git checkout -b leon
```

<br>

## 5. 커밋
파일을 추가하고 커밋을 진행합니다.

예시
```
git add .
git commit -m "커밋 메시지"
```
- 커밋 단위는 미션 별로, 혹은 개별 미션에서 더 세부적으로 진행해주세요.

### 📌 커밋 컨벤션
| **유형**               | **설명**                         | 
|:---------------------|:-------------------------------| 
| **feature**          | **새로운 기능 추가**                  | 
| **refactor**         | **코드 리팩토링**                    | 
| **fix**              | **일반적인 버그 수정**                 | 
| **docs**             | **문서 수정 (README, 주석, 위키 등)**   | 
| **test**             | **테스트 코드 추가**                  |
| **chore**            | **기타 관리 작업 (라이브러리 업데이트 등)**    | 
| **comment**          | **주석 추가 및 변경**                 | 
| **rename**           | **파일/폴더명 수정 및 위치 이동**          | 
| **remove**           | **파일 삭제**                      | 

예시
```
git commit -m "feature: 1주차 미션1 구현"
```

<br>

## 6. 자신의 브랜치로 Push
⚠ main 브랜치로 push 하면 안 됩니다

반드시 본인 브랜치로 push 합니다.
```
git push origin 닉네임
```

<br>

## 7. Pull Request 생성
본인의 브랜치에 코드가 정상적으로 올라갔다면
GitHub 에서 Compare & Pull Request 버튼을 클릭해 PR 을 생성합니다.

- PR 은 Main 브랜치가 아닌 본인의 스터디 팀 브랜치에 병합하도록 열어주셔야 합니다.

예시
```
leon -> PE-Web-B
```

<br>

### Pull Request 작성 규칙
#### Title
```
[닉네임/이름] n주차 미션 제출
```

예시
```
[리온/최형석] 1주차 미션 제출
```

#### Description
1주차 미션을 진행했습니다.
프론트는 ts 를, 백엔드에서는 ERD 를 공부하였습니다.
- description 은 워크북 공부한 내용 혹은 미션 진행한 내용을 간단히 적어주시면 됩니다.

<br>

## 📌 주의사항
- 브랜치는 반드시 자신의 닉네임으로 생성
- 닉네임은 반드시 영어 소문자
- main 브랜치에 직접 push 금지
- 작업은 본인 브랜치에서 commit & push
- PR 은 각자 스터디 팀 브랜치로 열기
