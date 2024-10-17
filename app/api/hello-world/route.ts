export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  return Response.json({ searchParams, status: "ok" });
}

export async function POST(req: Request) {
  const data = req.body;

  return Response.json({ ...data, status: "ok" });
}
