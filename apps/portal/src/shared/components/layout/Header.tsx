import { Link, useLocation } from "react-router";
import { useAuth } from "@/features/auth/hooks/use-auth";

export function Header(): React.JSX.Element {
  const location = useLocation();
  const { state, logout } = useAuth();
  const isHoldings = location.pathname.includes("/holdings");

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold">
          Zai Portal
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex gap-4 text-sm">
            <Link to="/" className={isHoldings ? "text-gray-500 hover:text-gray-900" : "font-medium text-gray-900"}>
              Dashboard
            </Link>
            <Link to="/holdings" className={isHoldings ? "font-medium text-gray-900" : "text-gray-500 hover:text-gray-900"}>
              Holdings
            </Link>
          </nav>
          {state.user && (
            <button onClick={logout} className="flex items-center gap-1.5" title={state.user.login}>
              <img src={state.user.avatarUrl} alt={state.user.login} className="h-6 w-6 rounded-full" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
