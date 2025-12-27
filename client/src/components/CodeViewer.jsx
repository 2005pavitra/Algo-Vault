import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeViewer = ({ code, fontSize = 14 }) => {
    return (
        <div className="rounded-md overflow-hidden font-mono bg-[#1e1e1e] h-full">
            <SyntaxHighlighter
                language="java"
                style={vscDarkPlus}
                customStyle={{
                    margin: 0,
                    padding: '1.5rem',
                    fontSize: `${fontSize}px`,
                    lineHeight: '1.5',
                    background: 'transparent',
                    height: '100%',
                }}
                showLineNumbers={true}
                wrapLines={true}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
};
export default CodeViewer;
