import { Router } from "express";
import { supabaseAdmin } from "../supabase.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware);

// GET all configs
router.get("/", async (req, res) => {
  const user_id = req.user.id;

  const [cats, centers, accounts, cards] = await Promise.all([
    supabaseAdmin.from("categories").select("*").eq("user_id", user_id).order("created_at", { ascending: false }),
    supabaseAdmin.from("cost_centers").select("*").eq("user_id", user_id).order("created_at", { ascending: false }),
    supabaseAdmin.from("accounts").select("*").eq("user_id", user_id).order("created_at", { ascending: false }),
    supabaseAdmin.from("cards").select("*").eq("user_id", user_id).order("created_at", { ascending: false })
  ]);

  const anyError = cats.error || centers.error || accounts.error || cards.error;
  if (anyError) return res.status(400).json({ error: anyError.message });

  res.json({
    categories: cats.data,
    cost_centers: centers.data,
    accounts: accounts.data,
    cards: cards.data
  });
});

// CRUD helpers factory-ish
function crud(table) {
  return {
    list: async (req, res) => {
      const { data, error } = await supabaseAdmin.from(table).select("*").eq("user_id", req.user.id).order("created_at", { ascending: false });
      if (error) return res.status(400).json({ error: error.message });
      res.json(data);
    },
    create: async (req, res) => {
      const payload = { ...req.body, user_id: req.user.id };
      const { data, error } = await supabaseAdmin.from(table).insert(payload).select("*").single();
      if (error) return res.status(400).json({ error: error.message });
      res.status(201).json(data);
    },
    update: async (req, res) => {
      const { id } = req.params;
      const { data, error } = await supabaseAdmin.from(table)
        .update(req.body)
        .eq("id", id)
        .eq("user_id", req.user.id)
        .select("*")
        .single();
      if (error) return res.status(400).json({ error: error.message });
      res.json(data);
    },
    remove: async (req, res) => {
      const { id } = req.params;
      const { error } = await supabaseAdmin.from(table).delete().eq("id", id).eq("user_id", req.user.id);
      if (error) return res.status(400).json({ error: error.message });
      res.json({ ok: true });
    }
  };
}

const categories = crud("categories");
const centers = crud("cost_centers");
const accounts = crud("accounts");
const cards = crud("cards");

router.get("/categories", categories.list);
router.post("/categories", categories.create);
router.put("/categories/:id", categories.update);
router.delete("/categories/:id", categories.remove);

router.get("/cost-centers", centers.list);
router.post("/cost-centers", centers.create);
router.put("/cost-centers/:id", centers.update);
router.delete("/cost-centers/:id", centers.remove);

router.get("/accounts", accounts.list);
router.post("/accounts", accounts.create);
router.put("/accounts/:id", accounts.update);
router.delete("/accounts/:id", accounts.remove);

router.get("/cards", cards.list);
router.post("/cards", cards.create);
router.put("/cards/:id", cards.update);
router.delete("/cards/:id", cards.remove);

export default router;