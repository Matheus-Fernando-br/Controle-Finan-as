import { supabaseAdmin } from "../supabase.js";

export async function authMiddleware(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing Bearer token" });

    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user) return res.status(401).json({ error: "Invalid token" });

    req.user = data.user; // { id, email, ... }
    next();
  } catch (e) {
    return res.status(500).json({ error: "Auth middleware failure" });
  }
}