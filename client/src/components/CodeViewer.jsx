import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { java } from '@codemirror/lang-java';

const CodeViewer = ({ code }) => {
    return (
        <div className="border rounded-md overflow-hidden text-sm">
            <CodeMirror
                value={code}
                height="400px"
                extensions={[java()]}
                editable={false}
                theme="light"
            />
        </div>
    );
};
export default CodeViewer;
