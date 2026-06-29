import { notFound } from "next/navigation";
import { ProjectDetailClient } from "@/app/_components/dx/project-detail-client";
import { getProjectById, projects } from "@/src/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ id: project.id }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) notFound();

  return <ProjectDetailClient project={project} />;
}
