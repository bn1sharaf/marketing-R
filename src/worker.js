// API صغير فوق D1: GET/PUT/DELETE على /api/col/<collection>[/<id>]
// الحماية تتم عبر Cloudflare Access (انظر README).
export default {
  async fetch(req, env) {
    const m = new URL(req.url).pathname.match(/^\/api\/col\/([\w.~:@+-]{1,60})(?:\/([^/]{1,200}))?$/);
    const j = (d, s = 200) => Response.json(d, { status: s });
    if (!m) return j({ error: 'not found' }, 404);
    const col = m[1], id = m[2] && decodeURIComponent(m[2]);
    try {
      if (req.method === 'GET' && !id) {
        const { results } = await env.DB.prepare('SELECT id,data FROM docs WHERE col=?').bind(col).all();
        return j(results.map(r => ({ id: r.id, data: JSON.parse(r.data) })));
      }
      if (req.method === 'PUT' && id) {
        const d = await req.text();
        if (d.length > 262144) return j({ error: 'too large' }, 413);
        JSON.parse(d);
        await env.DB.prepare('INSERT INTO docs(col,id,data,updated) VALUES(?,?,?,?) ON CONFLICT(col,id) DO UPDATE SET data=excluded.data,updated=excluded.updated')
          .bind(col, id, d, Date.now()).run();
        return j({ ok: 1 });
      }
      if (req.method === 'DELETE' && id) {
        await env.DB.prepare('DELETE FROM docs WHERE col=? AND id=?').bind(col, id).run();
        return j({ ok: 1 });
      }
    } catch (e) { return j({ error: 'bad request' }, 400); }
    return j({ error: 'method not allowed' }, 405);
  }
};
