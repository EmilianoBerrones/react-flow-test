// customNode.tsx
import React from 'react';
import {Handle, Position} from 'reactflow';
import './customNodeDesign.css';


interface CustomNodeProps {
    id: string,
    data: {
        label: string,
    };
}

export const GoalNode: React.FC<CustomNodeProps> = ({id, data}) => {
    let uninstantiated = false;
    let undeveloped = false;
    if (data.label.includes('uninstantiated')){
        uninstantiated = true;
    }
    if (data.label.includes('undeveloped')){
        undeveloped = true;
    }
    return (
        <div className="goalNode">
            {(uninstantiated || undeveloped) && (
                <div className="nodeAttribute">
                    {undeveloped && (
                        <div className="nodeAttribute__undeveloped"></div>
                    )}
                    {uninstantiated && (
                        <div className="nodeAttribute__uninstantiatedContainer">
                            <div className="nodeAttribute__uninstantiated"></div>
                        </div>
                    )}
                </div>
            )}
            <Handle type="target" style={{background: '#555'}} position={Position.Top}/>
            <div><b>{id}</b></div>
            <div>{data.label}</div>
            <Handle type="source" position={Position.Bottom} style={{background: '#555'}}/>
        </div>
    );
};

export const ContextNode: React.FC<CustomNodeProps> = ({id, data}) => {
    return (
        <div className="contextNode">
            <Handle type="target" position={Position.Top} style={{background: '#555'}}/>
            <div><b>{id}</b></div>
            <div>{data.label}</div>
            <Handle type="source" position={Position.Bottom} style={{background: '#555'}}/>
        </div>
    );
};

export const StrategyNode: React.FC<CustomNodeProps> = ({id, data}) => {
    return (
        <div className="strategyNodeBorder">
            <div className="strategyNode">
                <Handle type="target" style={{background: '#555'}} position={Position.Top}/>
                <div><b>{id}</b></div>
                <div>{data.label}</div>
                <Handle type="source" position={Position.Bottom} style={{background: '#555'}}/>
            </div>
        </div>
    );
};

export const AssumptionNode: React.FC<CustomNodeProps> = ({id, data}) => {
    return (
        <div>
            <div className="ajNodeBorder">
                <div className="ajNode">
                    <Handle type="target" style={{background: '#555'}} position={Position.Top}/>
                    <div><b>{id}</b></div>
                    <div>{data.label}</div>
                    <Handle type="source" position={Position.Bottom} style={{background: '#555'}}/>
                </div>
            </div>
            <div className="ajLetter">
                A
            </div>
        </div>
    );
};

export const JustificationNode: React.FC<CustomNodeProps> = ({id, data}) => {
    return (
        <div>
            <div className="ajNodeBorder">
                <div className="ajNode">
                    <Handle type="target" style={{background: '#555'}} position={Position.Top}/>
                    <div><b>{id}</b></div>
                    <div>{data.label}</div>
                    <Handle type="source" position={Position.Bottom} style={{background: '#555'}}/>
                </div>
            </div>
            <div className='ajLetter'>
                J
            </div>
        </div>
    );
};

export const SolutionNode: React.FC<CustomNodeProps> = ({id, data}) => {
    return (
        <div className="solutionNodeBorder">
            <div className="solutionNode">
                <Handle type="target" style={{background: '#555'}} position={Position.Top}/>
                <div><b>{id}</b></div>
                <div style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}>{data.label}</div>
                <Handle type="source" position={Position.Bottom} style={{background: '#555'}}/>
            </div>
        </div>
    );
};