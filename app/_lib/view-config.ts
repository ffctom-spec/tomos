import type {
  PortalNavigationItem,
  PortalView,
  PortalViewConfig,
} from "@/app/_lib/portal-types";

export const viewConfig: Record<PortalView, PortalViewConfig> = {
  command: { label: "Command Center", level: 1 },
  brief: { label: "Executive Brief", level: 2, parent: "command" },
  approvals: { label: "Approval Center", level: 2, parent: "command" },
  "approval-detail": { label: "Approval Item", level: 3, parent: "approvals" },
  "content-creation": { label: "Content Creation Flow", level: 3, parent: "approval-detail" },
  brands: { label: "Brand Portfolio", level: 2, parent: "command" },
  "brand-detail": { label: "Brand Detail", level: 3, parent: "brands" },
  broadcast: { label: "Broadcast Center", level: 2, parent: "command" },
  "broadcast-detail": { label: "Broadcast Detail", level: 3, parent: "broadcast" },
  "content-review": { label: "Content Review AI", level: 2, parent: "command" },
  "sns-health": { label: "SNS Health", level: 2, parent: "command" },
  commerce: { label: "Commerce", level: 2, parent: "command" },
  product: { label: "Product", level: 2, parent: "command" },
  knowledge: { label: "Knowledge Vault", level: 2, parent: "command" },
  "knowledge-detail": { label: "Knowledge Detail", level: 3, parent: "knowledge" },
  integrations: { label: "Integrations", level: 2, parent: "command" },
};

export const portalNavigationItems = [
  { label: viewConfig.command.label, view: "command" },
  { label: viewConfig.brief.label, view: "brief" },
  { label: viewConfig.approvals.label, view: "approvals" },
  { label: viewConfig.brands.label, view: "brands" },
  { label: viewConfig.broadcast.label, view: "broadcast" },
  { label: viewConfig["content-review"].label, view: "content-review" },
  { label: viewConfig["sns-health"].label, view: "sns-health" },
  { label: viewConfig.commerce.label, view: "commerce" },
  { label: viewConfig.product.label, view: "product" },
  { label: viewConfig.knowledge.label, view: "knowledge" },
  { label: viewConfig.integrations.label, view: "integrations" },
] satisfies PortalNavigationItem[];

export const portalQuickActions = [
  { label: "承認", view: "approvals" },
  { label: "配信", view: "broadcast" },
  { label: "SNS", view: "sns-health" },
  { label: "商品", view: "product" },
  { label: "連携", view: "integrations" },
] satisfies PortalNavigationItem[];

export function getParentView(view: PortalView) {
  return viewConfig[view].parent ?? "command";
}

export function isDetailView(view: PortalView) {
  return viewConfig[view].level === 3;
}
