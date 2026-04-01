import { githubFetch, throwIfNotOk } from "@koumatsumoto/gh-auth-bridge-client";
import { ASSETS_ISSUE_NUMBER_KEY } from "@/shared/lib/storage-keys";
import type { Holding } from "../types";
import { encodeHoldings, decodeHoldings } from "./body-codec";
import { repoPath } from "./repo-constants";

interface GitHubIssue {
  readonly number: number;
  readonly body: string | null;
  readonly pull_request?: unknown;
}

const ASSETS_LABELS = "portal,asset";
const ASSETS_TITLE = "portal:assets";

async function findAssetsIssueNumber(login: string): Promise<number | null> {
  const cached = localStorage.getItem(ASSETS_ISSUE_NUMBER_KEY);
  if (cached) {
    const num = Number(cached);
    if (Number.isFinite(num) && num > 0) return num;
  }

  const query = new URLSearchParams({
    labels: ASSETS_LABELS,
    state: "open",
    per_page: "1",
  });

  const response = await githubFetch(`${repoPath(login)}/issues?${query}`);
  await throwIfNotOk(response);

  const issues = (await response.json()) as unknown as readonly GitHubIssue[];
  const issue = issues.find((i) => !i.pull_request);
  if (!issue) return null;

  localStorage.setItem(ASSETS_ISSUE_NUMBER_KEY, String(issue.number));
  return issue.number;
}

export async function fetchHoldings(login: string): Promise<readonly Holding[]> {
  const issueNumber = await findAssetsIssueNumber(login);
  if (issueNumber === null) return [];

  const response = await githubFetch(`${repoPath(login)}/issues/${String(issueNumber)}`);
  await throwIfNotOk(response);

  const issue = (await response.json()) as unknown as GitHubIssue;
  return decodeHoldings(issue.body);
}

export async function saveHoldings(login: string, holdings: readonly Holding[]): Promise<void> {
  const issueNumber = await findAssetsIssueNumber(login);
  const body = encodeHoldings(holdings);

  if (issueNumber !== null) {
    const response = await githubFetch(`${repoPath(login)}/issues/${String(issueNumber)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    await throwIfNotOk(response);
  } else {
    const response = await githubFetch(`${repoPath(login)}/issues`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: ASSETS_TITLE,
        body,
        labels: ASSETS_LABELS.split(","),
      }),
    });
    await throwIfNotOk(response);

    const created = (await response.json()) as unknown as GitHubIssue;
    localStorage.setItem(ASSETS_ISSUE_NUMBER_KEY, String(created.number));
  }
}
