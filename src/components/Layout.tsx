import React, { lazy, Suspense } from 'react';
import Header from './Header';
import Footer from './Footer';
import ChatbotLoader from './ChatbotLoader';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ChatbotProvider } from '../contexts/ChatbotContext';

interface LayoutProps {
  children: React.ReactNode;
  location?: {
    pathname: string;
  };
}

const Chatbot = lazy(() => import('./Chatbot'));

const isHomePage = (pathname: string) => {
  const normalized = pathname.replace(/\/$/, '') || '/';
  const homePaths = ['/', '/kleamerkuri'];
  return homePaths.includes(normalized);
};

const Layout: React.FC<LayoutProps> = ({ children, location }) => {
  const showFloatingChat = location ? !isHomePage(location.pathname) : true;

  return (
    <ThemeProvider>
      <ChatbotProvider>
        <Header />
        <main className="container container-px">{children}</main>
        <Footer />
        {showFloatingChat && (
          <Suspense fallback={<ChatbotLoader />}>
            <Chatbot />
          </Suspense>
        )}
      </ChatbotProvider>
    </ThemeProvider>
  );
};

export default Layout;
