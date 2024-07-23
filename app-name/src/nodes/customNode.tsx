// customNode.tsx
import React from 'react';
import {Handle, Position} from 'reactflow';

interface CustomNodeProps {
    id: string,
    data: {
        label: string,
    };
}

export const GoalNode: React.FC<CustomNodeProps> = ({id, data}) => {
    return (
        <div style={{
            padding: 10,
            border: '1px solid #777',
            background: '#faefb6'
        }}>
            <Handle type="target" style={{background: '#555'}} position={Position.Top}/>
            <div><b>{id}</b></div>
            <div>{data.label}</div>
            <Handle type="source" position={Position.Bottom} style={{background: '#555'}}/>
        </div>
    );
};

export const ContextNode: React.FC<CustomNodeProps> = ({id, data}) => {
    return (
        <div style={{
            padding: 10,
            border: '1px solid #777',
            borderRadius: '20px',
            background: '#faefb6',
        }}>
            <Handle type="target" position={Position.Top} style={{background: '#555'}}/>
            <div><b>{id}</b></div>
            <div>{data.label}</div>
            <Handle type="source" position={Position.Bottom} style={{background: '#555'}}/>
        </div>
    );
};

export const StrategyNode: React.FC<CustomNodeProps> = ({id, data}) => {
    return (
        <div style={{
            padding: 10,
            paddingLeft: 30,
            paddingRight: 30,
            border: '1px solid #777',
            clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
            background: '#faefb6'
        }}>
            <Handle type="target" style={{background: '#555'}} position={Position.Top}/>
            <div><b>{id}</b></div>
            <div>{data.label}</div>
            <Handle type="source" position={Position.Bottom} style={{background: '#555'}}/>
        </div>
    );
};

export const AssumptionNode: React.FC<CustomNodeProps> = ({id, data}) => {
    return (
        <div>
            <div style={{
                padding: 20,
                border: '1px solid #777',
                clipPath: 'ellipse(50% 50% at 50% 50%)',
                background: '#faefb6'
            }}>
                <Handle type="target" style={{background: '#555'}} position={Position.Top}/>
                <div><b>{id}</b></div>
                <div>{data.label}</div>
                <Handle type="source" position={Position.Bottom} style={{background: '#555'}}/>
            </div>
            <div style={{
                position: 'absolute',
                bottom: -10,
                right: -10,
                padding: '2px 5px',
                fontSize: '23px',
                fontWeight: 'bold',
            }}>
                A
            </div>
        </div>
    );
};

export const JustificationNode: React.FC<CustomNodeProps> = ({id, data}) => {
    return (
        <div>
            <div style={{
                padding: 20,
                border: '1px solid #777',
                clipPath: 'ellipse(50% 50% at 50% 50%)',
                background: '#faefb6'
            }}>
                <Handle type="target" style={{background: '#555'}} position={Position.Top}/>
                <div><b>{id}</b></div>
                <div>{data.label}</div>
                <Handle type="source" position={Position.Bottom} style={{background: '#555'}}/>
            </div>
            <div style={{
                position: 'absolute',
                bottom: -10,
                right: -10,
                padding: '2px 5px',
                fontSize: '23px',
                fontWeight: 'bold',
            }}>
                J
            </div>
        </div>
    );
};

export const SolutionNode: React.FC<CustomNodeProps> = ({id, data}) => {
    return (
        <div style={{
            width: 150,
            height: 150,
            padding: 20,
            border: '1px solid #777',
            clipPath: 'ellipse(50% 50% at 50% 50%)',
            background: '#faefb6',
            alignContent: 'center',
        }}>
            <Handle type="target" style={{background: '#555'}} position={Position.Top}/>
            <div><b>{id}</b></div>
            <div style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            }}>{data.label}</div>
            <Handle type="source" position={Position.Bottom} style={{background: '#555'}}/>
        </div>
    );
};