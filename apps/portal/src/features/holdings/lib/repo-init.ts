import { RepoNotConfiguredError } from "@/shared/lib/errors";
import { GitHubApiError, githubFetch } from "@koumatsumoto/gh-auth-bridge-client";
import { REPO_INITIALIZED_KEY } from "@/shared/lib/storage-keys";
import { repoPath } from "./repo-constants";

export async function ensureRepository(login: string): Promise<void> {
  if (localStorage.getItem(REPO_INITIALIZED_KEY) === "true") {
    return;
  }

  const checkRes = await githubFetch(repoPath(login));
  if (checkRes.ok) {
    localStorage.setItem(REPO_INITIALIZED_KEY, "true");
    return;
  }

  if (checkRes.status !== 404) {
    throw new GitHubApiError(checkRes.status, (await checkRes.json()) as unknown);
  }

  throw new RepoNotConfiguredError();
}
