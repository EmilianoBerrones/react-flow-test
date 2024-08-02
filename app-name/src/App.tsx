import {
    Background,
    Controls,
    MarkerType,
    MiniMap,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
} from "reactflow";
import Dagre from '@dagrejs/dagre'

import React, {SetStateAction, useCallback, useEffect, useRef, useState} from "react";

import "reactflow/dist/style.css";
import "./updatenode.css";
import FormDialog from "./FormDialog";
import {useDialog} from "./DialogContext";

import {initialNodes, nodeTypes} from "./nodes";
import {edgeTypes, initialEdges} from "./edges";
import {
    AppBar,
    Button,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Toolbar,
    Typography
} from "@mui/material";
import {RichTreeView} from '@mui/x-tree-view/RichTreeView';
import FlagCircleIcon from '@mui/icons-material/FlagCircle';
import {ArrowCircleLeftOutlined, FlagCircleOutlined} from "@mui/icons-material";


// Layouting elements with the Dagre library
const getLayoutedElements = (nodes: any[], edges: any[], options: { direction: any }) => {
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({
        rankdir: options.direction,
        nodesep: 200,  // Increase node separation
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
    data: { label: string, id: string };
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
const arrowMarkerEmpty = 'custom-marker';
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

// Function that assigns a unique Id to a node, given a tree parameter
const assignUniqueIdsToTree = (trees: TreeNode[]): TreeNode[] => {
    const idCount: { [key: string]: number } = {};

    const assignUniqueIdsRecursive = (treeNode: TreeNode): TreeNode => {
        const baseId = treeNode.node.data.id;
        if (!idCount[baseId]) {
            idCount[baseId] = 1;
        } else {
            idCount[baseId]++;
        }
        treeNode.node.id = `${baseId}sub${idCount[baseId]}`;

        // Recorrer los hijos de manera recursiva
        if (treeNode.children) {
            treeNode.children = treeNode.children.map(child => assignUniqueIdsRecursive(child));
        }

        return treeNode;
    };

    return trees.map(tree => assignUniqueIdsRecursive(tree));
};

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

        result += `${actualIndent}- ${treeNode.node.data.id}: ${treeNode.node.data.label}\n`;

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
                data: {label, id}
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
    return assignUniqueIdsToTree(tree);
}

// COMPLETED make custom edge with outlined arrow
// COMPLETED handle tabulations in textfield
// COMPLETE make custom nodes with the correct design and content.
// COMPLETE clean custom nodes' outline
// COMPLETED export current tree to JSON format, and save the file.
// COMPLETED add maxwidth values to CSS nodes.
// COMPLETED add types of nodes undeveloped, uninstantiated, and undeveloped and uninstantiated.
// COMPLETED implement repeatable IDs
// COMPLETED reflect changes from the diagram to the text format
// TODO reflect label change on diagram to text.
// TODO notify the user when the text does not have the specified structure
// TODO - DANI - Design and implement the header bar

// TODO possible add ons:
// COMPLETE - Indentation modifier
// TODO PENDING REVIEW - Import from JSON
// TODO - Node searcher
// TODO PENDING REVIEW - Export to SVG, JPEG/PNG
// TODO - Highlight active node in text and/or tree.
// TODO - Node selector to insert it on the field
// TODO - Auto indent text
// TODO - See unique IDs instead of label IDs

// Creation of initial Tree and initial Rich Tree to display them.
let initialTree = buildTree(initialNodes, initialEdges);
let richTree = initialTree.map(convertTreeNodeToDesiredNode);
let copyOfText = treeToText(initialTree);

export default function App() {
    const [view, setView] = useState('textField'); // Estado para manejar la vista actual
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const labels = useRef<string[]>(nodes.map(node => node.data.label));
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    // Parameters to create nodes on edge drop
    const connectingNodeId = useRef(null);
    const {openDialog, formData, setFormData, isOpen} = useDialog();

    // Creation of initial assurance case text
    const [initialAssuranceText, setInitialAssuranceText] = useState(treeToText(initialTree));
    const [indent, setIndent] = useState(defaultIndent);

    const onConnect = useCallback(() => {
        // reset the start node on connections
        console.log(connectingNodeId);
        connectingNodeId.current = null;
    }, []);

    const onConnectStart = useCallback((_: any, {nodeId}: any) => {
        connectingNodeId.current = nodeId;
    }, []);

    const onConnectEnd = useCallback(
        (event: any) => {
            if (!connectingNodeId.current) return;
            const targetIsPane = event.target.classList.contains('react-flow__pane');
            if (targetIsPane) {
                openDialog();
            }
        }, []
    );

    React.useEffect(() => {
        if (!isOpen && formData) {
            const newNodeInfo = formData.split(',');
            const newNodeId = newNodeInfo[0];
            const newNodeLabel = newNodeInfo[1];
            const type = defineTypeOfNode(newNodeId);
            const newNode = {
                id: newNodeId,
                type: type,
                position: {x: 0, y: 0},
                data: {label: newNodeLabel, id: newNodeId},
            }
            let edgeId = `edge-${connectingNodeId.current}-${newNode.id}`;
            let edgeSource = connectingNodeId.current;
            let edgeTarget = newNode.id;
            const newEdge = {
                id: edgeId,
                source: edgeSource,
                target: edgeTarget,
                animated: false,
                type: 'step',
                markerEnd: arrowMarker,
                style: arrowFill
            }
            const newNodes = nodes.concat(newNode);
            const newEdges = edges.concat(newEdge);
            const newTree = buildTree(newNodes, newEdges);
            const uniqueTree = assignUniqueIdsToTree(newTree);
            replaceTree(uniqueTree);
            richTree = uniqueTree.map(convertTreeNodeToDesiredNode);
            setInitialAssuranceText(treeToText(uniqueTree));
            connectingNodeId.current = null;
            setFormData('');
        }
        if (copyOfText !== initialAssuranceText) {
            handleReloadButton();
            copyOfText = initialAssuranceText;
        }
        if (copyOfText === initialAssuranceText) {
            const actualLabels = nodes.map(node => node.data.label);
            const labelsRef = labels.current;
            if (labelsRef.length !== actualLabels.length) {
                handleReloadAdvanced(actualLabels);
            } else {
                for (let i = 0; i < labelsRef.length; i++) {
                    if (labelsRef[i] !== actualLabels[i]) {
                        handleReloadAdvanced(actualLabels);
                    }
                }
            }
        }
        // automate label change
    }, [formData, isOpen, initialAssuranceText, nodes]);


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
                const animation = false;
                let defaultArrow: any = arrowMarker;
                let defaultFill = arrowFill;
                if (node.node.id[0] === 'C' || node.node.id[0] === 'A' || node.node.id[0] === 'J') {
                    defaultArrow = arrowMarkerEmpty;
                    defaultFill = arrowFillEmpty;
                }
                edges.push({
                    id: `edge-${parentId}-${node.node.id}`,
                    source: parentId,
                    target: node.node.id,
                    animated: animation,
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

        // Layout them with Dagre before drawing them
        return createNodesFromTree(tree);
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
        clearEdges(); // Deletes all edges
        const newNodes = addNodesFromTree(tree); // Adds new nodes based on the new Tree
        const newEdges = addEdgesFromTree(tree); // Adds new edges based on the new Tree
        // Layout them with Dagre before drawing them
        const layoutedElements = getLayoutedElements(newNodes, newEdges, {direction: 'TB'});
        setNodes([...layoutedElements.nodes]);
        setEdges([...layoutedElements.edges]);
    }

    // Function to reflect the new nodes and edges after the assurance text is modified.
    const handleReloadButton = (_event: any) => {
        // console.log(copyOfText);
        // console.log(initialAssuranceText);
        let found = false;
        if (copyOfText === initialAssuranceText) {
            const actualLabels = nodes.map(node => node.data.label);
            const labelsRef = labels.current;
            if (labelsRef.length !== actualLabels.length) {
                const newTree = buildTree(nodes, edges);
                const uniqueTree = assignUniqueIdsToTree(newTree);
                replaceTree(uniqueTree);
                richTree = uniqueTree.map(convertTreeNodeToDesiredNode);
                setInitialAssuranceText(treeToText(uniqueTree));
                labels.current = actualLabels;
                found = true;
            } else {
                for (let i = 0; i < labelsRef.length; i++) {
                    if (labelsRef[i] !== actualLabels[i]) {
                        const newTree = buildTree(nodes, edges);
                        const uniqueTree = assignUniqueIdsToTree(newTree);
                        replaceTree(uniqueTree);
                        richTree = uniqueTree.map(convertTreeNodeToDesiredNode);
                        setInitialAssuranceText(treeToText(uniqueTree));
                        labels.current = actualLabels;
                        found = true;
                    }
                }
            }
        }
        if (!found) {
            const newTree = textToTree(replaceTabsWithSpaces(initialAssuranceText));
            replaceTree(newTree);
            richTree = newTree.map(convertTreeNodeToDesiredNode);
        }
    };

    const handleReloadAdvanced = (actualLabels: string[]) => {
        const newTree = buildTree(nodes, edges);
        const uniqueTree = assignUniqueIdsToTree(newTree);
        replaceTree(uniqueTree);
        richTree = uniqueTree.map(convertTreeNodeToDesiredNode);
        setInitialAssuranceText(treeToText(uniqueTree));
        labels.current = actualLabels;
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

    function replaceTabsWithSpaces(input: string, spacesPerTab: number = 8): string {
        if (!input.includes('\t')) {
            return input;
        }
        const spaces = ' '.repeat(spacesPerTab);
        return input.replace(/\t/g, spaces);
    }

    // Clean the text to add the hyphens.
    function addHyphenToText(texto: string): string {
        // Dividir el texto en líneas
        const lineas = texto.split('\n');

        // Transformar cada línea para agregar "- " antes de la primera mayúscula si no hay uno ya
        const lineasConGuiones = lineas.map(linea => {
            // Encontrar la posición de la primera letra mayúscula
            const indicePrimeraMayuscula = linea.search(/[A-Z]/);

            if (indicePrimeraMayuscula !== -1) {
                // Verificar si antes de la primera mayúscula ya hay un "- "
                const antesPrimeraMayuscula = linea.slice(0, indicePrimeraMayuscula);
                if (antesPrimeraMayuscula.includes("- ")) {
                    // Si ya hay un "- " antes de la primera mayúscula, devolver la línea como está
                    return linea;
                } else {
                    // Insertar "- " justo antes de la primera mayúscula
                    return antesPrimeraMayuscula + "- " + linea.slice(indicePrimeraMayuscula);
                }
            } else {
                // Si no hay letra mayúscula, devolver la línea como está
                return linea;
            }
        });

        // Unir las líneas de nuevo en un solo string
        return lineasConGuiones.join('\n');
    }

    const handleChangeIndent = (event: SelectChangeEvent) => {
        setIndent(parseInt(event.target.value));
    }

    const exportToJSON = () => {
        const blob = new Blob([JSON.stringify(richTree, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'nodes.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    const debug = () => {
        console.log(JSON.stringify(labels, null, 2));
    }

    useEffect(() => {
        const layoutedElements = getLayoutedElements(nodes, edges, {direction: 'TB'});
        setNodes([...layoutedElements.nodes]);
        setEdges([...layoutedElements.edges]);
    }, [nodes.length, edges.length]);

    // HTML section of the code. 
    return (
        <>
            <svg
                style={{display: 'inline-flex', position: 'absolute'}}
            >
                <marker
                    id="custom-marker"
                    viewBox="0 0 25 25"
                    markerHeight={15}
                    markerWidth={15}
                    refX={12}
                    refY={5}
                    orient="180"
                >
                    <path fill="grey"
                          d="M3.8 20q-.575 0-.875-.513t.025-1.012l8.2-13.125q.3-.475.85-.475t.85.475l8.2 13.125q.325.5.025 1.013T20.2 20zm1.8-2h12.8L12 7.75zm6.4-5.125">
                    </path>
                </marker>
            </svg>
            <ReactFlowProvider>
                <div className="app-container">
                    <meta name="viewport" content="initial-scale=1, width=device-width"/>
                    <AppBar position="fixed" color={"transparent"} style={{height: '7vh'}}>
                        <Toolbar>
                            <IconButton
                                size="large"
                                edge="start"
                                color="primary"
                                aria-label="menu"
                                sx={{mr: 2}}
                            >
                                <FlagCircleIcon/>
                            </IconButton>
                            <Typography variant="h6" component="div" sx={{flexGrow: 1}} color="primary">
                                ProjectName
                            </Typography>
                            <Button color="primary">Options</Button>
                        </Toolbar>
                    </AppBar>
                    <Grid container direction="row" spacing={0}
                          style={{marginTop: '8vh', minHeight: '92vh', maxHeight: '93vh'}}>
                        <Grid item xs={4} padding="30px" style={{minHeight: '100%', maxHeight: 'inherit'}}>
                            <Grid container direction="column" spacing={2}
                                  style={{minHeight: 'inherit', maxHeight: 'inherit'}} justifyContent="center">
                                <Grid item xs={1}>
                                    <h1>ProjectName</h1>
                                    <Divider></Divider>
                                </Grid>
                                <Grid item xs={1}>
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
                                <Grid item xs style={{maxHeight: '60vh', overflowY: 'auto'}}>
                                    <Grid container direction="column" spacing={1} justifyContent="flex-start"
                                          height="100%" maxHeight="100%" maxWidth="100%">
                                        <Grid item xs="auto">
                                            {view === 'textField' && (
                                                <TextField
                                                    id="AssuranceText"
                                                    multiline={true}
                                                    fullWidth
                                                    minRows={15}
                                                    maxRows={15}
                                                    variant="outlined"
                                                    value={addHyphenToText(initialAssuranceText)}
                                                    onChange={(e) => setInitialAssuranceText(e.target.value)}
                                                    onKeyDown={handleTab}
                                                />
                                            )}
                                            {view === 'richTreeView' && (
                                                <div style={{maxHeight: '55vh', overflowY: 'auto'}}>
                                                    <RichTreeView
                                                        items={richTree}
                                                        slots={{
                                                            expandIcon: FlagCircleIcon,
                                                            collapseIcon: FlagCircleOutlined,
                                                            endIcon: ArrowCircleLeftOutlined
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Button variant="outlined" onClick={handleReloadButton}>Reload
                                                changes</Button>
                                            <Button variant="outlined" onClick={exportToJSON}>Export graph to
                                                JSON</Button>
                                            <Button variant="outlined" onClick={debug}>Print</Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={1}>
                                    <FormControl fullWidth>
                                        <InputLabel id="indentSelect">Indentation</InputLabel>
                                        <Select
                                            value={indent.toString()}
                                            label="Indent"
                                            onChange={handleChangeIndent}
                                        >
                                            <MenuItem value={2}>Two spaces</MenuItem>
                                            <MenuItem value={4}>Four spaces</MenuItem>
                                            <MenuItem value={8}>Tabulations</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={8} style={{minHeight: '92vh'}}>
                            <Grid container style={{minHeight: "inherit"}}>
                                <FormDialog/>
                                <ReactFlow
                                    nodes={nodes}
                                    nodeTypes={nodeTypes}
                                    onNodesChange={onNodesChange}
                                    edges={edges}
                                    edgeTypes={edgeTypes}
                                    onEdgesChange={onEdgesChange}
                                    onConnect={onConnect}
                                    onConnectStart={onConnectStart}
                                    onConnectEnd={onConnectEnd}
                                    fitView
                                    style={{minHeight: "inherit"}}
                                >
                                    <Background/>
                                    <MiniMap/>
                                    <Controls/>
                                </ReactFlow>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </ReactFlowProvider>
        </>
    );
}
