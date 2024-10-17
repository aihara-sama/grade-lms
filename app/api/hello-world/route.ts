export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  console.log({ searchParams });

  return Response.json({ status: "ok" });
}

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);

  console.log({ body: req.body, searchParams });

  return Response.json({ status: "ok" });
}
