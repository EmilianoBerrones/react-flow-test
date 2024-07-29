// customNode.tsx
import React from 'react';
import {Handle, NodeToolbar, Position} from 'reactflow';
import './customNodeDesign.css';
import {Button} from "@mui/material";
import {MuiColorInput} from "mui-color-input";


interface CustomNodeProps {
    id: string,
    data: {
        label: string,
        id: string
    };
}

export const GoalNode: React.FC<CustomNodeProps> = ({data}) => {
    const [backgroundColor, setBackgroundColor] = React.useState('#faefb6')
    const [label, setLabel] = React.useState(data.label);

    let uninstantiated = false;
    let undeveloped = false;
    if (data.label.includes('uninstantiated')) {
        uninstantiated = true;
    }
    if (data.label.includes('undeveloped')) {
        undeveloped = true;
    }

    const handleColorChange = (newValue: React.SetStateAction<string>) => {
        setBackgroundColor(newValue);
    }

    const handleLabel = () => {
        const newLabel = prompt('Enter the new label');
        if (newLabel){
            setLabel(newLabel);
        }
    }

    return (
        <div className="goalNode" style={{backgroundColor}}>
            {(uninstantiated || undeveloped) && (
                <div className="nodeAttribute__container">
                    {undeveloped && (
                        <div className="nodeAttribute__undevelopedContainer">
                            <div className="nodeAttribute__undeveloped"></div>
                        </div>
                    )}
                    {uninstantiated && (
                        <div className="nodeAttribute__uninstantiatedContainer">
                            <div className="nodeAttribute__uninstantiated"></div>
                        </div>
                    )}
                </div>
            )}
            <NodeToolbar>
                <Button variant="outlined" onClick={handleLabel}>Edit</Button>
                <MuiColorInput format="hex" value={backgroundColor} onChange={handleColorChange}></MuiColorInput>
                <Button variant="outlined">Delete</Button>
            </NodeToolbar>
            <Handle type="target" style={{background: '#555'}} position={Position.Top}/>
            <div><b>{data.id}</b></div>
            <div>{label}</div>
            <Handle type="source" position={Position.Bottom} style={{background: '#555'}}/>
        </div>
    );
};

export const ContextNode: React.FC<CustomNodeProps> = ({data}) => {
    let uninstantiated = false;
    let undeveloped = false;
    if (data.label.includes('uninstantiated')) {
        uninstantiated = true;
    }
    if (data.label.includes('undeveloped')) {
        undeveloped = true;
    }
    return (
        <div className="contextNode">
            {(uninstantiated || undeveloped) && (
                <div className="nodeAttribute__container">
                    {undeveloped && (
                        <div className="nodeAttribute__undevelopedContainer">
                            <div className="nodeAttribute__undeveloped"></div>
                        </div>
                    )}
                    {uninstantiated && (
                        <div className="nodeAttribute__uninstantiatedContainer">
                            <div className="nodeAttribute__uninstantiated"></div>
                        </div>
                    )}
                </div>
            )}
            <Handle type="target" position={Position.Top} style={{background: '#555'}}/>
            <div><b>{data.id}</b></div>
            <div>{data.label}</div>
            <Handle type="source" position={Position.Bottom} style={{background: '#555'}}/>
        </div>
    );
};

export const StrategyNode: React.FC<CustomNodeProps> = ({data}) => {
    let uninstantiated = false;
    let undeveloped = false;
    if (data.label.includes('uninstantiated')) {
        uninstantiated = true;
    }
    if (data.label.includes('undeveloped')) {
        undeveloped = true;
    }
    return (
        <div>
            {(uninstantiated || undeveloped) && (
                <div className="nodeAttribute__container">
                    {undeveloped && (
                        <div className="nodeAttribute__undevelopedContainer">
                            <div className="nodeAttribute__undeveloped"></div>
                        </div>
                    )}
                    {uninstantiated && (
                        <div className="nodeAttribute__uninstantiatedContainer">
                            <div className="nodeAttribute__uninstantiated"></div>
                        </div>
                    )}
                </div>
            )}
            <div className="strategyNodeBorder">
                <div className="strategyNode">
                    <Handle type="target" style={{background: '#555'}} position={Position.Top}/>
                    <div><b>{data.id}</b></div>
                    <div>{data.label}</div>
                    <Handle type="source" position={Position.Bottom} style={{background: '#555'}}/>
                </div>
            </div>
        </div>
    );
};

export const AssumptionNode: React.FC<CustomNodeProps> = ({data}) => {
    let uninstantiated = false;
    let undeveloped = false;
    if (data.label.includes('uninstantiated')) {
        uninstantiated = true;
    }
    if (data.label.includes('undeveloped')) {
        undeveloped = true;
    }
    return (
        <div>
            {(uninstantiated || undeveloped) && (
                <div className="nodeAttribute__container">
                    {undeveloped && (
                        <div className="nodeAttribute__undevelopedContainer">
                            <div className="nodeAttribute__undeveloped"></div>
                        </div>
                    )}
                    {uninstantiated && (
                        <div className="nodeAttribute__uninstantiatedContainer">
                            <div className="nodeAttribute__uninstantiated"></div>
                        </div>
                    )}
                </div>
            )}
            <div className="ajNodeBorder">
                <div className="ajNode">
                    <Handle type="target" style={{background: '#555'}} position={Position.Top}/>
                    <div><b>{data.id}</b></div>
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

export const JustificationNode: React.FC<CustomNodeProps> = ({data}) => {
    let uninstantiated = false;
    let undeveloped = false;
    if (data.label.includes('uninstantiated')) {
        uninstantiated = true;
    }
    if (data.label.includes('undeveloped')) {
        undeveloped = true;
    }
    return (
        <div>
            {(uninstantiated || undeveloped) && (
                <div className="nodeAttribute__container">
                    {undeveloped && (
                        <div className="nodeAttribute__undevelopedContainer">
                            <div className="nodeAttribute__undeveloped"></div>
                        </div>
                    )}
                    {uninstantiated && (
                        <div className="nodeAttribute__uninstantiatedContainer">
                            <div className="nodeAttribute__uninstantiated"></div>
                        </div>
                    )}
                </div>
            )}
            <div className="ajNodeBorder">
                <div className="ajNode">
                    <Handle type="target" style={{background: '#555'}} position={Position.Top}/>
                    <div><b>{data.id}</b></div>
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

export const SolutionNode: React.FC<CustomNodeProps> = ({data}) => {
    let uninstantiated = false;
    let undeveloped = false;
    if (data.label.includes('uninstantiated')) {
        uninstantiated = true;
    }
    if (data.label.includes('undeveloped')) {
        undeveloped = true;
    }
    return (
        <div>
            {(uninstantiated || undeveloped) && (
                <div className="nodeAttribute__container">
                    {undeveloped && (
                        <div className="nodeAttribute__undevelopedContainer">
                            <div className="nodeAttribute__undeveloped"></div>
                        </div>
                    )}
                    {uninstantiated && (
                        <div className="nodeAttribute__uninstantiatedContainer">
                            <div className="nodeAttribute__uninstantiated"></div>
                        </div>
                    )}
                </div>
            )}
            <div className="solutionNodeBorder">
                <div className="solutionNode">
                    <Handle type="target" style={{background: '#555'}} position={Position.Top}/>
                    <div><b>{data.id}</b></div>
                    <div style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}>{data.label}</div>
                    <Handle type="source" position={Position.Bottom} style={{background: '#555'}}/>
                </div>
            </div>
        </div>
    );
};