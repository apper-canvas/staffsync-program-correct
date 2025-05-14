import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getIcon from './utils/iconUtils';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const SunIcon = getIcon('Sun');
  const MoonIcon = getIcon('Moon');
  const UserIcon = getIcon('User');
  const SettingsIcon = getIcon('Settings');

  return (
    <>
      <header className="bg-white dark:bg-surface-800 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <UserIcon className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-surface-900 dark:text-white">StaffSync</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleDarkMode}
                className="rounded-full p-2 text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>
              <button className="rounded-full p-2 text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700 transition-colors">
                <SettingsIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 min-h-[calc(100vh-128px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="bg-white dark:bg-surface-800 py-4 border-t border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4">
          <div className="text-center text-surface-600 dark:text-surface-400 text-sm">
            &copy; {new Date().getFullYear()} StaffSync. All rights reserved.
          </div>
        </div>
      </footer>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
      />
    </>
  );
}

export default App;