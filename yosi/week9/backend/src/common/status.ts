// src/common/status.ts
import { HttpStatus } from '@nestjs/common';

export type ResponseStatus = {
  httpStatus: HttpStatus;
  code: string;
  message: string;
};

// 성공 응답에 쓰는 코드와 메시지입니다.
export const SuccessStatus = {
  NICKNAME_CHECKED: {
    httpStatus: HttpStatus.OK,
    code: 'COMMON200',
    message: '닉네임 중복 확인에 성공했습니다.',
  },
  EMAIL_CHECKED: {
    httpStatus: HttpStatus.OK,
    code: 'COMMON200',
    message: '이메일 중복 확인에 성공했습니다.',
  },
  MEMBER_SIGNED_UP: {
    httpStatus: HttpStatus.CREATED,
    code: 'COMMON201',
    message: '회원가입에 성공했습니다.',
  },
  RATINGS_FOUND: {
    httpStatus: HttpStatus.OK,
    code: 'COMMON200',
    message: '평점 목록 조회에 성공했습니다.',
  },
  RATING_CREATED: {
    httpStatus: HttpStatus.CREATED,
    code: 'COMMON201',
    message: '평점 등록에 성공했습니다.',
  },
  RATING_UPDATED: {
    httpStatus: HttpStatus.OK,
    code: 'COMMON200',
    message: '평점 수정에 성공했습니다.',
  },
  LOGIN_SUCCEEDED: {
    httpStatus: HttpStatus.OK,
    code: 'COMMON200',
    message: '로그인에 성공했습니다.',
  },
  MY_PROFILE_FOUND: {
    httpStatus: HttpStatus.OK,
    code: 'COMMON200',
    message: '내 정보 조회에 성공했습니다.',
  },
  MY_PROFILE_UPDATED: {
    httpStatus: HttpStatus.OK,
    code: 'COMMON200',
    message: '내 정보 수정에 성공했습니다.',
  },
  FAVORITES_FOUND: {
    httpStatus: HttpStatus.OK,
    code: 'COMMON200',
    message: '내 즐겨찾기 목록을 조회했습니다.',
  },
  FAVORITE_STATUS_FOUND: {
    httpStatus: HttpStatus.OK,
    code: 'COMMON200',
    message: '즐겨찾기 여부를 조회했습니다.',
  },
  FAVORITE_ADDED: {
    httpStatus: HttpStatus.CREATED,
    code: 'COMMON201',
    message: '즐겨찾기를 등록했습니다.',
  },
  FAVORITE_REMOVED: {
    httpStatus: HttpStatus.OK,
    code: 'COMMON200',
    message: '즐겨찾기를 해제했습니다.',
  },
  MOVIE_RECORD_CREATED: {
    httpStatus: HttpStatus.CREATED,
    code: 'COMMON201',
    message: '영화 기록 저장에 성공했습니다.',
  },
} satisfies Record<string, ResponseStatus>;

// 실패 응답에 쓰는 코드와 메시지입니다.
// 코드 규칙: 도메인 + HTTP 상태 코드 + _순번 (예: MEMBER409_1 = 회원 도메인의 첫 번째 409 에러)
export const ErrorStatus = {
  BAD_REQUEST: {
    httpStatus: HttpStatus.BAD_REQUEST,
    code: 'COMMON400',
    message: '입력값이 올바르지 않습니다.',
  },
  NOT_FOUND: {
    httpStatus: HttpStatus.NOT_FOUND,
    code: 'COMMON404',
    message: '요청한 주소를 찾을 수 없습니다.',
  },
  INTERNAL_SERVER_ERROR: {
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    code: 'COMMON500',
    message: '서버 내부 오류가 발생했습니다.',
  },

  MEMBER_NOT_FOUND: {
    httpStatus: HttpStatus.NOT_FOUND,
    code: 'MEMBER404_1',
    message: '존재하지 않는 회원입니다.',
  },
  EMAIL_ALREADY_EXISTS: {
    httpStatus: HttpStatus.CONFLICT,
    code: 'MEMBER409_1',
    message: '이미 사용 중인 이메일입니다.',
  },
  NICKNAME_ALREADY_EXISTS: {
    httpStatus: HttpStatus.CONFLICT,
    code: 'MEMBER409_2',
    message: '이미 사용 중인 닉네임입니다.',
  },

  RATING_NOTHING_TO_UPDATE: {
    httpStatus: HttpStatus.BAD_REQUEST,
    code: 'RATING400_1',
    message: '수정할 평점 또는 한줄평을 입력해 주세요.',
  },
  RATING_FORBIDDEN: {
    httpStatus: HttpStatus.FORBIDDEN,
    code: 'RATING403_1',
    message: '본인이 남긴 평점만 수정하거나 삭제할 수 있습니다.',
  },
  RATING_NOT_FOUND: {
    httpStatus: HttpStatus.NOT_FOUND,
    code: 'RATING404_1',
    message: '존재하지 않는 평점입니다.',
  },
  RATING_ALREADY_EXISTS: {
    httpStatus: HttpStatus.CONFLICT,
    code: 'RATING409_1',
    message: '이미 평점을 남긴 영화입니다.',
  },

  // 로그인 실패는 "없는 이메일"과 "틀린 비밀번호"를 구분하지 않고 하나로 응답합니다.
  // 구분해서 알려주면 어떤 이메일이 가입되어 있는지 알아낼 수 있기 때문입니다.
  LOGIN_FAILED: {
    httpStatus: HttpStatus.UNAUTHORIZED,
    code: 'AUTH401_1',
    message: '이메일 또는 비밀번호가 올바르지 않습니다.',
  },
  TOKEN_MISSING: {
    httpStatus: HttpStatus.UNAUTHORIZED,
    code: 'AUTH401_2',
    message: '로그인이 필요합니다.',
  },
  TOKEN_INVALID: {
    httpStatus: HttpStatus.UNAUTHORIZED,
    code: 'AUTH401_3',
    message: '유효하지 않거나 만료된 토큰입니다.',
  },

  FAVORITE_NOT_FOUND: {
    httpStatus: HttpStatus.NOT_FOUND,
    code: 'FAVORITE404_1',
    message: '즐겨찾기하지 않은 영화입니다.',
  },
  FAVORITE_ALREADY_EXISTS: {
    httpStatus: HttpStatus.CONFLICT,
    code: 'FAVORITE409_1',
    message: '이미 즐겨찾기한 영화입니다.',
  },
} satisfies Record<string, ResponseStatus>;
