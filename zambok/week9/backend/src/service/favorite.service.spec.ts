import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { FavoriteService } from "./favorite.service";
import { Favorite } from "../entity/favorite.entity";
import { Member } from "../entity/member.entity";
import { ApiException } from "../exception/api.exception";

describe("FavoriteService", () => {
  const member = Object.assign(new Member(), { memberId: 1 });
  let service: FavoriteService;
  const favorites = { exists: jest.fn(), create: jest.fn(), save: jest.fn() };
  const members = { findOne: jest.fn() };
  const manager = { getRepository: jest.fn((entity: unknown) => entity === Member ? members : favorites) };

  beforeEach(async () => {
    jest.resetAllMocks();
    manager.getRepository.mockImplementation((entity: unknown) => entity === Member ? members : favorites);
    members.findOne.mockResolvedValue(member);
    const module = await Test.createTestingModule({
      providers: [FavoriteService, { provide: getRepositoryToken(Favorite), useValue: {
        manager: { transaction: async (work: (value: typeof manager) => Promise<unknown>) => work(manager) },
      } }],
    }).compile();
    service = module.get(FavoriteService);
    await module.close();
  });

  it("기존 회원이 새 영화를 즐겨찾기하면 저장하고 영화 ID를 반환한다", async () => {
    // Given
    favorites.exists.mockResolvedValue(false);
    favorites.create.mockReturnValue({ member, movieId: 550 });
    favorites.save.mockResolvedValue({ favoriteId: 1, movieId: 550, createdAt: new Date() });
    // When
    const result = await service.create(1, 550);
    // Then
    expect(result.movieId).toBe(550);
    expect(favorites.save).toHaveBeenCalledTimes(1);
    expect(favorites.save).toHaveBeenCalledWith({ member, movieId: 550 });
  });

  it("같은 영화가 이미 즐겨찾기면 FAVORITE409_1을 반환하고 저장하지 않는다", async () => {
    // Given
    favorites.exists.mockResolvedValue(true);
    favorites.create.mockReturnValue({ member, movieId: 550 });
    favorites.save.mockResolvedValue({ favoriteId: 2, movieId: 550, createdAt: new Date() });
    // When / Then
    const attempt = service.create(1, 550);
    await expect(attempt).rejects.toMatchObject({ code: "FAVORITE409_1" });
    await expect(attempt).rejects.toBeInstanceOf(ApiException);
    expect(favorites.save).not.toHaveBeenCalled();
  });
});
