import { QueryClientProvider } from "@tanstack/react-query";
import { configure, setupTokenRefresh, createAuthQueryClient, AuthProvider, TOKEN_CLEARED_EVENT } from "@koumatsumoto/gh-auth-bridge-client/react";
import { REPO_INITIALIZED_KEY, ASSETS_ISSUE_NUMBER_KEY } from "@/shared/lib/storage-keys";

const proxyUrl = import.meta.env["VITE_OAUTH_PROXY_URL"] as string | undefined;
if (!proxyUrl) throw new Error("VITE_OAUTH_PROXY_URL environment variable is not set");
configure({ proxyUrl });
setupTokenRefresh();
const queryClient = createAuthQueryClient();

window.addEventListener(TOKEN_CLEARED_EVENT, () => {
  localStorage.removeItem(REPO_INITIALIZED_KEY);
  localStorage.removeItem(ASSETS_ISSUE_NUMBER_KEY);
});

export function AppProviders({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
