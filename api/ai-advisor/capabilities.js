/**
 * GET /api/ai-advisor/capabilities
 */
export default function handler(req, res) {
  res.json({
    integration: 'AI Sustainability Advisor',
    version: '2.0.0',
    aiProvider: 'built-in',
    capabilities: [
      {
        name: 'Query Analyses',
        action: 'get_analyses',
        description: 'Retrieve sustainability analyses from the database',
        params: { userId: 'string (optional)', limit: 'number (optional)' },
      },
      {
        name: 'Get Global Stats',
        action: 'get_stats',
        description: 'Get aggregated sustainability statistics across all events',
        params: {},
      },
      {
        name: 'Get Leaderboard',
        action: 'get_leaderboard',
        description: 'Get the global sustainability leaderboard',
        params: { limit: 'number (optional)' },
      },
      {
        name: 'Generate Report',
        action: 'generate_report',
        description: 'Generate a sustainability report for a specific analysis',
        params: { analysisId: 'string (required)' },
      },
      {
        name: 'Analyze Sustainability',
        action: 'analyze_sustainability',
        description: 'Analyze event data and return sustainability scores',
        params: { formData: 'object (required)' },
      },
    ],
    docsUrl: 'https://ecoevent-ai.vercel.app',
  })
}
