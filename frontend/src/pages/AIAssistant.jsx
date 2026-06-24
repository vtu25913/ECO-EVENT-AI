import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../components/common/Card.jsx'
import Button from '../components/common/Button.jsx'
import { FiSend, FiTrash2, FiExternalLink, FiCode, FiZap } from 'react-icons/fi'

const suggestions = [
  "How can I reduce waste at my event?",
  "How can I make my event carbon neutral?",
  "How can colleges organize greener events?",
  "Suggest alternatives to plastic bottles",
  "What are the best sustainable energy options?",
  "How to engage attendees in sustainability?",
]

const botResponses = {
  "how can i reduce waste": "Here are effective waste reduction strategies:\n\n♻️ **Digital Transformation**\n- Replace paper registration with QR code check-ins\n- Use digital certificates instead of printed ones\n- Send digital invitations and programs\n\n🚮 **Waste Management**\n- Set up clearly labeled segregation stations (recyclables, compost, landfill)\n- Partner with local recycling facilities\n- Compost food waste from catering\n\n🥤 **Single-Use Alternatives**\n- Replace plastic water bottles with refill stations\n- Use reusable or biodegradable serving materials\n- Provide reusable tote bags instead of plastic swag bags\n\n🌱 **Source Reduction**\n- Order food quantities based on RSVP counts\n- Choose venues with existing sustainability practices\n- Use digital signage instead of printed banners",
  "carbon neutral": "To achieve carbon neutrality for your event:\n\n📊 **1. Measure Your Footprint**\nUse our Carbon Impact Simulator to calculate emissions from energy, transport, waste, and materials.\n\n🔋 **2. Reduce Energy Consumption**\n- Use LED lighting and energy-efficient equipment\n- Choose venues with renewable energy\n- Optimize HVAC schedules\n\n🚗 **3. Sustainable Transportation**\n- Encourage carpooling with incentives\n- Provide public transit passes\n- Choose central, accessible locations\n\n🌳 **4. Offset Remaining Emissions**\n- Partner with verified carbon offset programs\n- Plant trees (each absorbs ~22kg CO₂/year)\n- Invest in renewable energy projects\n\n🎯 **Target: Net Zero**\nAim for a sustainability score of 75+ for Gold certification.",
  "colleges organize greener": "Colleges can implement these green event strategies:\n\n🎓 **Campus-Wide Initiatives**\n- Create a Green Events Policy for all student organizations\n- Establish an Eco-Rep program in each department\n- Offer sustainability certification for events\n\n📋 **Practical Steps**\n- Use existing campus digital platforms for promotion\n- Partner with campus dining for compostable servingware\n- Utilize campus shuttle services for transportation\n\n🏆 **Gamification**\n- Create inter-department sustainability competitions\n- Award 'Greenest Event' recognition monthly\n- Display real-time sustainability dashboards\n\n🔬 **Educational Integration**\n- Include sustainability metrics in event proposals\n- Have environmental science students conduct impact assessments\n- Showcase SDG contributions in event reports",
  "alternatives to plastic bottles": "Excellent eco-friendly alternatives:\n\n🚰 **Water Refill Stations**\n- Install portable water dispensers at key locations\n- Provide branded reusable bottles as welcome kits\n- Saves thousands of plastic bottles per event\n\n🫗 **Bulk Dispensers**\n- Use large dispensers for beverages instead of individual bottles\n- Offer infused water stations (cucumber, mint, lemon)\n- Reduces packaging waste by 90%\n\n♻️ **Compostable Alternatives**\n- Plant-based bottles (PLA) for necessary single-use\n- Boxed water (more sustainable than plastic)\n- Aluminum bottles (infinitely recyclable)\n\n💡 **Pro Tip**\nSwitching from plastic bottles alone can improve your Water Score by 15-20 points!",
  "sustainable energy options": "Top sustainable energy solutions for events:\n\n☀️ **Solar Power**\n- Portable solar generators for outdoor events\n- Solar-powered charging stations for attendees\n- Solar lighting for evening events\n\n💨 **Wind Power**\n- Small wind turbines for multi-day events\n- Hybrid wind-solar systems for reliability\n\n🔋 **Energy Storage**\n- Battery banks charged from renewable sources\n- Power management systems to optimize usage\n\n💡 **Efficiency Measures**\n- LED lighting throughout (90% less energy)\n- Smart thermostats and motion sensors\n- Energy-efficient appliances and equipment\n\nSelecting 'Solar Power Usage' in our analyzer gives your Energy Score a +30 boost!",
  "engage attendees in sustainability": "Creative ways to engage attendees:\n\n🎮 **Gamification**\n- Create a sustainability scavenger hunt\n- Award points for eco-friendly actions\n- Live leaderboard showing collective impact\n\n📱 **Digital Engagement**\n- Event app with sustainability tips\n- QR codes linking to impact information\n- Social media challenges with green hashtags\n\n🏪 **Interactive Stations**\n- Recycling sorting game with prizes\n- Carbon footprint calculator booth\n- Virtual reality eco-experience\n\n🌿 **Green Commitments**\n- Pledge wall for sustainability promises\n- Carbon offset donations at registration\n- Plant-a-tree for each attendee\n\nEngaged attendees are 3x more likely to adopt sustainable practices!",
}

function getBotResponse(message) {
  const lower = message.toLowerCase()
  for (const [key, response] of Object.entries(botResponses)) {
    if (lower.includes(key)) return response
  }
  return `Great question! Here are some sustainability strategies for your event:\n\n🌿 **General Best Practices**\n1. Conduct a sustainability assessment using our Event Analyzer\n2. Implement digital solutions to reduce paper waste\n3. Choose reusable or biodegradable materials\n4. Encourage public transportation and carpooling\n5. Select venues with green certifications\n6. Partner with local环保 organizations\n7. Measure and offset carbon emissions\n8. Educate attendees about sustainability\n\n📊 Would you like me to elaborate on any specific area? You can also try our Event Analyzer for personalized recommendations!`
}

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m **EcoAI**, your sustainability assistant. I can help you plan greener events, explain sustainability concepts, and recommend strategies. What would you like to know? 🌿' },
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    const userMessage = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])

    setTimeout(() => {
      const response = getBotResponse(userMessage)
      setMessages((prev) => [...prev, { role: 'assistant', content: response }])
    }, 1000 + Math.random() * 1000)
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
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                EcoAI{' '}
                <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  Assistant
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Your AI sustainability expert. Ask anything about green event planning.
              </p>
            </div>

            <Card className="h-[600px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl p-4 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-eco-500 to-emerald-600 text-white'
                        : 'bg-gray-100 dark:bg-white/[0.05] text-gray-900 dark:text-white border border-gray-200/50 dark:border-white/5'
                    }`}>
                      <div className="prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                      />
                    </div>
                  </motion.div>
                ))}
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
                    placeholder="Ask EcoAI about sustainability..."
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-eco-500/50 text-sm"
                  />
                  <Button onClick={handleSend} size="md" disabled={!input.trim()}>
                    <FiSend className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="md" onClick={() => setMessages([{ role: 'assistant', content: 'Hello! I\'m **EcoAI**, your sustainability assistant. How can I help you today? 🌿' }])}>
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
                    onClick={() => {
                      setInput(s)
                    }}
                    className="px-3 py-2 text-xs rounded-xl bg-white/30 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:border-eco-500/30 hover:text-eco-600 dark:hover:text-eco-400 transition-all"
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
          {/* AI Capabilities Section */}
          <Card gradient glow>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                AI
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">AI Integration</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Sustainability Intelligence</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              EcoEvent AI uses AI-powered intelligence to deliver accurate sustainability insights, 
              recommendations, and scoring for all your events.
            </p>
            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <FiCode className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Custom Sustainability Rules</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Create custom sustainability scoring rules specific to your organization's needs using AI-driven logic.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-500/5 border border-purple-500/10">
                <FiZap className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Automated Report Generation</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Automate sustainability report generation, data analysis, and insights extraction across multiple events.</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Capabilities */}
          <Card>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">🤖 Capabilities</h3>
            <ul className="space-y-2">
              {[
                'Suggest greener event plans',
                'Explain sustainability concepts',
                'Answer environmental questions',
                'Recommend SDG strategies',
                'Suggest carbon reduction methods',
                'Provide certification guidance',
              ].map((cap) => (
                <li key={cap} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-eco-500" />
                  {cap}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
