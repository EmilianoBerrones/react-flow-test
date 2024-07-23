import {
    addEdge,
    Background,
    Controls,
    MarkerType,
    MiniMap,
    OnConnect,
    ReactFlow,
    useEdgesState,
    useNodesState,
    ReactFlowProvider
} from "reactflow";
import Dagre from '@dagrejs/dagre'

import {SetStateAction, useCallback, useEffect, useState} from "react";

import "reactflow/dist/style.css";
import "./updatenode.css";

import {initialNodes, nodeTypes} from "./nodes";
import {edgeTypes, initialEdges} from "./edges";
import {Button, Grid, TextField, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {RichTreeView} from '@mui/x-tree-view/RichTreeView';
import FlagCircleIcon from '@mui/icons-material/FlagCircle';
import {ArrowCircleLeftOutlined, FlagCircleOutlined} from "@mui/icons-material";


// Layouting elements with the Dagre library
const getLayoutedElements = (nodes: any[], edges: any[], options: { direction: any }) => {
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({
        rankdir: options.direction,
        nodesep: 150,  // Increase node separation
        ranksep: 200, // Increase rank separation
    });

    nodes.forEach((node) => {
        const width = node.measured?.width ?? 172; // Provide default width if not available
        const height = node.measured?.height ?? 36; // Provide default height if not available
        g.setNode(node.id, {width, height});
    });

    edges.forEach((edge) => g.setEdge(edge.source, edge.target));

    Dagre.layout(g);

    nodes.forEach((node) => {
        const position = g.node(node.id);
        node.position = {
            x: position.x - (node.measured?.width ?? 172) / 2,
            y: position.y - (node.measured?.height ?? 36) / 2
        };
    });

    return {nodes, edges};
};

// INTERFACES
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
    type?: string;
    markerEnd?: {
        type: MarkerType,
        width: number,
        height: number,
        color: string,
    };
    style?: {
        stroke: string,
    }
}

// Arrow styles for the edges
const arrowMarker = {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: 'black',
}
const arrowFill = {stroke: 'black'}
const arrowMarkerEmpty = {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    outlined: true,
    color: 'grey',
}
const arrowFillEmpty = {stroke: 'grey'}

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

// Function that converts the previous initialTree structure into the MUI RichTree structure, to show them in RichTreeView
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

const defaultIndent = 2;
let defaultSpace = "";
for (let i = 0; i < defaultIndent; i++) {
    defaultSpace += " ";
}

// Function to transform the initialTree to text, and show it in the text box on the left pane.
function treeToText(tree: TreeNode[], level: number = 0): string {
    const baseIndent = defaultSpace;
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

// Function to convert text to initialTree
function textToTree(text: string): TreeNode[] {
    const lines = text.split('\n');
    const tree: TreeNode[] = [];
    const nodesById: { [id: string]: TreeNode } = {};
    const stack: { level: number, node: TreeNode }[] = [];

    const indentLevel = (line: string) => line.match(/^ */)![0].length / defaultIndent;

    for (const line of lines) {
        const match = line.match(/^( *)- (\w+): (.+)$/);
        if (!match) continue;

        const [_, indent, id, label] = match;
        const level = indentLevel(indent);

        const newNode: TreeNode = {
            node: {
                id,
                position: {x: 0, y: 0},  // Positions start at zero. Dagre changes the positions.
                data: {label}
            },
            children: []
        };
        nodesById[id] = newNode;

        // Find the correct parent node
        let parent: TreeNode | undefined;

        // Checks if the node is an Assumption, Justification or Context, so that the indentation rules can be
        // reflected in the tree.
        if (['C', 'A', 'J'].includes(id.charAt(0))) {
            // Search for the correct parent node that does not start with 'C', 'A' or 'J' in its id.
            for (let i = stack.length - 1; i >= 0; i--) {
                if (stack[i].level === level && !['C', 'A', 'J'].includes(stack[i].node.node.id.charAt(0))) {
                    parent = stack[i].node;
                    break;
                }
            }
        } else {
            // Search for the parent node in an indentation level lower. The parent node must not include  'C', 'A', or
            // 'J' in its id.
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

        stack.push({level, node: newNode});
    }
    return tree;
}

// TODO make function that cleans the text in textfield. So that the nodes are not repeated
// COMPLETE make custom nodes with the correct design and content.
// TODO make custom edge with outlined arrow
// TODO possible add ons:
// TODO - Indentation modifier
// TODO - Node searcher
// TODO - Header bar
// TODO - Highlight active node in text.
// TODO - Node grid to insert it on the field.
// Creation of initial Tree and initial Rich Tree to display them.
let initialTree = buildTree(initialNodes, initialEdges);
let richTree = initialTree.map(convertTreeNodeToDesiredNode);

export default function App() {
    const [view, setView] = useState('textField'); // Estado para manejar la vista actual
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    // Creation of initial assurance case text
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

    // Functions to clear the nodes and edges so they can be redrawn.
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
                let animation = false;
                let defaultArrow = arrowMarker;
                let defaultFill = arrowFill;
                if (node.node.id[0] === 'C' || node.node.id[0] === 'A' || node.node.id[0] === 'J') {
                    animation = true
                    defaultArrow = arrowMarkerEmpty;
                    defaultFill = arrowFillEmpty;
                }
                edges.push({
                    id: `edge-${parentId}-${node.node.id}`,
                    source: parentId,
                    target: node.node.id,
                    animated: animation, // Or false depending on your preference
                    type: 'step',
                    markerEnd: defaultArrow,
                    style: defaultFill,
                });
            }

            // Recursively generate edges for child nodes
            if (node.children.length > 0) {
                generateEdgesFromNodes(node.children, edges, node.node.id);
            }
        }
    };

    // Main function to get edges from an array of tree nodes given as parameter.
    const addEdgesFromTree = (nodes: TreeNode[]): Edge[] => {
        const edges: Edge[] = [];
        generateEdgesFromNodes(nodes, edges);
        return edges;
    };

    // Main function to add the nodes from a tree structure given as parameter
    function addNodesFromTree(tree: TreeNode[]) {
        const createNodesFromTree = (nodes: TreeNode[]): Node[] => {
            return nodes.flatMap(node => [
                {
                    id: node.node.id,
                    data: node.node.data,
                    position: node.node.position,
                    type: defineTypeOfNode(node.node.id)
                },
                ...createNodesFromTree(node.children)
            ]);
        };

        const newNodes = createNodesFromTree(tree);
        // Layout them with Dagre before drawing them
        const {nodes: layoutedNodes} = getLayoutedElements(newNodes, edges, {direction: 'TB'});
        setNodes(layoutedNodes);
    }

    // Helper function to return the correct type of node depending on its id.
    function defineTypeOfNode(id: string) {
        if (id.startsWith('S')) {
            if (id.includes('Sn')) {
                return 'solution';
            } else return 'strategy';
        } else {
            switch (id.charAt(0)) {
                case 'G':
                    return 'goal';
                case 'C':
                    return 'context';
                case 'A':
                    return 'assumption';
                case 'J':
                    return 'justification';
                default:
                    return 'default';
            }
        }
    }

    // Function to replace the previous tree with the new one given as parameter.
    function replaceTree(tree: TreeNode[]) {
        clearNodes(); // Deletes al nodes
        addNodesFromTree(tree); // Adds new nodes based on the new Tree
        clearEdges(); // Deletes all edges
        const newEdges = addEdgesFromTree(tree); // Adds new edges based on the new Tree
        setEdges(newEdges);
    }

    // Function to reflect the new nodes and edges after the assurance text is modified.
    const handleReloadButton = (_event: any) => {
        const newTree = textToTree(initialAssuranceText);
        replaceTree(newTree);
        richTree = newTree.map(convertTreeNodeToDesiredNode);
    };

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

    const debugButton = () => {
        console.log(nodes)
        console.log(edges)
        console.log(JSON.stringify(richTree, null, 2))
    }

    const handleIndent = () => {
        console.log("Hola")
    }

    useEffect(() => {
        const layoutedElements = getLayoutedElements(nodes, edges, {direction: 'TB'});
        setNodes([...layoutedElements.nodes]);
        setEdges([...layoutedElements.edges]);
    }, [nodes.length, edges.length]);

    // HTML section of the code. 
    return (
        <ReactFlowProvider>
            <div className="app-container">
                <meta name="viewport" content="initial-scale=1, width=device-width"/>
                <div className="left-pane">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <h1>ProjectName</h1>
                        </Grid>
                        <Grid item xs={12}>
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
                        </Grid>
                        <Grid item xs={12}>
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
                            {view === 'richTreeView' && <RichTreeView items={richTree} slots={{
                                expandIcon: FlagCircleIcon,
                                collapseIcon: FlagCircleOutlined,
                                endIcon: ArrowCircleLeftOutlined
                            }}/>}
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant="outlined" onClick={handleReloadButton}>Reload changes</Button>
                            <Button variant="outlined" onClick={debugButton}>PRINT</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField variant="outlined" onChange={handleIndent} label="Spacing"></TextField>
                        </Grid>
                    </Grid>
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
        </ReactFlowProvider>
    );
}
