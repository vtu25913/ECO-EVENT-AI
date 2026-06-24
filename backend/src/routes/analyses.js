import { Router } from 'express'
import { authenticateRequest } from '../middleware/auth.js'

const router = Router()

// Get all analyses for the authenticated user
router.get('/', authenticateRequest, async (req, res) => {
  try {
    const { data, error } = await req.supabaseClient
      .from('analyses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json(data || [])
  } catch (err) {
    console.error('Error fetching analyses:', err)
    res.status(500).json({ error: 'Failed to fetch analyses' })
  }
})

// Get single analysis
router.get('/:id', authenticateRequest, async (req, res) => {
  try {
    const { data, error } = await req.supabaseClient
      .from('analyses')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Analysis not found' })
    res.json(data)
  } catch (err) {
    console.error('Error fetching analysis:', err)
    res.status(500).json({ error: 'Failed to fetch analysis' })
  }
})

// Create a new analysis
router.post('/', authenticateRequest, async (req, res) => {
  try {
    const analysis = req.body
    const { data, error } = await req.supabaseClient
      .from('analyses')
      .insert({
        user_id: req.user.id,
        event_name: analysis.eventName || '',
        organization: analysis.organization || '',
        location: analysis.location || '',
        event_date: analysis.date || '',
        participants: parseInt(analysis.participants) || 0,
        duration: parseFloat(analysis.duration) || 1,
        category: analysis.category || '',
        form_data: analysis.formData || {},
        scores: analysis.scores || {},
        impact: analysis.impact || {},
        recommendations: analysis.recommendations || [],
        sdg_impact: analysis.sdgImpact || {},
        certification: analysis.certification || {},
      })
      .select()
      .single()

    if (error) throw error
    res.status(201).json(data)
  } catch (err) {
    console.error('Error creating analysis:', err)
    res.status(500).json({ error: 'Failed to create analysis' })
  }
})

// Delete an analysis
router.delete('/:id', authenticateRequest, async (req, res) => {
  try {
    const { error } = await req.supabaseClient
      .from('analyses')
      .delete()
      .eq('id', req.params.id)

    if (error) throw error
    res.json({ success: true })
  } catch (err) {
    console.error('Error deleting analysis:', err)
    res.status(500).json({ error: 'Failed to delete analysis' })
  }
})

export default router
