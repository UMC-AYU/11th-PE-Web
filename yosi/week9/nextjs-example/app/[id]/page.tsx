import { Suspense } from "react";

interface DynamicPageProps {
  // Next.js 16에서 params는 Promise라서 await로 꺼내 써요.
  params: Promise<{ id: string }>;
}

interface Todo {
  title: string;
}

// /[id]: URL의 id에 맞는 할 일을 공개 API에서 가져와요.
export default function DynamicPage({ params }: DynamicPageProps) {
  return (
    // 데이터를 기다리는 동안 fallback을 먼저 보여 줘요.
    <Suspense fallback={<div>DynamicPageLoading...</div>}>
      <DynamicPageScreen params={params} />
    </Suspense>
  );
}

// Server Component는 async 함수로 만들고, 안에서 await로 API 응답을 기다릴 수 있어요.
async function DynamicPageScreen({ params }: DynamicPageProps) {
  const { id } = await params;

  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);

  // response.ok로 성공 여부를 확인해요.
  if (!response.ok) {
    return <div>할 일을 불러오지 못했어요. (id: {id})</div>;
  }

  const todo: Todo = await response.json();

  return (
    <div>
      <div>Todo {id}</div>
      <div>{todo.title}</div>
    </div>
  );
}
