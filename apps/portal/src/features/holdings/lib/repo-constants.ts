export const REPO_NAME = "zai-datastore";

export function repoPath(login: string): string {
  return `/repos/${login}/${REPO_NAME}`;
}
