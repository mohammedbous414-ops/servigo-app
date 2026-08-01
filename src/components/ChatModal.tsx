import React, { useState } from 'react';
import { Send, X, MessageSquare, PhoneCall, ShieldCheck } from 'lucide-react';
import { ChatMessage, Language, UserRole } from '../types';
import { t } from '../i18n/translations';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  currentRole: UserRole;
  counterpartName: string;
  counterpartPhone: string;
  counterpartPhoto?: string;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  lang,
  currentRole,
  counterpartName,
  counterpartPhone,
  counterpartPhoto,
  messages,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickReply = (quickText: string) => {
    onSendMessage(quickText);
  };

  const quickReplies = [
    t(lang, 'quickMessage1'),
    t(lang, 'quickMessage2'),
    t(lang, 'quickMessage3'),
  ];

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col h-[580px] max-h-[90vh]">
        
        {/* Chat Header */}
        <div className="bg-slate-800/90 p-4 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={counterpartPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                alt={counterpartName}
                className="w-11 h-11 rounded-full object-cover border-2 border-indigo-500 shadow"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-cyan-400 rounded-full border-2 border-slate-900"></span>
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base leading-tight flex items-center gap-1.5">
                {counterpartName}
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <span>{counterpartPhone}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${counterpartPhone}`}
              className="p-2.5 rounded-full bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30 transition-colors"
              title={t(lang, 'callDriver')}
            >
              <PhoneCall className="w-5 h-5" />
            </a>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <MessageSquare className="w-12 h-12 text-slate-700 mb-2 animate-bounce" />
              <p className="text-sm">{t(lang, 'chatWithDriver')}</p>
              <p className="text-xs text-slate-600 mt-1">تواصل مباشر وسريع وآمن لحساب الخدمة</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderRole === currentRole;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm font-medium shadow-sm ${
                      isMe
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-slate-800 text-slate-100 border border-slate-700/80 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2 bg-slate-900 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickReplies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickReply(reply)}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 border border-slate-700 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t(lang, 'typeMessage')}
            className="flex-1 bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white p-2.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center"
          >
            <Send className="w-5 h-5 rtl:rotate-180" />
          </button>
        </form>

      </div>
    </div>
  );
};
