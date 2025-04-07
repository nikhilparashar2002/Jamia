'use client';

import { useState } from 'react';
import ConsultForm from './ConsultForm';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileConsultCTA() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile-only fixed bottom CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full z-50">
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 1 
          }}
          className="bg-gradient-to-r from-blue-900 to-blue-800 p-4 shadow-lg"
        >
          <button
            onClick={() => setIsOpen(true)}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-900 font-bold py-3 rounded-xl shadow-lg transition-all duration-300 text-lg flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Get Free Consultation
          </button>
        </motion.div>
      </div>

      {/* Consultation form modal */}
      <AnimatePresence>
        {isOpen && (
          <ConsultForm isOpen={isOpen} onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
