"use client";
import { useState } from "react";
import { selectorOptions as options } from "./interactive-selector-data";

const InteractiveSelector = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[600px] py-10 rounded-xl bg-[#222] font-sans text-white"> 
      {/* Header Section */}
      <div className="w-full max-w-2xl px-6 mt-8 mb-2 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight drop-shadow-lg animate-fadeInTop delay-300">Escape in Style</h2>
        <p className="text-lg md:text-xl text-gray-300 font-medium max-w-xl mx-auto animate-fadeInTop delay-600">Discover luxurious camping experiences in nature’s most breathtaking spots.</p>
      </div>

      <div className="h-12"></div>

      {/* Options Container */}
      <div className="w-full overflow-x-auto p-4" tabIndex={0} role="region" aria-label="Opciones de experiencias de camping">
      <div className="options flex w-full max-w-[900px] min-w-[600px] h-[400px] mx-auto items-stretch overflow-hidden relative">
        {options.map((option, index) => (
          <button
            type="button"
            aria-pressed={activeIndex === index}
            aria-label={`${option.title}: ${option.description}`}
            key={option.title}
            className={`
              option text-left focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-white relative flex flex-col justify-end overflow-hidden transition-all duration-700 ease-in-out
              ${activeIndex === index ? 'active' : ''}
            `}
            style={{
              backgroundImage: `url('${option.image}')`,
              backgroundSize: activeIndex === index ? 'auto 100%' : 'auto 120%',
              backgroundPosition: 'center',
              backfaceVisibility: 'hidden',
              animation: `slideFadeIn 700ms ease-in-out ${index * 180}ms both`,
              minWidth: '60px',
              minHeight: '100px',
              margin: 0,
              borderRadius: 0,
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: activeIndex === index ? '#fff' : '#292929',
              cursor: 'pointer',
              backgroundColor: '#18181b',
              boxShadow: activeIndex === index 
                ? '0 20px 60px rgba(0,0,0,0.50)' 
                : '0 10px 30px rgba(0,0,0,0.30)',
              flex: activeIndex === index ? '7 1 0%' : '1 1 0%',
              zIndex: activeIndex === index ? 10 : 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              position: 'relative',
              overflow: 'hidden',
              willChange: 'flex-grow, box-shadow, background-size, background-position'
            }}
            onClick={() => setActiveIndex(index)}
          >
            {/* Shadow effect */}
            <span 
              className="shadow absolute left-0 right-0 pointer-events-none transition-all duration-700 ease-in-out"
              style={{
                bottom: activeIndex === index ? '0' : '-40px',
                height: '120px',
                boxShadow: activeIndex === index 
                  ? 'inset 0 -120px 120px -120px #000, inset 0 -120px 120px -80px #000' 
                  : 'inset 0 -120px 0px -120px #000, inset 0 -120px 0px -80px #000'
              }}
            ></span>
            
            {/* Label with icon and info */}
            <span className="label absolute left-0 right-0 bottom-5 flex items-center justify-start h-12 z-2 pointer-events-none px-4 gap-3 w-full">
              <span className="icon min-w-[44px] max-w-[44px] h-[44px] flex items-center justify-center rounded-full bg-[rgba(32,32,32,0.85)] backdrop-blur-[10px] shadow-[0_1px_4px_rgba(0,0,0,0.18)] border-2 border-[#444] flex-shrink-0 flex-grow-0 transition-all duration-200">
                {option.icon}
              </span>
              <span className="info text-white whitespace-pre relative">
                <span 
                  className="block main font-bold text-lg transition-all duration-700 ease-in-out"
                  style={{
                    opacity: activeIndex === index ? 1 : 0,
                    transform: activeIndex === index ? 'translateX(0)' : 'translateX(25px)'
                  }}
                >
                  {option.title}
                </span>
                <span 
                  className="block sub text-base text-gray-300 transition-all duration-700 ease-in-out"
                  style={{
                    opacity: activeIndex === index ? 1 : 0,
                    transform: activeIndex === index ? 'translateX(0)' : 'translateX(25px)'
                  }}
                >
                  {option.description}
                </span>
              </span>
            </span>
          </button>
        ))}
      </div>
      
      </div>
      {/* Custom animations */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .option, .option *, .animate-fadeInTop { animation: none !important; transition: none !important; }
          .option, .animate-fadeInTop { opacity: 1; transform: none; }
        }
        @keyframes slideFadeIn {
          0% {
            opacity: 0;
            transform: translateX(-60px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInFromTop {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInTop {
          opacity: 0;
          transform: translateY(-20px);
          animation: fadeInFromTop 0.8s ease-in-out forwards;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
  );
};

export default InteractiveSelector;
