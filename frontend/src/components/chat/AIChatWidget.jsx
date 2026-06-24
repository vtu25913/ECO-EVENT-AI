import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiSend } from 'react-icons/fi'
import { useApp } from '../../context/AppContext.jsx'
import { sendChatMessage } from '../../services/apiService.js'

const quickQuestions = [
  '20 sustainability tips for college events',
  'How to reduce carbon at large events?',
  'Environmental impact of plastic bottles?',
  'Explain the event scoring framework',
  'How does event planning help UN SDGs?',
]

export default function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "👋 Hi! I'm the AI Sustainability Advisor. Ask me anything about green events!" },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const lastAnalyzedId = useRef(null)
  const { currentResult } = useApp()

  // ─── Auto-open and analyze when a new result appears ─────────────────────
  useEffect(() => {
    if (!currentResult) return
    const id = currentResult.id || currentResult.formData?.eventName
    if (!id || lastAnalyzedId.current === id) return
    lastAnalyzedId.current = id

    setOpen(true)
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: `Give me AI recommendations for my event "${currentResult.formData.eventName}"` },
    ])
    setLoading(true)

    const context = {
      scores: currentResult.scores,
      formData: currentResult.formData,
      impact: currentResult.impact,
      certification: currentResult.certification,
      recommendations: currentResult.recommendations,
    }

    sendChatMessage(
      `Analyze my event "${currentResult.formData.eventName}" and give me personalized sustainability recommendations based on the scores.`,
      context
    )
      .then((data) => {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.response }])
      })
      .catch(() => {
        // Graceful offline fallback
        const recs = currentResult.recommendations || []
        const fallback = [
          `🌿 **Sustainability Analysis for ${currentResult.formData.eventName}**\n\n`,
          recs.length > 0
            ? recs.slice(0, 4).map((r, i) => `${i + 1}. **${r.title}** — +${r.improvement || 'N/A'}% improvement`).join('\n\n')
            : 'Great job! Your event is already highly sustainable! 🎉',
          `\n\n**Overall Score:** ${currentResult.scores.overall}/100`,
          `\n**Certification:** ${currentResult.certification?.levelName || currentResult.certification?.level || 'N/A'}`,
          `\n\n                      💡 Open the **AI Advisor** page for detailed insights!`,
        ].join('')
        setMessages((prev) => [...prev, { role: 'assistant', content: fallback }])
      })
      .finally(() => setLoading(false))
  }, [currentResult])

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const msg = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: msg }])
    setLoading(true)

    const context = currentResult ? {
      scores: currentResult.scores,
      formData: currentResult.formData,
      impact: currentResult.impact,
      certification: currentResult.certification,
      recommendations: currentResult.recommendations,
    } : null

    try {
      const data = await sendChatMessage(msg, context)
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "I'm having trouble connecting to the backend. Make sure the server is running on port 3001." },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <>
      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center justify-center overflow-hidden transition-shadow ring-2 ring-white/80 dark:ring-emerald-400/60"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {open ? (
          <div className="w-full h-full bg-gradient-to-br from-eco-600 to-emerald-700 flex items-center justify-center">
            <FiX className="w-6 h-6 text-white" />
          </div>
        ) : (
          <img
            src="https://static.vecteezy.com/system/resources/previews/026/769/521/non_2x/illustration-image-nature-and-sustainability-eco-friendly-living-and-conservation-concept-art-of-earth-and-animal-life-in-different-environments-generative-ai-illustration-free-photo.jpg"
            alt="AI Advisor"
            className="w-full h-full object-cover"
          />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[500px] max-h-[70vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="shrink-0 bg-gradient-to-r from-blue-600 to-purple-700 p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl overflow-hidden">
                <img
                  src="https://static.vecteezy.com/system/resources/previews/026/769/521/non_2x/illustration-image-nature-and-sustainability-eco-friendly-living-and-conservation-concept-art-of-earth-and-animal-life-in-different-environments-generative-ai-illustration-free-photo.jpg"
                  alt="BOB"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white">AI Advisor</div>
                <div className="text-[10px] text-blue-200">Sustainability AI • Connected</div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all">
                <FiX className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl px-3 py-2 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-eco-500 to-emerald-600 text-white text-sm'
                      : 'bg-gray-100 dark:bg-white/[0.05] text-gray-900 dark:text-white border border-gray-200/50 dark:border-white/5 text-xs leading-relaxed'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <div
                        className="prose prose-xs dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: msg.content
                            .replace(/\n/g, '<br/>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                        }}
                      />
                    ) : (
                      <p className="text-sm">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-xl px-3 py-2 bg-gray-100 dark:bg-white/[0.05] border border-gray-200/50 dark:border-white/5">
                    <div className="flex gap-1">
                      {[0, 150, 300].map((d) => (
                        <span key={d} className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick questions */}
            <div className="shrink-0 px-3 pb-2 flex flex-wrap gap-1.5">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="text-[10px] px-2 py-1 rounded-lg bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:border-blue-500/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="shrink-0 p-3 border-t border-gray-200 dark:border-white/5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about sustainability..."
                  disabled={loading}
                  className="flex-1 px-3 py-2 bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-700 text-white disabled:opacity-40 transition-opacity"
                >
                  <FiSend className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
