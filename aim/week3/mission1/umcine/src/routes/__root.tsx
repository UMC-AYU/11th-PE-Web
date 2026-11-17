import { createRootRoute, Outlet } from "@tanstack/react-router"; //모든 화면에서 유지
import { Header } from "../components/layout/header"; // URL애 따라 달라진다.

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />  
      <Outlet />  
    </>
  ),
  notFoundComponent: () => <main>페이지를 찾을 수 없어요.</main>,
});
