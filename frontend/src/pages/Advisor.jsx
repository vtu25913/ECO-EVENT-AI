import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '../components/common/Card.jsx'
import Button from '../components/common/Button.jsx'
import { useApp } from '../context/AppContext.jsx'
import { FiSend, FiTrash2, FiExternalLink, FiCpu, FiBarChart2 } from 'react-icons/fi'
import { getScoreLevel } from '../utils/sustainabilityEngine.js'
import { askAIAdvisor } from '../services/aiAdvisorService.js'

const suggestions = [
  "Suggest 20 sustainability recommendations for college events.",
  "How can event organizers reduce carbon emissions during large events?",
  "What are the environmental impacts of plastic bottle usage in public events?",
  "Create a sustainability scoring framework for evaluating events.",
  "Explain how sustainable event planning contributes to UN SDGs.",
  "How can I improve my energy efficiency?",
]

export default function Advisor() {
  const { analyses, currentResult } = useApp()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 **Welcome to AI Sustainability Advisor!**\n\nI'm your AI-powered sustainability assistant. I can help you:\n\n📊 **Analyze your event scores** — Ask about carbon, water, waste, or energy\n💡 **Get improvement tips** — \"How can I improve my score?\"\n🌍 **Learn about sustainability** — SDGs, carbon neutrality, waste reduction\n🏅 **Check certifications** — Platinum, Gold, Silver, Bronze tiers\n\nHow can I assist you today? 🌿`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMessage = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      // Build context from current analysis if available
      const context = currentResult ? {
        scores: currentResult.scores,
        formData: currentResult.formData,
        impact: currentResult.impact,
        certification: currentResult.certification,
        recommendations: currentResult.recommendations,
      } : null

      // Use the AI Advisor service (handles caching, hybrid routing, fallback)
      const response = await askAIAdvisor(userMessage, context)

      setMessages((prev) => [...prev, { role: 'assistant', content: response }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `🤖 **Connection Issue**\n\nI'm having trouble connecting. Please make sure the backend server is running.\n\n_Your messages are cached locally — try again once the server is back online._`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Chat area */}
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium">
                  <FiCpu className="w-4 h-4" />
                  AI Sustainability Intelligence
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-gradient-to-r from-eco-500/10 to-emerald-500/10 border border-eco-500/20 text-eco-600 dark:text-eco-400">
                  Hybrid AI
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  AI Advisor
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Chat with the AI-powered sustainability engine. Get real-time insights about your events.
              </p>
            </div>

            {/* Chat Card */}
            <Card className="h-[600px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[88%] rounded-2xl p-4 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-eco-500 to-emerald-600 text-white'
                        : 'bg-gray-100 dark:bg-white/[0.05] text-gray-900 dark:text-white border border-gray-200/50 dark:border-white/5'
                    }`}>
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200/30 dark:border-white/5">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                            B
                          </div>
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">AI Advisor</span>
                        </div>
                      )}
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: msg.content
                            .replace(/\n/g, '<br/>')
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[88%] rounded-2xl p-4 bg-gray-100 dark:bg-white/[0.05] border border-gray-200/50 dark:border-white/5">
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200/30 dark:border-white/5">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white animate-pulse">
                          B
                        </div>
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">AI Advisor</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-xs text-gray-500">Thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200 dark:border-white/5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask the AI Advisor about sustainability..."
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm disabled:opacity-50"
                  />
                  <Button onClick={handleSend} size="md" disabled={!input.trim() || loading}>
                    <FiSend className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={() => {
                      setMessages([
                        {
                          role: 'assistant',
                          content: `👋 **Welcome back to AI Sustainability Advisor!**\n\nI'm using **Hybrid AI** — simple questions answered locally, complex ones routed to expert mode. How can I help you today? 🌿`,
                        },
                      ])
                    }}
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Quick suggestions */}
            <div className="mt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.slice(0, 4).map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="px-3 py-2 text-xs rounded-xl bg-white/30 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:border-blue-500/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Analysis Context */}
          <Card gradient glow>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                B
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">AI Advisor</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">AI Sustainability Engine</p>
              </div>
            </div>

            {currentResult ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Currently analyzing <strong className="text-gray-900 dark:text-white">{currentResult.formData.eventName}</strong>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-center">
                    <div className="text-lg font-bold" style={{ color: getScoreLevel(currentResult.scores.overall).color }}>
                      {currentResult.scores.overall}
                    </div>
                    <div className="text-[10px] text-gray-500">Score</div>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 text-center">
                    <div className="text-lg font-bold text-purple-500 capitalize">
                      {currentResult.certification?.level || 'N/A'}
                    </div>
                    <div className="text-[10px] text-gray-500">Certification</div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Ask me about scores, improvements, or certifications!
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Analyze an event first for personalized insights. I can still answer general sustainability questions!
                </p>
                <Button to="/analyze" size="sm" className="w-full">
                  <FiBarChart2 className="w-4 h-4" />
                  Analyze Your Event
                </Button>
              </div>
            )}
          </Card>

          {/* Recent Analyses */}
          {analyses.length > 0 && (
            <Card>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">📋 Recent Analyses</h3>
              <div className="space-y-2 max-h-[250px] overflow-y-auto">
                {analyses.slice(0, 5).map((a) => (
                  <div
                    key={a.id}
                    className="w-full text-left p-3 rounded-xl bg-gray-100/50 dark:bg-white/[0.03] border border-transparent"
                  >
                    <div className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                      {a.formData?.eventName || 'Untitled'}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-gray-500">{a.formData?.organization}</span>
                      <span className="text-xs font-bold" style={{ color: getScoreLevel(a.scores.overall).color }}>
                        {a.scores.overall}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Capabilities */}
          <Card>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">🤖 Capabilities</h3>
            <ul className="space-y-2">
              {[
                'Analyze sustainability scores',
                'Suggest improvement strategies',
                'Explain environmental concepts',
                'Recommend SDG alignment',
                'Guide carbon reduction',
                'Provide certification info',
              ].map((cap) => (
                <li key={cap} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                  {cap}
                </li>
              ))}
            </ul>
          </Card>

          {/* AI Link */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-500/10 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Powered by advanced AI for sustainability intelligence
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

