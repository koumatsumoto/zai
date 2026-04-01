import { QueryClientProvider } from "@tanstack/react-query";
import { configure, setupTokenRefresh, createAuthQueryClient, AuthProvider } from "@koumatsumoto/gh-auth-bridge-client/react";

configure({ proxyUrl: import.meta.env["VITE_OAUTH_PROXY_URL"] as string });
setupTokenRefresh();
const queryClient = createAuthQueryClient();

export function AppProviders({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
