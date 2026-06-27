export function GET() {
  return Response.json({
    status: "ok",
    app: "TOMOS",
    version: "0.1-beta",
    mode: "api-ready-demo",
  });
}
