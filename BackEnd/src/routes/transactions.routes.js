import { Router } from "express";
import { supabaseAdmin } from "../supabase.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware);

// list with optional date filters
router.get("/", async (req, res) => {
  const user_id = req.user.id;
  const { from, to } = req.query;

  let q = supabaseAdmin
    .from("transactions")
    .select(`
      *,
      categories:category_id (id, name, nature, kind),
      cost_centers:cost_center_id (id, name),
      accounts:account_id (id, name, type),
      cards:card_id (id, name, limit_amount, closing_day, due_day)
    `)
    .eq("user_id", user_id)
    .order("date", { ascending: false });

  if (from) q = q.gte("date", from);
  if (to) q = q.lte("date", to);

  const { data, error } = await q;
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.post("/", async (req, res) => {
  const user_id = req.user.id;
  const payload = { ...req.body, user_id };

  const { data, error } = await supabaseAdmin
    .from("transactions")
    .insert(payload)
    .select("*")
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.put("/:id", async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params;

  const { data, error } = await supabaseAdmin
    .from("transactions")
    .update(req.body)
    .eq("id", id)
    .eq("user_id", user_id)
    .select("*")
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.delete("/:id", async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params;

  const { error } = await supabaseAdmin.from("transactions").delete().eq("id", id).eq("user_id", user_id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ ok: true });
});

export default router;