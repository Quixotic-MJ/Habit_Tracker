import React, { useState, useEffect } from 'react';
import { Leaf } from 'lucide-react';

const LoadingBoot = ({ onFinished }) => {
  const [quote, setQuote] = useState({ text: "", author: "" });
  const [opacity, setOpacity] = useState(100);

  // A collection of calm, stoic, or botanical quotes
  const quotes = [
    { text: "Nature does not hurry, yet everything is accomplished.", author: "Lao Tzu" },
    { text: "Adopt the pace of nature: her secret is patience.", author: "Ralph Waldo Emerson" },
    { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
    { text: "Act without expectation.", author: "Lao Tzu" },
    { text: "The grass grows by itself.", author: "Osho" },
    { text: "Do less, but with more focus.", author: "Zen Proverb" }
  ];

  useEffect(() => {
    // 1. Select Random Quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);

    // 2. Simulate Loading Time (e.g., fetching data)
    const timer = setTimeout(() => {
      setOpacity(0); // Start fade out
      setTimeout(() => {
        if (onFinished) onFinished();
      }, 1000); // Wait for fade to finish before unmounting
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div 
      className="fixed inset-0 z-[100] bg-[#F2F0E9] flex flex-col items-center justify-center transition-opacity duration-1000 ease-in-out"
      style={{ opacity: opacity / 100 }}
    >
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      {/* Breathing Icon */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-[#DCE3DA] rounded-full blur-xl animate-pulse opacity-50"></div>
        <Leaf size={48} className="text-[#2C3628] relative z-10 animate-bounce-slow" />
      </div>

      {/* Quote */}
      <div className="max-w-md text-center px-6 animate-fade-in-up">
        <p className="font-serif text-xl md:text-2xl text-[#2C3628] italic leading-relaxed mb-3">
          "{quote.text}"
        </p>
        <p className="font-sans text-xs font-bold uppercase text-[#9C9C9C] tracking-widest">
          — {quote.author}
        </p>
      </div>

      {/* Subtle Progress Line */}
      <div className="absolute bottom-12 w-32 h-1 bg-[#E6E4DC] rounded-full overflow-hidden">
        <div className="h-full bg-[#8A9A85] animate-progress-fill rounded-full"></div>
      </div>

      {/* Custom Styles for this component only */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(1.05); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
        @keyframes progress-fill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress-fill {
          animation: progress-fill 2.5s ease-out forwards;
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LoadingBoot;