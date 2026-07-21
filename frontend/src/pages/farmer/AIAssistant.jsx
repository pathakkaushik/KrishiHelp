import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, Mic, RefreshCw, Trash2, Sprout, Loader2 } from 'lucide-react'
import { aiService } from '../../services/index.jsx'
import { PageHeader, LoadingDots } from '../../components/common/UIComponents.jsx'
import toast from 'react-hot-toast'

const SUGGESTED = [
  'मेरे गेहूं की पत्तियां पीली हो रही हैं। क्या करूं?',
  'खरीफ फसल के लिए सबसे अच्छी खाद कौन सी है?',
  'PM Kisan Samman Nidhi के लिए कैसे apply करें?',
  'मिट्टी की जांच कहां करवाएं?',
  'टमाटर में लगने वाले कीटों से कैसे बचें?',
  'सोलर पंप सब्सिडी के बारे में बताएं',
]

const SYSTEM_CONTEXT = `You are KrishiMitra AI, an expert agricultural assistant for Indian farmers. 
You help with:
- Crop diseases, pests, and treatments
- Fertilizer and irrigation recommendations
- Government schemes (PM Kisan, KCC, crop insurance, etc.)
- Mandi prices and market intelligence
- Weather-based farming advice
- Loan guidance and financial planning
- General farming best practices

Respond in a friendly, clear manner. Support both Hindi and English. 
When diagnosing crop problems, always ask about:
1. Crop type and age
2. Symptoms observed
3. Geographic location and season
4. Recent weather/irrigation conditions

Provide practical, actionable advice. Mention nearby support (KVK, agriculture department) when relevant.`

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'नमस्ते! मैं आपका KrishiMitra AI हूं। 🌾\n\nमैं आपकी खेती से जुड़ी हर समस्या में मदद कर सकता हूं — फसल रोग, खाद, सिंचाई, सरकारी योजनाएं, या कुछ भी!\n\nआप हिंदी या English में पूछ सकते हैं।',
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [useRealAI, setUseRealAI] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg) return

    setInput('')
    const userMsg = { id: Date.now(), role: 'user', content: msg, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)

    try {
      let responseText = ''

      if (useRealAI) {
        const history = messages.slice(-10).map(m => ({
          role: m.role,
          content: m.content,
        }))
        const response = await aiService.chat(msg, history)
        responseText = response.message || response.content
      } else {
        // Anthropic API powered response
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-6',
            max_tokens: 1000,
            system: SYSTEM_CONTEXT,
            messages: [
              ...messages.slice(-8).map(m => ({ role: m.role, content: m.content })),
              { role: 'user', content: msg }
            ]
          })
        })
        const data = await response.json()
        responseText = data.content?.[0]?.text || 'माफ़ करें, मुझे अभी जवाब देने में समस्या हो रही है।'
      }

      const botMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, botMsg])
    } catch (error) {
      const errorMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'माफ़ करें, अभी जवाब देने में समस्या है। कृपया थोड़ी देर बाद फिर से कोशिश करें।',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }

  const clearChat = () => {
    setMessages([{
      id: 'welcome-new',
      role: 'assistant',
      content: 'नमस्ते! नई बातचीत शुरू हो गई है। मैं आपकी कैसे मदद कर सकता हूं? 🌾',
      timestamp: new Date(),
    }])
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <PageHeader
        title="AI Farm Assistant"
        subtitle="Ask anything about farming, schemes, or crop health"
        breadcrumbs={['Home', 'AI Assistant']}
        action={
          <div className="flex gap-2">
            <button onClick={clearChat} className="btn-ghost flex items-center gap-1.5 text-sm">
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        }
      />

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col glass-card overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-slate-700/50">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-glow-primary">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">KrishiMitra AI</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                <span className="text-xs text-primary">Online — Ready to help</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Sprout className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div className={msg.role === 'user' ? 'ai-bubble-user' : 'ai-bubble-bot'}>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                    <p className="text-xs opacity-50 mt-1.5">
                      {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <Sprout className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="ai-bubble-bot py-4 px-5">
                    <LoadingDots />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="अपना सवाल यहाँ लिखें... (Type your question here)"
                rows={2}
                className="input-field resize-none flex-1 text-sm"
              />
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isTyping}
                  className="btn-primary p-3 disabled:opacity-50"
                >
                  {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
                <button className="btn-secondary p-3" title="Voice input">
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-2">Press Enter to send • Shift+Enter for new line</p>
          </div>
        </div>

        {/* Suggested Questions - Desktop only */}
        <div className="hidden xl:flex w-64 flex-col gap-4">
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" />
              Try asking...
            </h3>
            <div className="space-y-2">
              {SUGGESTED.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="w-full text-left text-xs text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 rounded-lg p-2.5 transition-colors leading-relaxed"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-2">Topics I can help with</h3>
            <div className="flex flex-wrap gap-1.5">
              {['Crop Disease', 'Fertilizer', 'Irrigation', 'Mandi Prices', 'Schemes', 'Loans', 'Weather', 'Soil'].map(t => (
                <span key={t} className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
