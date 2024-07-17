import type {OnConnect} from "reactflow";
import {addEdge, Background, Controls, MiniMap, ReactFlow, useEdgesState, useNodesState,} from "reactflow";
import Dagre from '@dagrejs/dagre'

import {SetStateAction, useCallback, useState} from "react";

import "reactflow/dist/style.css";
import "./updatenode.css";

import {initialNodes, nodeTypes} from "./nodes";
import {edgeTypes, initialEdges} from "./edges";
import {Button, TextField, ToggleButton, ToggleButtonGroup} from "@mui/material";
// import { TreeViewBaseItem } from '@mui/x-initialTree-view/models';
import {RichTreeView} from '@mui/x-tree-view/RichTreeView';

// Debugging
// const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
//     {
//         id: 'grid',
//         label: 'G1',
//         children: [
//             {
//                 id: 'grid-community',
//                 label: '@mui/x-data-grid',
//                 children: [
//                     {id: 'test1', label: 'Testing children'},
//                 ],
//             },
//             { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
//             { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
//         ],
//     },
//     {
//         id: 'pickers',
//         label: 'Date and Time Pickers',
//         children: [
//             { id: 'pickers-community', label: '@mui/x-date-pickers' },
//             { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
//         ],
//     },
//     {
//         id: 'charts',
//         label: 'Charts',
//         children: [{ id: 'charts-community', label: '@mui/x-charts' }],
//     },
//     {
//         id: 'initialTree-view',
//         label: 'Tree View',
//         children: [{ id: 'initialTree-view-community', label: '@mui/x-initialTree-view' }],
//     },
// ];

// Layouting elements with the Dagre library
const getLayoutedElements = (nodes: any[], edges: any[], options: { direction: any; }) => {
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({rankdir: options.direction});

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

            return {...node, position: {x, y}};
        }),
        edges,
    };
};

// Node interface to work with the nodes from nodes\index.ts
interface Node {
    id: string;
    position: { x: number, y: number };
    data: { label: string };
    type?: string;
}

// Edge interface to work with the nodes from edges\index.ts
interface Edge {
    id: string;
    source: string;
    target: string;
    animated: boolean;
}

// Definition of the stree structure
interface TreeNode {
    node: Node;
    children: TreeNode[];
}

// Definition of another initialTree structure to work with RichTrees in MUI
interface DesiredNode {
    id: string;
    label: string;
    children?: DesiredNode[];
}

// Function that converts the previous initialTree structure into the MUI structure, to show them in RichTreeView
function convertTreeNodeToDesiredNode(treeNode: TreeNode): DesiredNode {
    const {node, children} = treeNode;
    const desiredNode: DesiredNode = {
        id: node.id,
        label: node.data.label,
        children: children.length > 0 ? children.map(convertTreeNodeToDesiredNode) : undefined
    };

    // Eliminate the children property if it's empty or undefined
    if (!desiredNode.children || desiredNode.children.length === 0) {
        delete desiredNode.children;
    }

    return desiredNode;
}

// Function to build the initialTree
function buildTree(nodes: Node[], edges: Edge[]): TreeNode[] {
    // Creating a map of nodes with the field children initialized as an empty array
    const nodeMap = new Map<string, TreeNode>(
        nodes.map(node => [node.id, {node, children: []}])
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

// Function to transform the initialTree to text, and show it in the text box on the left pane.
function treeToText(tree: TreeNode[], level: number = 0): string {
    const baseIndent = '  ';
    let result = '';

    for (const treeNode of tree) {
        const idFirstChar = treeNode.node.id.charAt(0);
        const needsSpecialIndent = (idFirstChar === 'C' || idFirstChar === 'A' || idFirstChar === 'J');

        // Determinar la indentación actual
        const indentLevel = (needsSpecialIndent && level > 0) ? level - 1 : level;
        const actualIndent = (indentLevel === 0 && needsSpecialIndent) ? '' : baseIndent.repeat(indentLevel);

        result += `${actualIndent}- ${treeNode.node.id}: ${treeNode.node.data.label}\n`;

        if (treeNode.children.length > 0) {
            result += treeToText(treeNode.children, level + 1);
        }
    }

    return result;
}

// Function to convert text to initialTree TODO fix the function
function textToTree(text: string): TreeNode[] {
    const lines = text.split('\n');
    const tree: TreeNode[] = [];
    const nodesById: { [id: string]: TreeNode } = {};
    const stack: { level: number, node: TreeNode }[] = [];

    const indentLevel = (line: string) => line.match(/^ */)![0].length / 2;

    for (const line of lines) {
        const match = line.match(/^( *)- (\w+): (.+)$/);
        if (!match) continue;

        const [_, indent, id, label] = match;
        const level = indentLevel(indent);

        const newNode: TreeNode = {
            node: {
                id,
                position: { x: 0, y: 0 },  // Asignar la posición según sea necesario
                data: { label }
            },
            children: []
        };

        nodesById[id] = newNode;

        // Encontrar el nodo padre adecuado
        let parent: TreeNode | undefined;

        if (['C', 'A', 'J'].includes(id.charAt(0))) {
            // Buscar el nodo padre en el mismo nivel de indentación que no empiece por 'C', 'A' o 'J'
            for (let i = stack.length - 1; i >= 0; i--) {
                if (stack[i].level === level && !['C', 'A', 'J'].includes(stack[i].node.node.id.charAt(0))) {
                    parent = stack[i].node;
                    break;
                }
            }
        } else {
            // Buscar el nodo padre en un nivel de indentación menor que tampoco empiece por 'C', 'A', o 'J'
            for (let i = stack.length - 1; i >= 0; i--) {
                if (stack[i].level < level && !['C', 'A', 'J'].includes(stack[i].node.node.id.charAt(0))) {
                    parent = stack[i].node;
                    break;
                }
            }
        }

        if (parent) {
            parent.children.push(newNode);
        } else if (level === 0) {
            tree.push(newNode);
        }

        stack.push({ level, node: newNode });
    }

    return tree;
}

// Debugging
let initialTree = buildTree(initialNodes, initialEdges);
let richTree = initialTree.map(convertTreeNodeToDesiredNode);




export default function App() {
    const [view, setView] = useState('textField'); // Estado para manejar la vista actual
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const [initialAssuranceText, setInitialAssuranceText] = useState(treeToText(initialTree));

    const onConnect: OnConnect = useCallback(
        (connection) => setEdges((edges) => addEdge(connection, edges)),
        [setEdges]
    );

    const handleViewChange = (_event: any, newView: SetStateAction<string> | null) => {
        if (newView !== null) {
            setView(newView);
        }
    };

    const clearNodes = () => {
        setNodes([]);
    };

    const clearEdges = () => {
        setEdges([])
    };

    // Helper function to recursively generate edges from a tree
    const generateEdgesFromNodes = (nodes: TreeNode[], edges: Edge[] = [], parentId?: string): void => {
        for (const node of nodes) {
            if (parentId) {
                // Create an edge from the parent node to the current node
                edges.push({
                    id: `edge-${parentId}-${node.node.id}`,
                    source: parentId,
                    target: node.node.id,
                    animated: true, // Or false depending on your preference
                });
            }

            // Recursively generate edges for child nodes
            if (node.children.length > 0) {
                generateEdgesFromNodes(node.children, edges, node.node.id);
            }
        }
    };

    // Main function to get edges from an array of tree nodes
    const addEdgesFromTree = (nodes: TreeNode[]): Edge[] => {
        const edges: Edge[] = [];
        generateEdgesFromNodes(nodes, edges);
        return edges;
    };

    function addNodesFromTree(tree: TreeNode[]) {
        const createNodesFromTree = (nodes: TreeNode[]): Node[] => {
            return nodes.flatMap(node => [
                {
                    id: node.node.id,
                    data: node.node.data,
                    position: node.node.position,
                    type: node.node.type
                },
                ...createNodesFromTree(node.children)
            ]);
        };

        const newNodes = createNodesFromTree(tree);
        setNodes(newNodes);
    }

    function replaceTree(tree: TreeNode[]) {
        clearNodes(); // Deletes al nodes
        addNodesFromTree(tree); // Adds new nodes based on the new Tree
        clearEdges(); // Deletes all edges
        const newEdges = addEdgesFromTree(tree); // Adds new edges based on the new Tree
        setEdges(newEdges);
    }

    const handleReloadButton = (_event: any) => {
        const newTree = textToTree(initialAssuranceText);
        replaceTree(newTree);
        richTree = newTree.map(convertTreeNodeToDesiredNode);
    };

    const printNodes = () => {
        //console.log(JSON.stringify(nodes, null, 2));
        //console.log(JSON.stringify(edges, null, 2));
    }

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
                <ToggleButtonGroup
                    value={view}
                    exclusive
                    onChange={handleViewChange}
                    aria-label="view selection"
                >
                    <ToggleButton value="textField" aria-label="TextField">
                        Text view
                    </ToggleButton>
                    <ToggleButton value="richTreeView" aria-label="RichTreeView">
                        Tree view
                    </ToggleButton>
                </ToggleButtonGroup>
                {view === 'textField' && (
                    <TextField
                        id="AssuranceText"
                        multiline={true}
                        fullWidth
                        minRows={15}
                        maxRows={45}
                        variant="outlined"
                        value={initialAssuranceText}
                        onChange={(e) => setInitialAssuranceText(e.target.value)}
                        onKeyDown={handleTab}
                    />
                )}
                {view === 'richTreeView' && <RichTreeView items={richTree} onChange={handleReloadButton}/>}
                <h5></h5>
                <Button variant="outlined" onClick={handleReloadButton}>Reload changes</Button>
                <Button variant="outlined" onClick={printNodes}>Print</Button>
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
