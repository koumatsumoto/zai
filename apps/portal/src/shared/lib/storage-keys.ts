// Auth tokens (shared with ato — same GitHub App + OAuth Proxy)
export const TOKEN_KEY = "ato:token" as const;
export const REFRESH_TOKEN_KEY = "ato:refresh-token" as const;
export const EXPIRES_AT_KEY = "ato:token-expires-at" as const;
export const REFRESH_EXPIRES_AT_KEY = "ato:refresh-expires-at" as const;

// Zai-specific keys
export const HOLDINGS_KEY = "zai:holdings" as const;
export const FOREX_RATE_KEY = "zai:forex-rate" as const;
export const ASSETS_ISSUE_NUMBER_KEY = "zai:assets-issue-number" as const;
export const REPO_INITIALIZED_KEY = "zai:repo-initialized" as const;
