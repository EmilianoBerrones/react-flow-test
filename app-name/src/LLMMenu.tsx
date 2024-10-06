import { 
    Box, 
    TextField, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    Typography, 
    Button, 
    Slider,
    Modal, 
    Accordion,
    AccordionDetails,
    AccordionSummary,
    } from '@mui/material';

import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';

import { useNavigate } from 'react-router-dom';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Inventory from '@mui/icons-material/Inventory';
import Chip from '@mui/material/Chip';

import {
    Background,
    ReactFlow,
    ReactFlowProvider,
    useNodesState,
    MarkerType,
    useEdgesState,
    addEdge,
    BackgroundVariant,
    Controls,
    useReactFlow
} from "reactflow";

import React, { useState, useCallback, useRef, useEffect } from "react";
import "reactflow/dist/style.css";
import "./updatenode.css";

import Dagre from '@dagrejs/dagre'

import {
    AppBar, Avatar, IconButton, Menu, Toolbar, Tooltip, Divider, ListItemIcon
} from "@mui/material";
import { Logout, ExpandMore, Menu as MenuIcon } from "@mui/icons-material";

import {initialNodes, nodeTypes} from "./nodes";
import {initialEdges, edgeTypes} from "./edges";

import {startsWith} from 'lodash';

import {useDialog} from "./DialogContext";

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

interface Node {
    id: string;
    position: { x: number, y: number };
    data: { label: string, id: string };
    type?: string;
    hidden?: boolean;
}

const arrowMarker = {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: 'black',
}

const arrowFill = {stroke: 'black'}
const arrowMarkerEmpty = 'custom-marker';
const arrowFillEmpty = {stroke: 'grey'}

interface TreeNode {
    node: Node;
    children: TreeNode[];
}

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
}

interface DesiredNode {
    id: string;
    label: string;
    children?: DesiredNode[];
}

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

let initialTree = buildTree(initialNodes, initialEdges);
// @ts-ignore
let richTree = initialTree.map(convertTreeNodeToDesiredNode);

function LLMMenu() {
    const [userPrompt, setUserPrompt] = useState('');
    const [assistantResponse, setAssistantResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedModel, setSelectedModel] = useState('gpt-4o'); // Default to gpt-4o
    const [temperature, setTemperature] = useState(1); // Default temperature to 1
    const [maxTokens, setMaxTokens] = useState(4000); // Default max tokens to 4000
    const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);
    const [projectMenuAnchorEl, setProjectMenuAnchorEl] = useState<null | HTMLElement>(null);
    const isProjectMenuOpen = Boolean(projectMenuAnchorEl);
    const [anchorLogin, setAnchorLogin] = useState<null | HTMLElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const connectingNodeId = useRef(null);
    const [edgeType] = useState('step');
    const {openDialog} = useDialog();
    // @ts-ignore
    const [invalidConnectingNodeAlert, setInvalidConnectingNodeAlert] = useState(false); // type 1
    // @ts-ignore
    const [nodeConnectOnItselfAlert, setNodeConnectOnItselfAlert] = useState(false); // type 2
    // @ts-ignore
    const [connectionHasParentAlert, setConnectionHasParentAlert] = useState(false); // type 3
    // @ts-ignore
    const [invalidNodeDropAlert, setInvalidNodeDropAlert] = useState(false); // type 4
    const [backgroundShapes] = useState(BackgroundVariant.Dots);
    const [shapeColor] = useState('#777777');
    const [shapeGap] = useState(28);
    const [backgroundPaneColor] = useState('#ffffff');
    const navigate = useNavigate(); // Initialize useNavigate
    const [isValidAssuranceText, setIsValidAssuranceText] = useState(true); // Estado para validar el texto
    const [openModal, setOpenModal] = useState(false);
    const [domainInfo, setDomainInfo] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const [exporting, setExporting] = useState('');

    const {fitView, getViewport, setViewport} = useReactFlow();
    const [projectName, setProjectName] = useState('Project Name'); // State to hold the project name

    const handleProjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProjectName(event.target.value);  // Update the project name state
    };

    const sanitizeFileName = (name: string) => {
        return name.replace(/[^a-z0-9]/gi, '_').toLowerCase(); // Replace non-alphanumeric characters with underscores
    };

    const handleDomainInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDomainInfo(event.target.value);  // Update domainInfo when user types in the TextField
    };

    const handleReloadButton = () => {
        if (!isValidAssuranceText) return;

        // Convert the response text into a tree structure
        const newTree = textToTree(assistantResponse); 

        // Update the graph nodes and edges based on the new tree
        replaceTree(newTree);
    };

    const clearNodes = () => {
        setNodes([]);
    };
    const clearEdges = () => {
        setEdges([])
    };

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

    function addNodesFromTree(tree: TreeNode[]) {
        const createNodesFromTree = (nodes: TreeNode[]): Node[] => {
            return nodes.flatMap(node => [
                {
                    id: node.node.id,
                    data: node.node.data,
                    position: node.node.position,
                    type: defineTypeOfNode(node.node.id),
                    hidden: node.node.hidden,
                },
                ...createNodesFromTree(node.children)
            ]);
        };

        return createNodesFromTree(tree);
    }

    const generateEdgesFromNodes = (nodes: TreeNode[], edges: Edge[] = [], parentId?: string): void => {
        for (const node of nodes) {
            if (parentId) {
                // Create an edge from the parent node to the current node
                const animation = false;
                let defaultArrow: any = arrowMarker;
                // @ts-ignore
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
                    type: edgeType,
                    markerEnd: defaultArrow,
                });
            }

            // Recursively generate edges for child nodes
            if (node.children.length > 0) {
                generateEdgesFromNodes(node.children, edges, node.node.id);
            }
        }
    };

    const addEdgesFromTree = (nodes: TreeNode[]): Edge[] => {
        const edges: Edge[] = [];
        generateEdgesFromNodes(nodes, edges);
        return edges;
    };

    function replaceTree(tree: TreeNode[]) {
        // Clear existing nodes and edges
        clearNodes();
        clearEdges();

        // Create new nodes and edges from the tree
        const newNodes = addNodesFromTree(tree);
        const newEdges = addEdgesFromTree(tree);

        // Layout the elements using Dagre before rendering
        const layoutedElements = getLayoutedElements(newNodes, newEdges, { direction: 'TB' });

        // Update the graph with the new layout
        setNodes([...layoutedElements.nodes]);
        setEdges([...layoutedElements.edges]);
    }


    const hasParentNode = (nodeId: any, tree: TreeNode[]) => {
        for (const node of tree) {
            if (node.children.some(child => child.node.id === nodeId)) {
                console.log(true);
                return true;
            }
            if (hasParentNode(nodeId, node.children)) {
                console.log(true);
                return true;
            }
        }
        return false;
    };

    useEffect(() => {
        const layoutedElements = getLayoutedElements(nodes, edges, {direction: 'TB'});
        setNodes([...layoutedElements.nodes]);
        setEdges([...layoutedElements.edges]);
    }, [nodes.length, edges.length, edgeType]);

    const onConnect = useCallback(() => {
        connectingNodeId.current = null;
    }, []);

    // Function to keep track of the connecting node
    const onConnectStart = useCallback((_: any, {nodeId}: any) => {
        connectingNodeId.current = nodeId;
    }, []);

    const onConnectEnd = useCallback(
        (event: any) => {
            if (!connectingNodeId.current) return;
            const targetIsPane = event.target.classList.contains('react-flow__pane');
            const elements = document.elementsFromPoint(event.clientX, event.clientY);
            const targetNode = elements.find((el) => el.classList.contains('react-flow__node'));

            if (targetNode) {
                const targetNodeId = targetNode.getAttribute('data-id');
                if (targetNodeId) {
                    if (startsWith(connectingNodeId.current, 'C') || startsWith(connectingNodeId.current, 'A') || startsWith(connectingNodeId.current, 'J') || startsWith(connectingNodeId.current, 'Sn')) {
                        // Don't connect if the connecting node is Context, Assumption, Justification or Solution.
                        showInvalidConnectingNodeAlert('type1')
                    } else {
                        // Verifica si el nodo destino ya tiene un nodo padre
                        if (targetNodeId !== connectingNodeId.current) {
                            // @ts-ignore
                            const newTree = buildTree(nodesRef.current, edgesRef.current);
                            let defaultArrow: any = arrowMarker;
                            let defaultFill = arrowFill;
                            if (targetNodeId[0] === 'C' || targetNodeId[0] === 'A' || targetNodeId[0] === 'J') {
                                defaultArrow = arrowMarkerEmpty;
                                defaultFill = arrowFillEmpty;
                            }
                            if (!hasParentNode(targetNodeId, newTree)) {
                                const newEdge = {
                                    id: `edge-${connectingNodeId.current}-${targetNodeId}`,
                                    source: connectingNodeId.current,
                                    target: targetNodeId,
                                    animated: false,
                                    type: edgeType,
                                    markerEnd: defaultArrow,
                                    style: defaultFill,
                                }
                                setEdges((eds) => addEdge(newEdge, eds));
                            } else {
                                showInvalidConnectingNodeAlert('type3');
                            }
                        } else {
                            showInvalidConnectingNodeAlert('type2');
                        }
                    }
                }
            } else if (targetIsPane) {
                if (startsWith(connectingNodeId.current, 'C') || startsWith(connectingNodeId.current, 'A') || startsWith(connectingNodeId.current, 'J') || startsWith(connectingNodeId.current, 'Sn')) {
                    // The dialog does not open if the node starts with 'C', 'A', 'J', or 'Sn'
                    showInvalidConnectingNodeAlert('type1');
                } else {
                    openDialog();
                }
            } else if (!targetIsPane) {
                showInvalidConnectingNodeAlert('type4');
            }
        }, []
    );

    const showInvalidConnectingNodeAlert = (type: string) => {
        switch (type) {
            // consult the types above for the specific alert
            case 'type1':
                setInvalidConnectingNodeAlert(true);
                setTimeout(() => {
                    setInvalidConnectingNodeAlert(false);
                }, 3000);
                break;
            case 'type2':
                setNodeConnectOnItselfAlert(true);
                setTimeout(() => {
                    setNodeConnectOnItselfAlert(false);
                }, 3000);
                break;
            case 'type3':
                setConnectionHasParentAlert(true);
                setTimeout(() => {
                    setConnectionHasParentAlert(false);
                }, 3000);
                break;
            case 'type4':
                setInvalidNodeDropAlert(true);
                setTimeout(() => {
                    setInvalidNodeDropAlert(false);
                }, 3000);
                break;
            default:
                break;
        }
    };

    const handleUserPromptChange = (event: any) => {
        setUserPrompt(event.target.value);
    };

    const handleModelChange = (event: any) => {
        setSelectedModel(event.target.value);
    };

    // @ts-ignore
    const handleTemperatureChange = (_event: any, value: number | number[]) => {
        setTemperature(value as number);
    };

    // @ts-ignore
    const handleMaxTokensChange = (_event: any, value: number | number[]) => {
        setMaxTokens(value as number);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://smartgsnopenai-cb66a3d6a0f4.herokuapp.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: userPrompt,
                    model: selectedModel,
                    temperature: temperature,
                    max_tokens: maxTokens,
                    fullSystemPrompt: fullSystemPrompt
                }),
            });

            if (!response.ok) throw new Error(`Server error: ${response.statusText}`);

            const data = await response.text();
            setAssistantResponse(data);
        } catch (error: any) {
            console.error("Error in fetching data:", error);
            setAssistantResponse("An error occurred: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorMenu(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorMenu(null);
    };

    const handleLoginClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorLogin(event.currentTarget);
    };

    const handleLoginClose = () => {
        setAnchorLogin(null);
    };

    const openLogin = Boolean(anchorLogin);

    const handleTravelClick = () => {
        navigate('/App');
    };
    const handleTravelLogout = () => {
        navigate('/');
    }

    const validateInitialAssuranceText = (text: string) => {
        const isValid = validateStructureFormat(text) && validateSpacingFormat(text);
        setIsValidAssuranceText(isValid); // Actualiza el estado con el resultado
        return isValid;
    };

    function validateSpacingFormat(input: string): boolean {
        const lines = input.split('\n');
        const regex = /^- [A-Za-z0-9_]+: .+$/;

        for (const line of lines) {
            if (!regex.test(line.trim())) {
                return false;
            }
        }
        return true;
    }

    function validateStructureFormat(input: string): boolean {
        const lines = input.split('\n');
        const indentationStack: { nodeId: string, isSnNode: boolean }[] = [];

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine === '') continue; // Saltar líneas vacías

            const indentationLevel = (line.match(/^(\s*)/)?.[0].length || 0) / 2;
            const nodeId = trimmedLine.replace(/^- /, '').split(':')[0].trim();

            // Si el nivel de indentación es menor o igual que el stack, ajustar el stack
            while (indentationStack.length > indentationLevel) {
                indentationStack.pop();
            }

            // Si el nodo actual es un 'Sn', lo marcamos como tal
            const isSnNode = nodeId.startsWith('Sn');

            // Agregar el nodo actual al stack
            indentationStack.push({nodeId, isSnNode});

            // Si el nodo actual no es 'Sn', verificamos si el nodo padre es 'Sn'
            if (!isSnNode && indentationStack.length > 1) {
                const parent = indentationStack[indentationStack.length - 2];
                if (parent.isSnNode) {
                    return false;
                }
            }
        }
        return true;
    }

    const handleAssistantResponseChange = (event: any) => {
        const newText = event.target.value;
        setAssistantResponse(newText);
        validateInitialAssuranceText(newText); // Validate text upon modification
    };

    const toggleExpand = () => {
        setIsExpanded(prev => !prev);
    };

    const exportToJSON = () => {
        const sanitizedProjectName = sanitizeFileName(projectName);

        // A function to recursively build the tree structure
        const buildTree = (nodeId:any, nodes:any, edges:any) => {
            const node = nodes.find((n: any) => n.id === nodeId);
            const children = edges
                .filter((edge: any) => edge.source === nodeId)
                .map((edge: any) => buildTree(edge.target, nodes, edges));

            return {
                id: node.id,
                label: node.data.label, // Assuming node label is in node.data.label
                ...(children.length > 0 ? { children } : {})
            };
        };

        // Find root nodes (nodes that are not the target of any edge)
        const rootNodes = nodes.filter((node: any) =>
            !edges.some((edge: any) => edge.target === node.id)
        );

        // Build the tree for each root node
        const jsonStructure = rootNodes.map((rootNode: any) => buildTree(rootNode.id, nodes, edges));

        // Create and download the JSON
        const blob = new Blob([JSON.stringify(jsonStructure, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${sanitizedProjectName}.json`;  // Use the sanitized project name
        a.click();
        URL.revokeObjectURL(url);
    };
    

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleExport = (format: any) => {
        const sanitizedProjectName = sanitizeFileName(projectName);
        setExporting(format);

        setTimeout(async () => {
            const originalViewport = getViewport();
            fitView();

            const element = document.querySelector('.react-flow') as HTMLElement;
            let dataUrl;

            if (format === 'png') {
                dataUrl = await htmlToImage.toPng(element);
            } else if (format === 'jpeg') {
                dataUrl = await htmlToImage.toJpeg(element);
            } else if (format === 'svg') {
                dataUrl = await htmlToImage.toSvg(element);
            }

            if (dataUrl) {
                download(dataUrl, `${sanitizedProjectName}.${format}`);  // Use the sanitized project name
            }

            setViewport(originalViewport);
            setExporting('');
        }, 100); // Delay to ensure state update
    };

    const handleTravelDetection = () => {
        navigate('/detection');
    };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const preliminaryAC = `You are an assistant who assist in developing an assurance case in a 
tree structure using Goal Structuring Notation (GSN) based on an existing assurance case pattern. 
Your role is to instantiate an assurance case pattern to create an assurance case. I will provide 
you with context information on assurance case and assurance case pattern. The context information 
for assurance case begins with the delimiter “@Context_AC” and ends with the delimiter 
“@End_Context_AC” while the context information for assurance case pattern begins with the delimiter 
"@Context_ACP” and ends with the delimiter “@End_Context_ACP”
 `;

const contextAC = `@Context_AC An assurance case, such as a safety case or security case, can be represented 
using Goal Structuring Notation (GSN), a visual representation that presents the elements of an assurance 
case in a tree structure. The main elements of a GSN assurance case include Goals, Strategies, Solutions 
(evidence), Contexts, Assumptions, and Justifications. Additionally, an assurance case in GSN may include an 
undeveloped element decorator, represented as a hollow diamond placed at the bottom center of a goal or strategy 
element. This indicates that a particular line of argument for the goal or strategy has not been fully 
developed and needs to be further developed.
I will explain each element of an assurance case in GSN so you can generate it efficiently.
1.	Goal: A goal is represented by a rectangle and denoted as G. It represents the claims made in the argument. 
    Goals should contain only claims. For the top-level claim, it should contain the most fundamental objective 
    of the entire assurance case.

2.	Strategy: A strategy is represented by a parallelogram and denoted as S. It describes the reasoning that 
    connects the parent goals and their supporting goals. A Strategy should only summarize the argument approach. 
    The text in a strategy element is usually preceded by phrases such as “Argument by appeal to…”, “Argument by …”, 
    “Argument across …” etc.

3.	Solution: A solution is represented by a circle and denoted as Sn. A solution element makes no claims but are 
    simply references to evidence that provides support to a claim.

4.	Context (Rounded rectangles): In GSN, context is represented by a rounded rectangle and denoted as C. The context 
    element provides additional background information for an argument and the scope for a goal or strategy within an 
    assurance case.

5.	Assumption: An assumption element is represented by an oval with the letter ‘A’ at the top- or bottom-right. It 
    presents an intentionally unsubstantiated statement accepted as true within an assurance case. It is denoted by A.

6.	Justification (Ovals): A justification element is represented by an oval with the letter ‘J’ at the top- or 
    bottom-right. It presents a statement of reasoning or rationale within an assurance case. It is denoted by J. 

@End_Context_AC
 `;

const contextACP = `@Context_ACP Assurance case patterns in GSN (Goal Structuring Notation) are templates that can 
be re-used to create an assurance case. Assurance case patterns encapsulate common structures of argumentation that 
have been found effective for addressing recurrent safety, reliability, or security concerns. An assurance case pattern 
can be instantiated to develop an assurance case by replacing generic information in placeholder decorator with concrete 
or system specific information.
To represent assurance case patterns in GSN format, additional decorators have been provided to support assurance case 
patterns. These additional decorators are used together with the elements of an assurance case to represent assurance 
case pattern. I will explain each additional decorator below to support assurance case pattern in GSN.

1.	Uninstantiated: This decorator denotes that a GSN element remains to be instantiated, i.e. at some later stage, 
    the generic information in placeholders within a GSN element needs to be replaced (instantiated) with a more concrete 
    or system specific information. This decorator can be applied to any GSN element.

2.	 Uninstantiated and Undeveloped: Both decorators of undeveloped and uninstantiated are overlaid to form this decorator. 
    This decorator denotes that a GSN element requires both further development and instantiation. 

3.	Placeholders: This is represented as curly brackets “{}” within the description of an element to allow for customization. 
    The placeholder "{}" should be directly inserted within the description of elements for which the predicate 
    "HasPlaceholder (X)" returns true. The placeholder "{}" can sometimes be empty or contain generic information that will 
    need to be replaced when an assurance case pattern is instantiated. 

4.	Choice: A solid diamond is the symbol for Choice. A GSN choice can be used to denote alternatives in satisfying a 
    relationship or represent alternative lines of argument used to support a particular goal.

5.	Multiplicity: A solid ball is the symbol for multiple instantiations. It represents generalized n-ary relationships 
    between GSN elements. Multiplicity symbols can be used to describe how many instances of one element-type relate to another 
    element.

6.	Optionality: A hollow ball indicates ‘optional’ instantiation. Optionality represents optional and alternative relationships 
    between GSN elements.

The following steps is used to create an assurance case from an Assurance cases pattern.
1.	Create the assurance case using only elements and decorators defined for assurance cases.
2.	Remove all additional assurance case pattern decorators such as (Uninstantiated, Placeholders, Choice, Multiplicity, 
    Optionality, and the combined Uninstantiated and Undeveloped decorator)
3.	Remove the placeholder symbol "{}" and replace all generic information in placeholders “{}” with system specific or 
    concrete information.
@End_Context_ACP
 `;

const defPredicates = `We have defined the following predicate rules for the elements and decorator used in an assurance case 
to ease understanding of an assurance case. The predicate rules for the elements and decorator of an assurance case begins with 
the delimiter “@Predicate_AC” and ends with the delimiter "@End_Predicate_AC”
 `;

const predicateAC = `@Predicate_AC
1.	Goal(G): True if G is a goal within the assurance case. This predicate is represented as Goal (ID, Description) where ID 
    is the unique identifier for the goal, and description is the textual information of the goal.
2.	Strategy(S): True if S is a strategy within the assurance case. This predicate is represented as Strategy (ID, Description) 
    where ID is the unique identifier for the strategy and description is the textual information of the Strategy.
3.	Solution (Sn): True if Sn is evidence within the assurance case. This predicate is represented as Solution (ID, Description) 
    where ID is the unique identifier for the evidence or solution and description is the textual information of the evidence.
4.	Context(C): True if C is a context within the assurance case. This predicate is represented as Context (ID, Description) 
    where ID is the unique identifier for the context and description is the textual information of the context.
5.	Assumption (A): True if A is an assumption within the assurance case. This predicate is represented as Assumption 
    (ID, Description) where ID is the unique identifier for the assumption and description is the textual information of the 
    assumption.
6.	Justification (J): True if J is a justification within the assurance case. This predicate is represented as Justification 
    (ID, Description) where ID is the unique identifier for the justification and description is the textual information of the 
    justification.
7.	Undeveloped(X): True if X is either a Goal(G) or Strategy(S) marked as undeveloped. This predicate is represented as 
    Undeveloped(X), where X can be either a goal or strategy.
@End_Predicate_AC
 `;

const predicateACP = `We have defined the following predicate rules for the additional decorators used to support assurance 
case patterns to ease understanding. The predicate rules for the additional decorators to support assurance case pattern begins 
with the delimiter “@Predicate_ACP” and ends with the delimiter "@End_Predicate_ACP”

@Predicate_ACP
1.	Uninstantiated (X): True if element X (can be any GSN element) is marked as uninstantiated.
2.	UndevelopStantiated (X): True if element X is either a Goal(G) or Strategy(S) and is marked both as uninstantiated and 
    undeveloped.
3.	HasPlaceholder (X): True if element ‘X’ (can be any GSN element) contains a placeholder ‘{}’ within its description that 
    needs instantiation.

4.	HasChoice (X, [Y], Label): True if an element ‘X’ (either a Goal(G) or Strategy(S)) can be supported by selecting among any 
    number of elements in [Y] (where Y can be any GSN element) according to the cardinality specified by an optional Label. 
    The label specifies the cardinality of the relationship between ‘X’ and ‘Y’. A label is of the general form “m of n” 
    (e.g. a label given as “1 of 3” implies an element ‘X’ can be supported by any one of three possible supporting elements in [Y])

5.	HasMultiplicity (X, [Y], Label): True if multiple instances of an element X (either a Goal(G) or Strategy(S)) relate to 
    multiple instances of another element [Y] (where Y can be any GSN element) according to the cardinality specified by an optional 
    Label. The label specifies the cardinality of the relationship between X and Y. (i.e., how many instances of an element in X 
    relates with how many instances of an element in [Y]. e.g. m of n implies m instances of an element in X must be supported by 
    n instances of an element in Y)

6.	 IsOptional (X, [Y], Label): True if an element X (either a Goal(G) or Strategy(S)) can be optionally supported by another 
    element [Y] (where Y can be any GSN element) according to the cardinality specified by an optional Label. The label specifies 
    the cardinality of the relationship between X and Y. (i.e. an instance of an element in X may be supported by another instance 
    of an element in [Y], but it is not required)

@End_Predicate_ACP
 `;

const predicateStructure = `To represent an assurance case or assurance case pattern in GSN is equivalent to depicting in a 
hierarchical tree structure. To achieve this hierarchical tree structure, the below predicates have been defined to ease 
understanding of this structure. The predicate rules to support the structure of an assurance case or assurance case pattern 
begins with the delimiter “@Predicate_Structure” and ends with the delimiter “@End_Predicate_Structure”
@Predicate_Structure
1.	IncontextOf (X, [N], D): True if element X at depth D has a neighbour [N] to the left or right at depth D, where ‘[N]’ can 
    be an Assumption (A), Justification (J), or Context (C), ‘X’ can be a Goal (G), or Strategy (S) and ‘D’ represents the height 
    or depth of the goal or strategy element and its neighbours in the GSN hierarchical structure.
2.	SupportedBy (X, [C], D): True if element X at depth D has children [C] directly below it, where [C] can include Goal (G), 
    Strategy (S), or Solution (Sn) and ‘X’ can be a Goal (G), or Strategy (S).
•	If X is Strategy (S), [C] can only be Goal (G).
•	If X is Goal (G), [C] can be either Goal (G), Strategy(S), or Solution (Sn).
@End_Predicate_Structure
 `;

const preliminaryPattern = `Now, I will provide you with an example of an assurance case pattern in its predicate form and 
the corresponding assurance case derived from this pattern so that you can understand the process of instantiating an assurance 
case pattern to create an assurance case.
For example, an Assurance Case Pattern for the Interpretability of a Machine Learning system and the derived assurance case is 
given below.  The assurance case pattern begins with the delimiter "@Pattern" and ends with the delimiter "@End_Pattern" while 
the derived assurance case begins with the delimiter "@Assurance_case" and ends with the delimiter "@End_Assurance_case"
 `;

const pattern = `@Pattern
Goal (G1, Interpretability Claim. The {ML Model} is sufficiently {interpretable} in the intended {context})
Goal (G2, Right Method. The right {interpretability methods} are implemented, i.e. the correct information is faithfully being explained)
Goal (G3, Right Context. {Interpretations} produced in the {intended context})
Goal (G4, Right Format {Interpretability methods} are presented in the right {format} for the {audience})
Goal (G5, Right Time {Interpretations) produced at the {appropriate time})
Goal (G6, Right Setting {Interpretations) are available in the (right setting))
Goal (G7, Right Audience {Interpretations} produced for the {right audience})
Goal (G8, {Interpretability method} is right type e.g. local/global (i.e. the correct thing is being explained).)
Goal (G9, {Interpretability method} is suitably faithful to {ML model} process)
Strategy (S1, Argument based on the {essential aspects of interpretability})
Strategy (S2, Argument over {interpretability methods})
Context (C1, {ML Model})
Context (C2, {Interpretable})
Context (C3, (Context: setting time and audience})
Context (C4, (Essential aspects of interpretability})
Context (C5, {Interpretability methods})
Context (C6, {Format of interpretations})
SupportedBy (G1, S1, 1)
SupportedBy (S1, [G2, G3, G4], 2)
SupportedBy (G2, S2, 3)
SupportedBy (G3, [G5, G6, G7], 3)
SupportedBy (S2, [G8, G9], 4)
IncontextOf (G1, [C1, C2, C3], 1)
IncontextOf (S1, C4, 2)
IncontextOf (G2, C5, 3)
IncontextOf (G3, C6, 3)
IncontextOf (G4, C6, 3)
HasPlaceholder (G1)
HasPlaceholder (C1)
HasPlaceholder (C2)
HasPlaceholder (C3)
HasPlaceholder (C4)
HasPlaceholder (G2)
HasPlaceholder (G3)
HasPlaceholder (G4)
HasPlaceholder (C5)
HasPlaceholder (C6)
HasPlaceholder (S2)
HasPlaceholder (G5)
HasPlaceholder (G6)
HasPlaceholder (G7)
HasPlaceholder (G8)
HasPlaceholder (G9)
Uninstantiated (C1)
Uninstantiated (C2)
Uninstantiated (C3)
Uninstantiated (C4)
Uninstantiated (S1)
Uninstantiated (G2)
Uninstantiated (C5)
Uninstantiated (C6)
Uninstantiated (G3)
Uninstantiated (S2)
UndevelopStantiated (G4)
UndevelopStantiated (G5)
UndevelopStantiated (G6)
UndevelopStantiated (G7)
UndevelopStantiated (G8)
UndevelopStantiated (G9)
@End_Pattern
 `;

const assuranceCase = `@Assurance_case
G1: Interpretability Claim - The ML system is sufficiently interpretable in the intended context.
C1: Dual NN system
C2: Interpretable = transparency of system logic
C3: Context: setting - retinal diagnosis pathway; time- alongside diagnosis predictions; audience - retinal/ clinicians.
	S1: Argument based on the essential aspects of interpretability.
	C4: Essential aspects of interpretability: method, context & format
		G2: Right Method - The system structure and segmentation map provide transparency of the system logic and allow clinicians to understand decisions.
		C5: System structure and segmentation map
			S2: Argument over interpretability methods
				G8: Interpretability method is right type (the correct thing is being explained).
					G14: The system structure closely resembles the normal decision-process taken by clinicians (first producing the segmentation map then the diagnosis) (undeveloped)
				G9: Interpretability method is suitably faithful to the system process.
					G15: The interpretability method is the comprehensible structure of the system and the production of the segmentation map. (undeveloped)
	
		G3: Right Context - Segmentation map produced in the retinal diagnosis pathway.
		C6: Segmentation map
			G5: Right Time - Segmentation map is produced alongside diagnosis prediction.
				G11: Clinicians need an explanation alongside every diagnosis prediction. (undeveloped)
			G6: Right Setting - Explanations are available in the clinical setting.
				G12: Clearly clinicians need to be able to access these explanations within the clinical setting. (undeveloped)
			G7: Right Audience - Explanations produced for the retinal clinicians.
				G13: The clinicians need an explanation to understand and trust system predictions. (undeveloped)
		G4: Right Format - The format of the interpretation is the transparent system logic, including the segmentation map
		C6: Segmentation map
			G10: The system structure, including production of the segmentation map, closely resembles the normal clinical decision-making process & offers comprehensible insight into system logic. (undeveloped)
@End_Assurance_case
 `;

const fullSystemPrompt = preliminaryAC + contextAC + contextACP + defPredicates + predicateAC + predicateACP + predicateStructure + preliminaryPattern + pattern + assuranceCase + domainInfo;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <div>
            <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
                {/* AppBar */}
                <AppBar position="fixed" color="default" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height: '8vh', display: 'flex', justifyContent: 'center' }}>
                    <Toolbar sx={{ minHeight: '8vh', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
                        <IconButton onClick={handleMenuClick} size="large" edge="start" color="primary" aria-label="menu" sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                        <Menu anchorEl={anchorMenu} open={Boolean(anchorMenu)} onClose={handleMenuClose}>
                            <MenuItem onClick={handleTravelClick}>Assurance case editor</MenuItem>
                            <MenuItem>Pattern instantiation</MenuItem>
                            <MenuItem onClick={handleTravelDetection}>Pattern detection</MenuItem>
                        </Menu>
                        <IconButton onClick={handleClick} size="large" edge="start" color="primary" aria-label="options"
                                    sx={{mr: 2}}>
                            <Inventory/>
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                            <Divider>
                                <Chip label="JSON Manager" size="small"/>
                            </Divider>
                            <MenuItem onClick={exportToJSON}>Export graphic to JSON</MenuItem>
                            <Divider>
                                <Chip label="Image Export" size="small"/>
                            </Divider>
                            <MenuItem onClick={() => handleExport('png')}>Export to PNG</MenuItem>
                            <MenuItem onClick={() => handleExport('jpeg')}>Export to JPEG</MenuItem>
                            <MenuItem onClick={() => handleExport('svg')}>Export to SVG</MenuItem>
                        </Menu>
                        <TextField 
                            value={projectName} 
                            onChange={handleProjectNameChange} 
                            label="Project Name" 
                            variant="outlined" 
                            size="small"
                            sx={{ width: '200px', marginRight: 2 }}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                            <Tooltip title="Account settings">
                                <IconButton onClick={handleLoginClick} size="small" sx={{ ml: 2 }} aria-haspopup="true">
                                    <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
                                </IconButton>
                            </Tooltip>
                            <Menu anchorEl={anchorLogin} open={openLogin} onClose={handleLoginClose}>
                                <MenuItem onClick={handleLoginClose}>
                                    <Avatar /> Profile
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={handleTravelLogout}>
                                    <ListItemIcon>
                                        <Logout fontSize="small" />
                                    </ListItemIcon>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
                <Modal
                    open={openModal}
                    onClose={handleCloseModal}
                    aria-labelledby="system-prompt-title"
                    aria-describedby="system-prompt-description"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            height: 400, // Set a fixed height for the modal
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                            overflowY: 'auto', // Enable vertical scrolling
                        }}
                    >
                        <Typography id="system-prompt-title" variant="h6" component="h2">
                            Full System Prompt
                        </Typography>
                        <Typography
                            id="system-prompt-description"
                            sx={{ mt: 2, whiteSpace: 'pre-wrap' }} // Preserve white spaces, line breaks, and list formatting
                        >
                            {fullSystemPrompt} {/* Display the full system prompt here */}
                        </Typography>

                        <Button onClick={handleCloseModal} variant="contained" color="primary" sx={{ mt: 2 }}>
                            Close
                        </Button>
                    </Box>
                </Modal>

                {/* Content below AppBar */}
                <Box sx={{ display: 'flex', flexGrow: 1, marginTop: '8vh' }}>
                    {/* Left Panel */}
                    <Box sx={{ 
                        width: '30%', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        padding: 2, 
                        borderRight: '1px solid #ddd', 
                        overflowY: 'auto', 
                        maxHeight: 'calc(100vh - 8vh)' 
                    }}>
                        {/* Flex container for Project Name and Buttons */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                            <Typography variant="h6">{projectName}</Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                                    {loading ? "Generating..." : "Send"}
                                </Button>
                                {assistantResponse && (
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={handleReloadButton}
                                        disabled={!isValidAssuranceText}
                                    >
                                        Accept Assistant Prompt
                                    </Button>
                                )}
                            </Box>
                        </Box>

                        <Accordion style={{ backgroundColor: '#f0f3f4', marginBottom: '8px' }}>
                            <AccordionSummary expandIcon={<ExpandMore/>}>
                                User Prompt
                            </AccordionSummary>
                            <AccordionDetails>
                                <TextField multiline rows={4} variant="outlined" value={userPrompt} onChange={handleUserPromptChange} fullWidth />
                            </AccordionDetails>
                        </Accordion>
                        
                        <Accordion style={{ backgroundColor: '#f0f3f4', marginBottom: '8px' }}>
                            <AccordionSummary expandIcon={<ExpandMore/>}>
                                System Prompt
                            </AccordionSummary>
                            <AccordionDetails>
                                <TextField
                                    label="Enter Domain Info"
                                    variant="outlined"
                                    fullWidth
                                    value={domainInfo}
                                    onChange={handleDomainInfoChange}
                                />
                                <TextField
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                    value={fullSystemPrompt}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    onClick={handleOpenModal}
                                />
                            </AccordionDetails>
                        </Accordion>
                        
                        <Accordion style={{ backgroundColor: '#f0f3f4', marginBottom: '8px' }}>
                            <AccordionSummary expandIcon={<ExpandMore/>}>
                                LLM Customization
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Choose LLM</InputLabel>
                                    <Select label="Choose LLM" value={selectedModel} onChange={handleModelChange}>
                                        <MenuItem value="gpt-4-turbo">GPT-4 Turbo</MenuItem>
                                        <MenuItem value="gpt-4o">GPT-4 Omni</MenuItem>
                                    </Select>
                                </FormControl>
                                <Typography paddingTop={2}>Temperature: {temperature}</Typography>
                                <Slider value={temperature} min={0} max={2} step={0.1} onChange={handleTemperatureChange} />
                                <Typography>Max Tokens: {maxTokens}</Typography>
                                <Slider value={maxTokens} min={1} max={4000} step={1} onChange={handleMaxTokensChange} />
                            </AccordionDetails>
                        </Accordion>
                    </Box>

                    {/* Right Panel */}
                    <Box sx={{ flexGrow: 1, padding: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {assistantResponse && (
                            <Box sx={{ position: 'relative' }}>
                                <TextField
                                    id="AssuranceText"
                                    multiline
                                    fullWidth
                                    variant="outlined"
                                    value={assistantResponse}
                                    onChange={handleAssistantResponseChange}
                                    error={!isValidAssuranceText}
                                    helperText={!isValidAssuranceText ? 'Each line must have the required format: ["- "][Node ID][": "][Node text]["undeveloped and uninstantiated"]. Eliminate whitespaces in between the lines. Subindixes must be represented with underscores: "G0_1"' : ''}
                                    sx={{
                                        maxHeight: isExpanded ? '600px' : '200px', // Adjust height based on expansion state
                                        overflow: 'auto',
                                    }}
                                />
                                <IconButton
                                    sx={{ position: 'absolute', top: 5, right: 20 }}
                                    onClick={toggleExpand}
                                >
                                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </IconButton>
                            </Box>
                        )}
                        
                        <Box sx={{ flexGrow: 1, border: '1px solid #ddd', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <ReactFlow
                                nodes={nodes}
                                nodeTypes={nodeTypes}
                                onNodesChange={onNodesChange}
                                edges={edges}
                                edgeTypes={edgeTypes}
                                onEdgesChange={onEdgesChange}
                                onConnect={onConnect}
                                fitView
                                style={{minHeight: "inherit"}}
                                onConnectStart={onConnectStart}
                                onConnectEnd={onConnectEnd}
                                minZoom={0.1}
                            >
                                <Background
                                    variant={backgroundShapes}
                                    color={shapeColor}
                                    gap={shapeGap}
                                    style={{backgroundColor: backgroundPaneColor}}
                                />
                                <Controls style={{marginLeft: 25}} />
                            </ReactFlow>
                        </Box>
                    </Box>

                </Box>
            </Box>
        </div>
    );
};

export default function GPTMenu() {
    return (
        <ReactFlowProvider>
            <LLMMenu />
        </ReactFlowProvider>
    );
}