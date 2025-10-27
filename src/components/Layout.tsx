import React, { lazy, Suspense } from 'react';
import Header from './Header';
import Footer from './Footer';
import ChatbotLoader from './ChatbotLoader';
import { ThemeProvider } from '../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
  location?: Location; // Gatsby passes location prop to page components
}

const Chatbot = lazy(() => import('./Chatbot'));

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <Header />
      <main className="container container-px">{children}</main>
      <Footer />
      <Suspense fallback={<ChatbotLoader />}>
        <Chatbot />
      </Suspense>
    </ThemeProvider>
  );
};

export default Layout;
