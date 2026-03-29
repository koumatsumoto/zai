// Auth tokens (shared via gh-auth-bridge)
export const TOKEN_KEY = "gh-auth-bridge:token" as const;
export const REFRESH_TOKEN_KEY = "gh-auth-bridge:refresh-token" as const;
export const EXPIRES_AT_KEY = "gh-auth-bridge:token-expires-at" as const;
export const REFRESH_EXPIRES_AT_KEY = "gh-auth-bridge:refresh-expires-at" as const;

// Zai-specific keys
export const HOLDINGS_KEY = "zai:holdings" as const;
export const FOREX_RATE_KEY = "zai:forex-rate" as const;
export const ASSETS_ISSUE_NUMBER_KEY = "zai:assets-issue-number" as const;
export const REPO_INITIALIZED_KEY = "zai:repo-initialized" as const;
