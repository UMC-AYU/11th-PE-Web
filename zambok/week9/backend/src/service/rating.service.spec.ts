import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { RatingService } from "./rating.service";
import { Rating } from "../entity/rating.entity";
import { Member } from "../entity/member.entity";

describe("RatingService", () => {
  let service: RatingService;
  const ratings = { exists: jest.fn(), findOne: jest.fn(), save: jest.fn() };
  const members = { findOne: jest.fn() };
  const manager = { getRepository: jest.fn((entity: unknown) => entity === Member ? members : ratings) };

  beforeEach(async () => {
    jest.resetAllMocks();
    manager.getRepository.mockImplementation((entity: unknown) => entity === Member ? members : ratings);
    members.findOne.mockResolvedValue({ memberId: 1 });
    const module = await Test.createTestingModule({ providers: [RatingService,
      { provide: getRepositoryToken(Rating), useValue: {
        manager: { transaction: async (work: (value: typeof manager) => Promise<unknown>) => work(manager) },
      } },
      { provide: getRepositoryToken(Member), useValue: members },
    ] }).compile();
    service = module.get(RatingService);
    await module.close();
  });

  it("같은 회원과 영화의 평점이 존재하면 RATING409_1을 반환한다", async () => {
    // Given
    ratings.exists.mockResolvedValue(true);
    // When / Then
    await expect(service.create(1, { movieId: 550, score: 5 })).rejects.toMatchObject({ code: "RATING409_1" });
    expect(ratings.save).not.toHaveBeenCalled();
  });

  it("다른 회원의 평점 수정은 RATING403_1로 거부하고 원본을 저장하지 않는다", async () => {
    // Given
    const rating = { ratingId: 1, member: { memberId: 2 }, score: 3, comment: "원본" };
    ratings.findOne.mockResolvedValue(rating);
    // When / Then
    await expect(service.update(1, 1, { score: 5, comment: "변경 시도" })).rejects.toMatchObject({ code: "RATING403_1" });
    expect(ratings.save).not.toHaveBeenCalled();
    expect(rating).toMatchObject({ score: 3, comment: "원본" });
  });
});
