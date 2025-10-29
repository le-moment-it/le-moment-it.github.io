import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

interface AnimatedTerminalProps {
    typingSpeed?: number;
    startDelay?: number;
    cursor?: boolean;
    link?: { text: string; to: string };
}

const ALL_LOG_LINES = [
    'Removing copy paste content 🗑️ ...',
    'Clearing browser cache for the 47th time 🧹 ...',
    'Teaching CSS to behave properly 📚 ...',
    'Convincing database it worked yesterday 💬 ...',
    'Updating dependencies that nobody understands 📦 ...',
    'Fixing the fix that fixed the previous fix 🔧 ...',
    'Restarting service until it works 🔄 ...',
    'Applying magic configuration changes ✨ ...',
    'Praying to the deployment gods 🙏 ...',
    'Turning it off and on again 🔌 ...',
    'Removing hardcoded localhost URLs 🗑️ ...',
    'Explaining to junior dev why we need staging 👨‍🏫 ...',
    'Rolling back the rollback of the rollback ⏪ ...',
    'Installing "works on my machine" compatibility layer 💻 ...',
    'Debugging code written at 3am on Friday 🌙 ...',
    'Adding more logging to debug the logging 📋 ...',
    'Waiting for DNS to propagate (eventually) ⏰ ...',
    'Configuring environment variables nobody documented 📝 ...',
    'Removing TODO comments from production code ❌ ...',
    'Optimizing performance by adding more servers 🚀 ...',
];




const shuffle = <T,>(arr: T[]): T[] =>
    [...arr].sort(() => Math.random() - 0.5);

const AnimatedTerminal: React.FC<AnimatedTerminalProps> = ({
    typingSpeed = 80,
    startDelay = 500,
    cursor = true,
    link = { text: 'Start now !', to: '/docs/devops/intro' },
}) => {
    // Construct lines: install, 8 logs, success
    const lines = useMemo(() => {
        const logs = shuffle(ALL_LOG_LINES).slice(0, 8);
        return [
            'apt install --with-good-practices --secure devops',
            ...logs,
            '🚀 Success !',
        ];
    }, []);

    const [displayLines, setDisplayLines] = useState<string[]>([]);
    const [lineIndex, setLineIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [showCursor, setShowCursor] = useState(true);
    const [hasStarted, setHasStarted] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const cursorRef = useRef<NodeJS.Timeout | null>(null);
    const { colorMode } = useColorMode();

    // Start typing after startDelay
    useEffect(() => {
        const timer = setTimeout(() => setHasStarted(true), startDelay);
        return () => clearTimeout(timer);
    }, [startDelay]);

    // Typing animation
    useEffect(() => {
        if (!hasStarted || lineIndex >= lines.length) return;

        const current = lines[lineIndex];
        // Use ultra-fast speed for logs and success
        const speed = lineIndex === 0 ? typingSpeed : 10;

        if (charIndex < current.length) {
            intervalRef.current = setTimeout(() => {
                setDisplayLines(prev => {
                    const updated = [...prev];
                    updated[lineIndex] = current.slice(0, charIndex + 1);
                    return updated;
                });
                setCharIndex(ci => ci + 1);
            }, speed);
        } else {
            // Pause then advance
            intervalRef.current = setTimeout(() => {
                setLineIndex(li => li + 1);
                setCharIndex(0);
            }, speed * 3);
        }

        return () => {
            if (intervalRef.current) clearTimeout(intervalRef.current);
        };
    }, [charIndex, hasStarted, lineIndex, lines, typingSpeed]);

    // Cursor blink
    useEffect(() => {
        if (!cursor) return;
        cursorRef.current = setInterval(() => setShowCursor(s => !s), 600);
        return () => {
            if (cursorRef.current) clearInterval(cursorRef.current);
        };
    }, [cursor]);

    return (
        <div className={styles.terminalContainer}>
            <div className={`${styles.terminal} ${styles[colorMode]}`}>
                <div className={styles.terminalHeader}>
                    <div className={styles.terminalButtons}>
                        <span className={`${styles.terminalButton} ${styles.red}`} />
                        <span className={`${styles.terminalButton} ${styles.yellow}`} />
                        <span className={`${styles.terminalButton} ${styles.green}`} />
                    </div>
                    <div className={styles.terminalTitle}>Le-Moment-IT</div>
                </div>
                <div className={styles.terminalBody}>
                    {displayLines.map((line, idx) => (
                        <div
                            key={idx}
                            className={
                                idx === 0
                                    ? styles.terminalLine
                                    : idx < lines.length - 1
                                        ? styles.logLine
                                        : styles.successLine
                            }
                        >
                            {idx === 0 && <span className={styles.prompt}>$</span>}
                            <span className={styles.command}>{line}</span>
                            {idx === lineIndex && showCursor && (
                                <span className={styles.cursor}>█</span>
                            )}
                        </div>
                    ))}
                    {lineIndex >= lines.length && (
                        <div className={styles.buttonContainer}>
                            <Link to={link.to} className={styles.ctaButton}>
                                {link.text}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnimatedTerminal;
