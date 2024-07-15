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
import {TextField} from "@mui/material";

interface Node {
    id: string;
    position: {x: number, y: number};
    data: { label: string };
    type?: string;
}

// Definir la interfaz para los enlaces
interface Edge {
    id: string;
    source: string;
    target: string;
    animated: boolean;
    solves?: boolean;
}
// Definir la estructura para el árbol
interface TreeNode {
    node: Node;
    children: TreeNode[];
}

// Función para construir el árbol
function buildTree(nodes: Node[], edges: Edge[]): TreeNode[] {
    // Crear un mapa de nodos con el campo children inicializado como array vacío
    const nodeMap = new Map<string, TreeNode>(
        nodes.map(node => [node.id, { node, children: [] }])
    );

    // Añadir los hijos a cada nodo según los enlaces
    edges.forEach(edge => {
        const parentNode = nodeMap.get(edge.source);
        const childNode = nodeMap.get(edge.target);

        if (parentNode && childNode) {
            parentNode.children.push(childNode);
        }
    });

    // Devolver los nodos que no tienen un padre en los enlaces
    return Array.from(nodeMap.values()).filter(treeNode =>
        !edges.some(edge => edge.target === treeNode.node.id)
    );
}

function treeToText(tree: TreeNode[], level: number = 0, isRoot: boolean = true): string {
    const baseIndent = '  ';
    const indent = baseIndent.repeat(level);
    let result = '';

    for (const treeNode of tree) {
        const idFirstChar = treeNode.node.id.charAt(0);
        const needsSpecialIndent = (idFirstChar === 'C' || idFirstChar === 'A' || idFirstChar === 'J');

        // Eliminar la primera indentación solo si es necesario
        const actualIndent = (isRoot && needsSpecialIndent) ? '' : indent;

        result += `${actualIndent}- ${treeNode.node.id}: ${treeNode.node.data.label}\n`;

        if (treeNode.children.length > 0) {
            result += treeToText(treeNode.children, level + 1, false);
        }
    }

    return result;
}

const tree = buildTree(initialNodes, initialEdges);
console.log("Hola mundo");
// console.log(JSON.stringify(tree, null, 2));
console.log(treeToText(tree))


export default function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const [initialAssuranceText, setInitialAssuranceText] = useState(treeToText(tree));

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
    const handleTab = (event: React.KeyboardEvent<HTMLDivElement>) => {
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
            <meta name="viewport" content="initial-scale=1, width=device-width"/>
            <div className="left-pane">
                <h1>ProjectName</h1>
                <TextField id="AssuranceText"
                           fullWidth
                           multiline
                           rows={15}
                           variant="outlined"
                           value={initialAssuranceText}
                           onChange={(e) => setInitialAssuranceText(e.target.value)}
                           onKeyDown={handleTab}/>
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
