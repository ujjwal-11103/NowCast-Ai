import React from 'react';
import { Megaphone, Bell } from 'lucide-react';

const MarqueeAnnouncement = ({ message, announcements }) => {
    return (
        <div className="w-full bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white overflow-hidden py-2 shadow-md mb-4 relative z-40 border-b border-indigo-700">

            {/* Background Pattern (Optional) */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>

            <div className="flex items-center w-full max-w-7xl mx-auto px-4 relative">
                {/* Static Icon Badge */}
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-yellow-300 mr-4 border border-white/20 whitespace-nowrap z-10 shadow-sm">
                    <Megaphone className="w-3 h-3 animate-pulse" />
                    <span>UPDATES</span>
                </div>

                {/* Marquee Container */}
                <div className="flex-1 overflow-hidden relative h-6 mask-linear-fade">
                    {/* Animated Track */}
                    <div className="absolute whitespace-nowrap animate-marquee flex items-center gap-12">

                        {/* Content Repeated to ensure seamless loop */}
                        {/* Content Repeated to ensure seamless loop */
                            (announcements && announcements.length > 0 ? announcements : [
                                "🚀 New Feature: AI-driven consensus adjustments now live!",
                                "📢 Notification: Q4 Forecast Reviews are due by Friday 5 PM.",
                                "⚠️ Maintenance: System update scheduled for Saturday 10 PM."
                            ])
                                // DUPLICATE CONTENT FOR SEAMLESS LOOP
                                .reduce((acc, item) => [...acc, item], [...(announcements && announcements.length > 0 ? announcements : [
                                    "🚀 New Feature: AI-driven consensus adjustments now live!",
                                    "📢 Notification: Q4 Forecast Reviews are due by Friday 5 PM.",
                                    "⚠️ Maintenance: System update scheduled for Saturday 10 PM."
                                ])])
                                .map((msg, i) => (
                                    <React.Fragment key={i}>
                                        <span className="flex items-center gap-2 text-sm font-medium tracking-wide">
                                            {msg}
                                        </span>
                                        <span className="flex items-center gap-2 text-sm font-medium tracking-wide text-indigo-200">
                                            •
                                        </span>
                                    </React.Fragment>
                                ))}

                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .mask-linear-fade {
            mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
        /* Pause on hover for readability */
        .animate-marquee:hover {
            animation-play-state: paused;
        }
      `}</style>
        </div>
    );
};

export default MarqueeAnnouncement;
