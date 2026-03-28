import { Outlet } from "react-router";
import { Header } from "./Header";

export function Layout(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
