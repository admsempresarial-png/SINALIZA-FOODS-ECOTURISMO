import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useLead } from './LeadContext';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

const ChatWidget: React.FC = () => {
  const { siteConfig, companies } = useLead();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Olá! 🍅 Sou o assistente virtual do Sinaliza Foods. Posso te ajudar a encontrar restaurantes, trilhas, praias ou descontos. O que você procura hoje?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const whatsappLink = `https://wa.me/55${siteConfig.footer.whatsapp.replace(/\D/g, '')}`;

  // Initialize Gemini Chat with Dynamic Context
  useEffect(() => {
    const initChat = async () => {
      try {
        // Prepare dynamic data for the AI context
        const partnersList = companies.length > 0 
            ? companies.map(c => `- ${c.name} (Oferta: ${c.productName}, ${c.offerType === 'fixed_price' ? c.vipPrice : c.discountLabel})`).join('\n')
            : "Ainda estamos cadastrando os parceiros desta semana.";

        const natureList = siteConfig.natureSpots.map(n => `- ${n.name} (${n.distance})`).join('\n');

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        const chat = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: `
              Você é o "Sinaliza Bot", o assistente virtual oficial do guia "Sinaliza Foods".
              Seu tom de voz é amigável, entusiasmado, profissional e você adora usar emojis relacionados a comida e natureza (🍅, 🌿, 🍝, 🌊).

              SEUS OBJETIVOS:
              1. Ajudar o usuário a encontrar opções de lazer baseadas NOS DADOS REAIS DO SITE listados abaixo.
              2. Convencer o usuário a se tornar MEMBRO VIP para desbloquear descontos e mapas.

              DADOS ATUAIS DO SISTEMA (Use isso para responder):
              
              💰 PREÇO DA ASSINATURA:
              R$ 20,00 mensais (Cobrança recorrente, cancela quando quiser). Dá acesso a tudo.

              🍕 RESTAURANTES E PARCEIROS CADASTRADOS AGORA:
              ${partnersList}

              🌿 TURISMO E NATUREZA (TRILHAS/PRAIAS):
              ${natureList}

              REGRAS DE RESPOSTA:
              - NÃO invente lugares que não estão na lista acima.
              - Se o usuário perguntar "Tem pizzaria?", olhe a lista de Restaurantes. Se tiver, cite os nomes. Se não, diga que temos novidades toda semana.
              - Se o usuário pedir cardápio, telefone, localização exata ou fotos: Diga "Para acessar esses detalhes exclusivos, mapas e liberar os descontos, você precisa ser um Membro VIP."
              - NUNCA envie links externos (exceto o WhatsApp se pedirem suporte).
              - Quando sugerir algo, diga para clicar no botão "Seja Membro" ou ir até a seção "Acesso VIP".
              - Seja conciso e vendedor.

              Exemplo de interação:
              Usuário: "Quais trilhas tem?"
              Bot: "Temos opções incríveis como o ${siteConfig.natureSpots[0]?.name || 'Morro do Espia'}! 🌿 Mas para ver o mapa exato e como chegar, você precisa ativar seu Acesso VIP."
            `,
          },
        });
        setChatSession(chat);
      } catch (error) {
        console.error("Erro ao iniciar chat IA:", error);
      }
    };

    initChat();
  }, [companies, siteConfig]); // Re-initialize if data changes

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      if (chatSession) {
        const result = await chatSession.sendMessage({ message: newUserMessage.text });
        const responseText = result.text;

        const newBotMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: responseText,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newBotMessage]);
      } else {
        // Fallback
        const fallbackMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: `Para ver todos os nossos parceiros e descontos exclusivos, torne-se um Membro VIP agora mesmo!`,
            sender: 'bot',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, fallbackMessage]);
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Desculpe, tive um probleminha técnico. 😅 Mas você pode ver tudo na nossa área de Membros!",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      
      {/* Chat Window */}
      <div 
        className={`pointer-events-auto bg-[#1a1a1a] w-[350px] sm:w-[380px] h-[500px] rounded-2xl shadow-2xl border border-red-900/30 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right mb-4 ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none h-0 mb-0'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 to-red-600 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot className="text-white w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Sinaliza Bot</h3>
              <p className="text-red-100 text-xs flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Online agora
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#121212]">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-red-600 text-white rounded-tr-none' 
                    : 'bg-neutral-800 text-gray-200 rounded-tl-none border border-neutral-700'
                }`}
              >
                <p className="whitespace-pre-wrap">
                    {msg.text.split(/(https?:\/\/[^\s]+)/g).map((part, i) => 
                        part.match(/https?:\/\/[^\s]+/) ? (
                            <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all font-bold">
                                {part.includes('wa.me') ? 'Abrir WhatsApp' : 'Link'}
                            </a>
                        ) : part
                    )}
                </p>
                <span className="text-[10px] opacity-50 block mt-1 text-right">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-neutral-800 p-3 rounded-2xl rounded-tl-none border border-neutral-700 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                <span className="text-gray-400 text-xs">Digitando...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-3 bg-[#1a1a1a] border-t border-neutral-800 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Pergunte sobre restaurantes, trilhas..."
            className="flex-1 bg-neutral-900 text-white text-sm rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-600/50 border border-neutral-700 placeholder-gray-500"
          />
          <button 
            type="submit" 
            disabled={!inputText.trim() || isLoading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-full transition-colors flex items-center justify-center shadow-lg shadow-red-900/30"
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-2xl shadow-red-900/50 hover:scale-110 transition-all duration-300 group flex items-center gap-2 relative"
      >
        {!isOpen && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#0f0f0f] rounded-full animate-pulse"></span>
        )}
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
        {!isOpen && <span className="font-bold pr-2 hidden sm:block">Ajuda IA</span>}
      </button>

    </div>
  );
};

export default ChatWidget;