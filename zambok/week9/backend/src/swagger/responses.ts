import { applyDecorators, type Type } from "@nestjs/common";
import { ApiExtraModels, ApiResponse, getSchemaPath } from "@nestjs/swagger";

export function ApiEnvelopeResponse(status: number, description: string, model?: Type<unknown>, isArray = false) {
  const item = model ? { $ref: getSchemaPath(model) } : { type: "object" as const, nullable: true, example: null };
  return applyDecorators(
    ...(model ? [ApiExtraModels(model)] : []),
    ApiResponse({ status, description, schema: {
      type: "object", required: ["isSuccess", "code", "message", "result"],
      properties: {
        isSuccess: { type: "boolean", example: true },
        code: { type: "string", example: `COMMON${status}` },
        message: { type: "string", example: description },
        result: isArray ? { type: "array", items: item } : item,
      },
    } }),
  );
}

export function ApiFailure(status: number, examples: Record<string, string>) {
  return ApiResponse({ status, description: Object.values(examples).join(" / "), content: {
    "application/json": {
      schema: { type: "object", required: ["isSuccess", "code", "message", "result"], properties: {
        isSuccess: { type: "boolean", example: false }, code: { type: "string" },
        message: { type: "string" }, result: { type: "object", nullable: true, example: null },
      } },
      examples: Object.fromEntries(Object.entries(examples).map(([code, message]) =>
        [code, { summary: message, value: { isSuccess: false, code, message, result: null } }])),
    },
  } });
}

export function ApiAuthErrors() {
  return ApiFailure(401, {
    AUTH401_2: "로그인이 필요한 요청입니다.", AUTH401_3: "유효하지 않은 토큰입니다.", AUTH401_4: "만료된 토큰입니다.",
  });
}
