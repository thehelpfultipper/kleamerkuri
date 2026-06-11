import React, { createContext, useContext, ReactNode } from 'react';
import useChatbot from '../hooks/use-chatbot';

type ChatbotContextValue = ReturnType<typeof useChatbot>;

const ChatbotContext = createContext<ChatbotContextValue | undefined>(undefined);

interface ChatbotProviderProps {
  children: ReactNode;
}

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({ children }) => {
  const chatbot = useChatbot();
  return <ChatbotContext.Provider value={chatbot}>{children}</ChatbotContext.Provider>;
};

export const useChatbotContext = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbotContext must be used within a ChatbotProvider');
  }
  return context;
};
