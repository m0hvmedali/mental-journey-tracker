
/** @type {import(\'tailwindcss\').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // حسب امتداد ملفاتك
  ],
  darkMode: 'class', // ← تم تعديلها لتكون مصفوفة تحتوي على "class"
  theme: {
    extend: {
      animation: {
        glow: 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { textShadow: '0 0 5px #3b82f6' },
          '50%': { textShadow: '0 0 15px #3b82f6' },
        }
      }
    }
  },
  
  plugins: [],
}