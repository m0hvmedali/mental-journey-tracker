import { useTheme } from '../contexts/ThemeContext.jsx';

export default function TestTheme() {
  const { toggleTheme, theme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-4">
        Theme is: {theme}
      </h1>
      <button
        onClick={toggleTheme}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded"
      >
        Toggle Theme
      </button>
    </div>
  );
}
