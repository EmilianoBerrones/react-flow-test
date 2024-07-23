// customNode.tsx
import React from 'react';
import {Handle, Position} from 'reactflow';

interface CustomNodeProps {
    id: string,
    data: {
        label: string,
    };
}

const CustomNode: React.FC<CustomNodeProps> = ({ id, data }) => {
    return (
        <div style={{padding: 10, border: '1px solid #777', borderRadius: 5, background: '#faefb6'}}>
            <Handle type="target" style={{background: '#555'}} position={Position.Top}/>
            <h6>{id}</h6>
            <div>{data.label}</div>
            <Handle type="source" position={Position.Bottom} style={{background: '#555'}}/>
        </div>
    );
};

export default CustomNode;