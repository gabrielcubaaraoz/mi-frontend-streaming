const router = require('express').Router();
const supabase = require('../config/supabase');

// Obtener todas las plataformas para los desplegables del frontend
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('platforms')
      .select('id, name, slug, color, icon_url')
      .order('name', { ascending: true });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
