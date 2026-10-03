import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';
import { 
  Send, 
  Sparkles, 
  HelpCircle, 
  RotateCcw, 
  BookOpen, 
  User, 
  Bot, 
  GraduationCap,
  Lightbulb,
  CornerDownRight
} from 'lucide-react';

export const TanyaFisikaChat: React.FC = () => {
  const { currentUser } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Assalamu'alaikum & Halo ${currentUser.nama}! 🌟\n\nSaya **Bu Nurhidayati**, Guru Fisika SMA Negeri 1 Mantang. Saya siap membimbingmu memahami konsep-konsep fisika, rumus, maupun soal-soal latihan.\n\n💡 *Prinsip belajar kita:* Jika kamu menanyakan soal, Bu guru akan memberikan **petunjuk terarah (clue)** dan **pertanyaan pemandu** terlebih dahulu agar kamu benar-benar paham logikanya. Jika kamu sudah mencoba atau ingin pembahasan penuh, cukup katakan ya!\n\nAda konsep atau soal fisika apa yang sedang ingin kamu diskusikan hari ini?`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.role,
            content: m.content,
          })),
          currentTopic: 'Fluida Statis SMA Kelas XI SMAN 1 Mantang',
        }),
      });

      const data = await response.json();
      const botReply: ChatMessage = {
        id: `reply_${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Maaf Nak, terjadi kendala teknis saat memproses jawaban. Silakan tanyakan kembali ya!',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botReply]);
    } catch (err) {
      console.error('Error fetching chat response:', err);
      const fallbackReply: ChatMessage = {
        id: `reply_${Date.now()}`,
        role: 'assistant',
        content: `Halo Nak! Pertanyaan yang bagus sekali. Mari kita mulai dengan mengidentifikasi apa yang diketahui dari persoalan tersebut: besaran massa jenis (ρ), kedalaman (h), atau percepatan gravitasi (g)? Coba sebutkan angkanya, nanti Bu guru bantu pandu langkah demi langkah!`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'Bagaimana rumus tekanan hidrostatis dan contoh penerapannya?',
    'Mengapa kapal baja yang sangat berat bisa mengapung di laut?',
    'Bantu saya memahami Hukum Pascal pada dongkrak hidrolik motor di Mantang.',
    'Apa perbedaan mendasar antara massa jenis dan berat jenis zat?',
    'Bagaimana langkah mencari persentase volume benda yang tercelup air?',
  ];

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome_reset',
        role: 'assistant',
        content: `Percakapan telah direset. Silakan tanyakan konsep atau soal fisika lainnya yang ingin kamu diskusikan!`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Asisten Pembelajaran Sokratik</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tanya Fisika AI
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Bimbingan belajar interaktif bersama Bu Nurhidayati (Guru Fisika SMAN 1 Mantang)
          </p>
        </div>

        <button
          onClick={handleResetChat}
          className="self-start sm:self-auto px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Mulai Sesi Baru</span>
        </button>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Pertanyaan Cepat Rekomendasi:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/60 hover:text-sky-600 dark:hover:text-sky-400 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 transition-colors text-left cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation Box */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col h-[520px]">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((msg) => {
            const isBot = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-blue-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isBot
                      ? 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                      : 'bg-sky-600 text-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1.5 opacity-70 text-[10px]">
                    <span className="font-semibold">
                      {isBot ? 'Bu Nurhidayati (Guru Fisika)' : currentUser.nama}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Render content with clean paragraph linebreaks */}
                  <div className="space-y-2 whitespace-pre-line font-sans">
                    {msg.content}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-2 text-slate-500">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                <span>Bu Guru sedang menyusun petunjuk belajar untukmu...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 rounded-b-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Tanyakan soal, rumus, atau konsep fisika yang belum kamu pahami..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <span>Kirim</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span>Metode Bimbingan Sokratik · Pendekatan Berpikir Mandiri</span>
            <span>SMAN 1 Mantang</span>
          </div>
        </div>

      </div>

    </div>
  );
};
