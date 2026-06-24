import { Router } from 'express';
import { supabaseAdmin } from '../index.js';

const router = Router();

// Get global leaderboard — uses the public `leaderboard` view which is GRANT'd to anon
router.get('/', async (_req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(50);

    if (error) throw error;

    // The leaderboard view returns rows with: id, event_name, organization,
    // score (already extracted), certification_level, rank, created_at
    const board = (data || []).map((item) => ({
      id: item.id,
      eventName: item.event_name || '',
      organization: item.organization || '',
      score: parseInt(item.score) || 0,
      certification: item.certification_level || 'bronze',
      date: item.created_at,
      rank: item.rank,
    }));

    res.json(board);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get global stats — computed from the public `leaderboard` view
router.get('/stats', async (_req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('leaderboard')
      .select('score');

    if (error) throw error;

    const scores = (data || []).map(r => parseInt(r.score) || 0);
    const total = scores.length;
    const avgScore = total > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / total) : 0;

    // Approximate carbon saved from the score (each point ≈ some carbon savings)
    const carbonSaved = Math.round(total * 2.5 * 10) / 10;

    res.json({
      totalAnalyses: total,
      avgScore,
      carbonSaved,
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
