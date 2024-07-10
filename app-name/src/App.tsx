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

    // Function for modifying the nodes' label.
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

    // Function for handling [Tab] on the TextArea so assurance cases can be written properly.
    const handleTab = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            const textarea = event.target as HTMLTextAreaElement;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            textarea.value = textarea.value.substring(0, start) + "\t" + textarea.value.substring(end);

            textarea.selectionStart = textarea.selectionEnd = start + 1;
        }
    }

    return (
        <div className="app-container">
            <div className="left-pane">
                <pre>
                    G1: Map system is acceptably safe to operate <br/>
                    C1: Map systems is defined <br/>
                    C2: Map role and context <br/>
                    G2: All identified hazards have been eliminated or sufficiently mitigated <br/>
                    C3: Hazards identified from DAO <br/>
                    S1: Argumentation over each identified hazard <br/>
                    A1: All hazards have been identified <br/>
                    G3: Hazard H1 has been eliminated <br/>
                    Sn1: Safety rules execution <br/>
                    <textarea id='test' name='test1' onKeyDown={handleTab}></textarea>
                </pre>
            </div>
            <div className="right-pane">
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
            </div>
        </div>
    );
}
