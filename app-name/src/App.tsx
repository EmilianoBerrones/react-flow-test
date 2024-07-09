import type {OnConnect} from "reactflow";

import {useCallback, useEffect, useState} from "react";
import {
    Background,
    Controls,
    MiniMap,
    ReactFlow,
    addEdge,
    useNodesState,
    useEdgesState,
} from "reactflow";

import "reactflow/dist/style.css";
import "./updatenode.css";

import {initialNodes, nodeTypes} from "./nodes";
import {initialEdges, edgeTypes} from "./edges";

export default function App() {
    const [nodes, setNodes ,onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect: OnConnect = useCallback(
        (connection) => setEdges((edges) => addEdge(connection, edges)),
        [setEdges]
    );

    const [nodeName, setNodeName] = useState('Node 1');

    useEffect(() => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === 'a') {
                    // it's important that you create a new node object
                    // in order to notify react flow about the change
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            label: nodeName,
                        },
                    };
                }

                return node;
            }),
        );
    }, [nodeName, setNodes]);

    return (
        <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            edges={edges}
            edgeTypes={edgeTypes}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
        >
            <Background/>
            <MiniMap/>
            <Controls/>
            <div className="updatenode__controls">
                <label> label </label>
                <input
                    value={nodeName}
                    onChange={(evt) => setNodeName(evt.target.value)}
                />
            </div>
        </ReactFlow>
    );
}
