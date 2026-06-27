export function GET() {
  return Response.json({
    status: "ok",
    app: "TOMOS",
    version: "0.2-beta",
    mode: "api-ready-demo",
  });
}
