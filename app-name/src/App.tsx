import type {OnConnect} from "reactflow";
import Dagre from '@dagrejs/dagre'

import {useCallback, useState} from "react";
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

// Layouting elements with the Dagre library
const getLayoutedElements = (nodes: any[], edges: any[], options: { direction: any; }) => {
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: options.direction });

    edges.forEach((edge) => g.setEdge(edge.source, edge.target));
    nodes.forEach((node) =>
        g.setNode(node.id, {
            ...node,
            width: node.measured?.width ?? 0,
            height: node.measured?.height ?? 0,
        }),
    );

    Dagre.layout(g);

    return {
        nodes: nodes.map((node) => {
            const position = g.node(node.id);
            // We are shifting the dagre node position (anchor=center center) to the top left
            // so it matches the React Flow node anchor point (top left).
            const x = position.x - (node.measured?.width ?? 0) / 2;
            const y = position.y - (node.measured?.height ?? 0) / 2;

            return { ...node, position: { x, y } };
        }),
        edges,
    };
};

// Node interface to work with the nodes from nodes\index.ts
interface Node {
    id: string;
    position: {x: number, y: number};
    data: { label: string };
    type?: string;
}

// Edge interface to work with the nodes from edges\index.ts
interface Edge {
    id: string;
    source: string;
    target: string;
    animated: boolean;
    solves?: boolean;
}
// Definition of the stree structure
interface TreeNode {
    node: Node;
    children: TreeNode[];
}

// Function to build the tree
function buildTree(nodes: Node[], edges: Edge[]): TreeNode[] {
    // Creating a map of nodes with the field children initialized as an empty array
    const nodeMap = new Map<string, TreeNode>(
        nodes.map(node => [node.id, { node, children: [] }])
    );

    // Add the children to each node depending on edges
    edges.forEach(edge => {
        const parentNode = nodeMap.get(edge.source);
        const childNode = nodeMap.get(edge.target);

        if (parentNode && childNode) {
            parentNode.children.push(childNode);
        }
    });

    // Return the nodes that do not have a father node in the links
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
        // definition of specific Context, Assumption or Justification nodes.
        const needsSpecialIndent = (idFirstChar === 'C' || idFirstChar === 'A' || idFirstChar === 'J');

        // Eliminate the first indent depending on the type of node
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
    const [nodes, setNodes , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const [initialAssuranceText, setInitialAssuranceText] = useState(treeToText(tree));

    const onConnect: OnConnect = useCallback(
        (connection) => setEdges((edges) => addEdge(connection, edges)),
        [setEdges]
    );

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
                </ReactFlow>
            </div>
        </div>
    );
}
