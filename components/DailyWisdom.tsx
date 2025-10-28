import { GoogleGenAI } from '@google/genai';
import React, { useState, useEffect } from 'react';
import { SparkleIcon } from './icons/SparkleIcon';

const DailyWisdom: React.FC = () => {
  const [wisdom, setWisdom] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchWisdom = async () => {
      try {
        if (!process.env.API_KEY) {
          setWisdom("API Key not configured.");
          setIsVisible(true);
          return;
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: "Give me one short, engaging, and non-denominational spiritual insight or thought-provoking question for the day. Make it unique and not a common quote. Max 20 words."
        });
        setWisdom(response.text.trim().replace(/^"|"$/g, ''));
        setIsVisible(true);
      } catch (error) {
        console.error("Failed to fetch daily wisdom", error);
        setWisdom("Breathe in, breathe out. Today is a new day.");
        setIsVisible(true);
      }
    };
    
    // Delay fetching to allow the main UI to render first
    setTimeout(fetchWisdom, 500);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000); // Hide after 10 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible]);
  
  if (!wisdom) {
      return null;
  }

  return (
    <div
      className={`fixed top-6 right-6 w-80 max-w-sm p-4 rounded-xl shadow-2xl border border-white/10 bg-black/30 backdrop-blur-xl z-50 transform transition-all duration-500 ease-in-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 text-purple-400 mt-1">
          <SparkleIcon />
        </div>
        <div>
          <h3 className="font-bold text-purple-300">A Thought for Today</h3>
          <p className="text-sm text-gray-200 mt-1 italic">"{wisdom}"</p>
        </div>
      </div>
    </div>
  );
};

export default DailyWisdom;