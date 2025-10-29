import React, { useState, useEffect } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './styles.module.css';

export interface FileTreeNode {
    name: string;
    type: 'file' | 'directory';
    children?: FileTreeNode[];
    content?: string;
    language?: string;
}

interface FileTreeProps {
    data: FileTreeNode[];
    showContent?: boolean;
    defaultExpanded?: boolean;
    showSidePanel?: boolean;
    defaultOpenFile?: string;
}

const FileTree: React.FC<FileTreeProps> = ({
    data,
    showContent = false,
    defaultExpanded = true,
    showSidePanel = false,
    defaultOpenFile,
}) => {
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
        defaultExpanded ? new Set(data.map(node => node.name)) : new Set()
    );
    const [selectedFile, setSelectedFile] = useState<FileTreeNode | null>(null);
    const { colorMode } = useColorMode();

    // Get the appropriate theme based on current color mode
    const getTheme = () => {
        return colorMode === 'dark' ? themes.vsDark : themes.github;
    };

    // Recursively find node and its ancestors
    const findNodePath = (
        nodes: FileTreeNode[],
        target: string,
        path: string[] = []
    ): string[] | null => {
        for (const node of nodes) {
            if (node.name === target && node.type === 'file') {
                return [...path, node.name];
            }
            if (node.children) {
                const result = findNodePath(node.children, target, [...path, node.name]);
                if (result) return result;
            }
        }
        return null;
    };

    // On mount, open default file
    useEffect(() => {
        if (defaultOpenFile) {
            const path = findNodePath(data, defaultOpenFile);
            if (path) {
                // Expand all directories in the path except the file itself
                const dirsToExpand = new Set(expandedNodes);
                path.slice(0, -1).forEach(dirName => dirsToExpand.add(dirName));
                setExpandedNodes(dirsToExpand);

                // Find the actual FileTreeNode object
                const findNode = (nodes: FileTreeNode[]): FileTreeNode | null => {
                    for (const n of nodes) {
                        if (n.name === defaultOpenFile && n.type === 'file') return n;
                        if (n.children) {
                            const found = findNode(n.children);
                            if (found) return found;
                        }
                    }
                    return null;
                };
                const fileNode = findNode(data);
                if (fileNode) setSelectedFile(fileNode);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleNode = (nodeName: string) => {
        const newExpanded = new Set(expandedNodes);
        newExpanded.has(nodeName)
            ? newExpanded.delete(nodeName)
            : newExpanded.add(nodeName);
        setExpandedNodes(newExpanded);
    };

    const handleFileClick = (node: FileTreeNode) => {
        if (node.type === 'file') {
            setSelectedFile(node);
        }
    };

    const renderFileContent = (content: string, language?: string) => {
        if (!language) {
            // Fallback for content without language specification
            return (
                <pre className={styles.fileContentPre}>
                    <code
                        style={{
                            fontFamily: 'var(--ifm-font-family-monospace)',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            whiteSpace: 'pre-wrap',
                        }}
                    >
                        {content}
                    </code>
                </pre>
            );
        }

        return (
            <Highlight
                theme={getTheme()}
                code={content.trim()}
                language={language}
            >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre
                        className={`${className} ${styles.fileContentPre}`}
                        style={{
                            ...style,
                            margin: 0,
                            padding: '1rem',
                            borderRadius: colorMode === 'dark'
                                ? '0 0 var(--ifm-border-radius) var(--ifm-border-radius)'
                                : '0 0 var(--ifm-border-radius) var(--ifm-border-radius)',
                            fontSize: '13px',
                            overflowX: 'auto',
                        }}
                    >
                        <code>
                            {tokens.map((line, i) => (
                                <div key={i} {...getLineProps({ line })}>
                                    {line.map((token, key) => (
                                        <span key={key} {...getTokenProps({ token })} />
                                    ))}
                                </div>
                            ))}
                        </code>
                    </pre>
                )}
            </Highlight>
        );
    };

    const renderNode = (node: FileTreeNode, level = 0): React.ReactNode => {
        const isDir = node.type === 'directory';
        const isExpanded = expandedNodes.has(node.name);
        const isSelected = selectedFile?.name === node.name;

        return (
            <div key={`${node.name}-${level}`} className={styles.node}>
                <div
                    className={`${styles.nodeContent} ${isDir ? styles.directory : styles.file
                        } ${isSelected ? styles.selected : ''}`}
                    style={{ paddingLeft: level * 20 }}
                    onClick={() => {
                        isDir ? toggleNode(node.name) : handleFileClick(node);
                    }}
                >
                    {isDir ? (
                        <span className={styles.expandIcon}>
                            {isExpanded ? '📂' : '📁'}
                        </span>
                    ) : (
                        <span className={styles.fileIcon}>{getFileIcon(node.name)}</span>
                    )}
                    <span className={styles.nodeName}>{node.name}</span>
                </div>

                {isDir && isExpanded && node.children && (
                    <div className={styles.children}>
                        {node.children.map(child => renderNode(child, level + 1))}
                    </div>
                )}

                {!isDir && showContent && node.content && !showSidePanel && (
                    <div className={styles.fileContent}>
                        {renderFileContent(node.content, node.language)}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={showSidePanel ? styles.fileTreeContainer : styles.fileTree}>
            <div className={showSidePanel ? styles.fileTreePanel : styles.fileTree}>
                {data.map(node => renderNode(node))}
            </div>

            {showSidePanel && selectedFile && (
                <div className={styles.sidePanel}>
                    <div className={styles.sidePanelHeader}>
                        <span className={styles.fileIcon}>
                            {getFileIcon(selectedFile.name)}
                        </span>
                        <span className={styles.fileName}>{selectedFile.name}</span>
                    </div>
                    <div className={styles.sidePanelContent}>
                        {selectedFile.content ? (
                            renderFileContent(selectedFile.content, selectedFile.language)
                        ) : (
                            <div className={styles.noContent}>
                                <p>No content available for this file.</p>
                                <p>
                                    Add a <strong>content</strong> property to display file
                                    contents.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

function getFileIcon(filename: string): string {
    const name = filename.toLowerCase();
    const ext = name.split('.').pop();

    // Special cases: files named "start" or "Dockerfile"
    if (name === 'start' || filename === 'Dockerfile') {
        return '🐳'; // Whale logo for Dockerfile or start file
    }

    switch (ext) {
        case 'tf':
        case 'hcl':
            return '🏗️';
        case 'md':
        case 'mdx':
            return '📝';
        case 'json':
            return '📋';
        case 'yaml':
        case 'yml':
            return '⚙️';
        case 'sh':
        case 'bash':
            return '🔧';
        case 'py':
            return '🐍';
        case 'js':
        case 'jsx':
            return '📜';
        case 'ts':
        case 'tsx':
            return '🔷';
        case 'css':
        case 'scss':
        case 'sass':
            return '🎨';
        case 'html':
        case 'htm':
            return '🌐';
        default:
            return '📄';
    }
}

export default FileTree;
