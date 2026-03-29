import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { consumeRedirectPath } from "@/features/auth/lib/redirect-store";

export function LoginPage(): React.JSX.Element {
  const { state, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (state.user) {
      const redirectPath = consumeRedirectPath() ?? "/";
      void navigate(redirectPath, { replace: true });
    }
  }, [state.user, navigate]);

  const handleLogin = useCallback(async () => {
    setError(null);
    try {
      await login();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }, [login]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div>
          <h1 className="text-2xl font-bold">Zai Portal</h1>
          <p className="mt-2 text-sm text-gray-500">Sign in with GitHub to manage your portfolio</p>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          onClick={() => {
            void handleLogin();
          }}
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          Sign in with GitHub
        </button>
        <p className="text-xs text-gray-400">
          Uses the same authentication as{" "}
          <a href="https://koumatsumoto.github.io/ato/" className="underline hover:text-gray-600">
            ato
          </a>
        </p>
      </div>
    </div>
  );
}
