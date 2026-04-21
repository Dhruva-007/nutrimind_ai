import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import AccessibilityBar from '../components/AccessibilityBar';
import VoiceInput from '../components/VoiceInput';
import Link from 'next/link';

function MyApp({ Component, pageProps, router }: AppProps) {
  const isAuthPage = router.pathname === '/';

  return (
    <>
      <Head>
        <title>NutriMind AI 🥗</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="description" content="Context-aware food intelligence" />
      </Head>
      
      <AccessibilityBar />
      
      {!isAuthPage && (
        <nav className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 sticky top-0 z-40 bg-opacity-80 backdrop-blur-md">
          <div className="max-w-4xl mx-auto flex justify-between items-center overflow-x-auto gap-4">
            <Link href="/dashboard" className="font-black text-xl text-primary shrink-0">NutriMind</Link>
            <div className="flex gap-4 shrink-0 sm:gap-6 ml-auto">
              <Link href="/dashboard" className={`font-semibold ${router.pathname==='/dashboard' ? 'text-primary': 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>Home</Link>
              <Link href="/scan" className={`font-semibold ${router.pathname==='/scan' ? 'text-primary': 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>Scan</Link>
              <Link href="/history" className={`font-semibold ${router.pathname==='/history' ? 'text-primary': 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>History</Link>
              <Link href="/analytics" className={`font-semibold ${router.pathname==='/analytics' ? 'text-primary': 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>Analytics</Link>
            </div>
          </div>
        </nav>
      )}

      <main id="main-content" className="min-h-screen py-6 px-4 pb-24 sm:px-6">
        <Component {...pageProps} />
      </main>

      {!isAuthPage && <VoiceInput />}
    </>
  );
}

export default MyApp;
