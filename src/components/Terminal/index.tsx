import React, { useState, useRef } from 'react';
import clsx from 'clsx';
import styles from './terminal.module.css';

export default function Terminal({
    children,
    title,
    prompt = '$',
    lines = null,
    showCopy = true
}) {
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef(null);

    const handleCopy = async () => {
        const textToCopy = lines ? lines.join('\n') : children;

        try {
            await navigator.clipboard.writeText(textToCopy);
            setIsCopied(true);

            // Clear any existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Reset after 2 seconds (same as Terragrunt)
            timeoutRef.current = setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const renderContent = () => {
        if (lines && Array.isArray(lines)) {
            return lines.map((line, index) => (
                <div key={index} className={styles.terminalLine}>
                    <span className={styles.terminalPrompt}>{prompt}</span>
                    <span className={styles.terminalCommand}>{line}</span>
                </div>
            ));
        }

        return (
            <div className={styles.terminalLine}>
                <span className={styles.terminalPrompt}>{prompt}</span>
                <span className={styles.terminalCommand}>{children}</span>
            </div>
        );
    };

    return (
        <div className={clsx('terminal-container', styles.terminal)}>
            {title && (
                <div className={styles.terminalHeader}>
                    <div className={styles.terminalButtons}>
                        <span className={styles.terminalButton} data-color="red"></span>
                        <span className={styles.terminalButton} data-color="yellow"></span>
                        <span className={styles.terminalButton} data-color="green"></span>
                    </div>
                    <div className={styles.terminalTitle}>{title}</div>
                </div>
            )}
            <div className={styles.terminalContent}>
                {renderContent()}
                {showCopy && (
                    <button
                        className={styles.copyButton}
                        onClick={handleCopy}
                        title="Copy to clipboard"
                        aria-label="Copy command to clipboard"
                    >
                        {isCopied ? 'Copied!' : (
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M20 9H11C9.89543 9 9 9.89543 9 11V20C9 21.1046 9.89543 22 11 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89543 21.1046 9 20 9Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
