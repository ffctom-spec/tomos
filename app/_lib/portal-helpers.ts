import type { ActivityTimelineItem } from "@/app/_lib/portal-types";

export function createTimelineLog(
  title: string,
  detail: string,
  engine = "TOMOS",
): ActivityTimelineItem {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes(),
  ).padStart(2, "0")}`;

  return {
    id: `local-${now.getTime()}`,
    time,
    title,
    detail,
    engine,
  };
}
