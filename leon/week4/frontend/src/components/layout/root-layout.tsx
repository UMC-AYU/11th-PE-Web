import { Outlet } from "@tanstack/react-router";
import { Footer } from "./footer";
import { Header } from "./header";

export function RootLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-[#f7f8fa] text-[#17191f]">
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
}
