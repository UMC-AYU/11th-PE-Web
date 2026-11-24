import { useIsMutating, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useId, useState, type SubmitEvent } from "react";
import { HTTPError } from "ky";
import { getApiErrorMessage } from "../../api/api-response";
import { ratingKeys, ratingMutationOptions, ratingsQueryOptions, type Rating } from "../../api/ratings/ratings";
import { getMemberId, useAuthStore } from "../../stores/auth-store";
import { primaryButtonClass, secondaryButtonClass } from "../account/account-styles";

export function MovieRating({ movieId }: { movieId: number }) {
  const token = useAuthStore((state) => state.accessToken);
  const memberId = getMemberId(token);
  const ratingsQuery = useQuery(ratingsQueryOptions(memberId));

  if (!token) return <p className="mt-8 border-t border-slate-200 pt-6 text-sm"><Link className="font-bold text-blue-700" to="/login">로그인</Link>하고 평점을 남겨 보세요.</p>;
  if (memberId === null) return <p className="mt-8 text-sm text-red-700">회원 정보를 확인할 수 없어요. 다시 로그인해 주세요.</p>;
  if (ratingsQuery.isPending) return <p className="mt-8 text-sm" role="status">내 평점을 불러오는 중이에요.</p>;
  if (ratingsQuery.isError) return (
    <div className="mt-8 text-sm text-red-700" role="alert">
      <p>{getApiErrorMessage(ratingsQuery.error)}</p>
      <button className="mt-2 font-bold underline" type="button" onClick={() => void ratingsQuery.refetch()}>평점 조회 재시도</button>
    </div>
  );

  const rating = ratingsQuery.data.find((item) => item.movieId === movieId);
  return <RatingForm key={`${movieId}-${rating?.ratingId}-${rating?.updatedAt}`} movieId={movieId} rating={rating} memberId={memberId} token={token} />;
}

function RatingForm({ movieId, rating, memberId, token }: { movieId: number; rating?: Rating; memberId: number; token: string }) {
  const [score, setScore] = useState(rating?.score ?? 5);
  const [comment, setComment] = useState(rating?.comment ?? "");
  const id = useId();
  const queryClient = useQueryClient();
  const isChanging = useIsMutating({ mutationKey: ratingKeys.change(memberId, movieId) }) > 0;
  const mutation = useMutation({
    ...ratingMutationOptions(memberId, movieId),
    onMutate: () => queryClient.cancelQueries({ queryKey: ratingKeys.list(memberId) }),
    onSuccess: async () => {
      if (useAuthStore.getState().accessToken !== token) return;
      await queryClient.invalidateQueries({ queryKey: ratingKeys.list(memberId) });
    },
    onError: (error) => {
      if (useAuthStore.getState().accessToken !== token) return;
      if (error instanceof HTTPError && [404, 409].includes(error.response.status)) {
        void queryClient.invalidateQueries({ queryKey: ratingKeys.list(memberId) });
      }
    },
  });
  const canSave = Number.isInteger(score) && score >= 1 && score <= 5 && comment.length <= 500 &&
    (!rating || score !== rating.score || comment !== (rating.comment ?? ""));

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSave || isChanging) return;
    const body = { score, comment };
    mutation.mutate(rating ? { action: "update", ratingId: rating.ratingId, body } : { action: "create", body });
  }

  return (
    <section className="mt-8 border-t border-slate-200 pt-6" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="text-xl font-extrabold">내 평점</h2>
      {rating && <p className="mt-2 text-sm text-slate-600">등록한 평점 {rating.score}점 · {rating.comment || "작성한 후기가 없어요."}</p>}
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <fieldset disabled={isChanging} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-bold" htmlFor={`${id}-score`}>별점</label>
            <select id={`${id}-score`} name="score" className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm" value={score} onChange={(event) => setScore(Number(event.target.value))}>
              {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}점</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-bold" htmlFor={`${id}-comment`}>후기</label>
            <textarea id={`${id}-comment`} name="comment" className="min-h-28 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm" maxLength={500} placeholder="영화에 대한 감상을 남겨 주세요." value={comment} onChange={(event) => setComment(event.target.value)} aria-describedby={`${id}-count`} />
            <p id={`${id}-count`} className="mt-1 text-right text-xs text-slate-500">{comment.length}/500</p>
          </div>
          <div className="flex gap-2">
            <button className={primaryButtonClass} type="submit" disabled={!canSave || isChanging}>{isChanging ? "처리 중" : rating ? "평점 수정" : "평점 등록"}</button>
            {rating && <button className={secondaryButtonClass} type="button" onClick={() => mutation.mutate({ action: "delete", ratingId: rating.ratingId })}>평점 삭제</button>}
          </div>
        </fieldset>
        {mutation.isError && <p role="alert" className="text-sm text-red-700">{getApiErrorMessage(mutation.error)}</p>}
      </form>
    </section>
  );
}
