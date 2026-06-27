import type { IntegrationApiResponse } from "@/app/_lib/portal-types";

export const runtime = "nodejs";

const repository = process.env.GITHUB_REPOSITORY ?? "ffctom-spec/tomos";

const mockResponse: IntegrationApiResponse = {
  id: "github",
  name: "GitHub Issues",
  ok: true,
  mode: "mock",
  message: "GITHUB_TOKEN 未設定のためmock issuesを返しています。",
  checkedAt: new Date().toISOString(),
  metrics: {
    repository,
    openIssues: 4,
    priorityIssues: 2,
  },
  items: [
    { title: "Connect production auth", status: "planned", priority: "High" },
    { title: "Encrypt SNS tokens per user", status: "planned", priority: "High" },
    { title: "Add database-backed approvals", status: "planned", priority: "Medium" },
  ],
};

export async function GET() {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return Response.json(mockResponse);
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${repository}/issues`, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      return Response.json({
        ...mockResponse,
        ok: false,
        mode: "live",
        message: `GitHub Issues API connection failed: ${response.status}`,
        checkedAt: new Date().toISOString(),
      } satisfies IntegrationApiResponse);
    }

    const issues: Array<{
      title: string;
      state: string;
      labels?: Array<{ name: string }>;
      number: number;
    }> = await response.json();

    return Response.json({
      id: "github",
      name: "GitHub Issues",
      ok: true,
      mode: "live",
      message: `${repository} のIssueを取得しました。`,
      checkedAt: new Date().toISOString(),
      metrics: {
        repository,
        openIssues: issues.length,
      },
      items: issues.slice(0, 5).map((issue) => ({
        title: issue.title,
        status: issue.state,
        number: issue.number,
        labels: issue.labels?.map((label) => label.name).join(", ") ?? "",
      })),
    } satisfies IntegrationApiResponse);
  } catch (error) {
    return Response.json({
      ...mockResponse,
      ok: false,
      mode: "live",
      message: error instanceof Error ? error.message : "GitHub Issues API connection failed",
      checkedAt: new Date().toISOString(),
    } satisfies IntegrationApiResponse);
  }
}
