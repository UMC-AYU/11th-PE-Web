import { HttpStatus } from "@nestjs/common";
import type { EntityManager } from "typeorm";
import { Member } from "../entity/member.entity";
import { ApiException } from "../exception/api.exception";

export async function requireMember(manager: EntityManager, memberId: number): Promise<Member> {
    const member = await manager.getRepository(Member).findOne({
        where: { memberId },
        select: { memberId: true },
    });

    if (!member) {
        throw new ApiException(
            HttpStatus.NOT_FOUND,
            "MEMBER404_1",
            "존재하지 않는 유저입니다.",
        );
    }

    return member;
}
