import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/nextjs';

const AnimatedGreeting = () => {
    const { user } = useUser();
    const [currentIndex, setCurrentIndex] = useState(0);

    const guestMessages = [
        { text: "Understand Any GitHub Repository", icon: "🔍" },
        { text: "Ask Questions About Any Codebase", icon: "💭" },
        { text: "AI-Powered Code Intelligence", icon: "🤖" },
        { text: "Your Repository Navigator", icon: "🧭" },
        { text: "Deep Dive Into Code", icon: "🏊" },
        { text: "Explore Repositories Smarter", icon: "🚀" }
    ];

    const userMessages = [
        { text: `Welcome back, ${user?.firstName || ''}`, icon: "👋" },
        { text: "Ready to explore some code?", icon: "🔍" },
        { text: "What repository shall we analyze?", icon: "📚" },
        { text: "Ask me anything about your code", icon: "💡" },
        { text: "Let's decode your repositories", icon: "🧩" },
        { text: "Your AI code companion awaits", icon: "🤖" }
    ];

    const messages = user ? userMessages : guestMessages;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % messages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [messages.length]);

    return (
        <div className="hidden md:flex items-center justify-center h-full overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    className="flex items-center space-x-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{
                        y: 0,
                        opacity: 1,
                        transition: {
                            type: "spring",
                            stiffness: 100,
                            damping: 15
                        }
                    }}
                    exit={{
                        y: -20,
                        opacity: 0,
                        transition: {
                            duration: 0.3
                        }
                    }}
                >
                    <motion.span
                        className="text-lg font-bold bg-gradient-to-r from-zinc-500 via-zinc-800 to-zinc-500 bg-clip-text text-transparent"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        {messages[currentIndex]?.text}
                    </motion.span>
                    <motion.span
                        className="text-2xl"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{
                            scale: 1,
                            rotate: 0,
                            transition: {
                                type: "spring",
                                stiffness: 200,
                                damping: 10
                            }
                        }}
                    >
                        {messages[currentIndex]?.icon}
                    </motion.span>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default AnimatedGreeting;