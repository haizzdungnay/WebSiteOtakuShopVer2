'use client';

import { Phone, MessageCircle } from 'lucide-react';

export default function FloatingButtons() {
  const handlePhoneClick = () => {
    window.location.href = 'tel:0396686826';
  };

  const handleMessengerClick = () => {
    // Replace with your Facebook page ID or messenger link
    window.open('https://m.me/your-page-id', '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3" suppressHydrationWarning>
      {/* Phone Button */}
      <button
        onClick={handlePhoneClick}
        className="w-14 h-14 bg-accent-red text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center animate-pulse"
        aria-label="Call us"
      >
        <Phone size={24} />
      </button>

      {/* Messenger Button */}
      <button
        onClick={handleMessengerClick}
        className="w-14 h-14 bg-[#0084FF] text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center"
        aria-label="Message us on Messenger"
      >
        <MessageCircle size={24} fill="currentColor" />
      </button>
    </div>
  );
}
