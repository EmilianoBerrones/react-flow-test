// customNode.tsx
import React from 'react';
import {Handle, Position} from 'reactflow';

interface CustomNodeProps {
    data: {
        label: string;
    };
}

const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
    return (
        <div style={{ padding: 10, border: '1px solid #777', borderRadius: 5, background: '#fff' }}>
            <Handle type="target" style={{ background: '#555' }}  position={Position.Top}/>
            <div>{data.label}</div>
            <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
        </div>
    );
};

export default CustomNode;