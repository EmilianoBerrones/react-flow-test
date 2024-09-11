import {
    addEdge,
    Background,
    BackgroundVariant,
    Controls,
    MarkerType,
    MiniMap,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    useReactFlow,
    useViewport,
} from "reactflow";

import {
    BrowserRouter as Router,
    Route,
    Routes,
    useNavigate,
} from 'react-router-dom';
import Login from './Login';

import Dagre from '@dagrejs/dagre'

import React, {useCallback, useEffect, useRef, useState} from "react";
import {startsWith} from 'lodash';

import "reactflow/dist/style.css";
import "./updatenode.css";
import FormDialog from "./FormDialog";
import {useDialog} from "./DialogContext";

import {initialNodes, nodeTypes} from "./nodes";
import {edgeTypes, initialEdges} from "./edges";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    AppBar,
    Button,
    ButtonGroup,
    Divider,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Slide,
    Slider,
    Switch,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Toolbar,
    Typography
} from "@mui/material";
import {RichTreeView} from '@mui/x-tree-view/RichTreeView';
import FlagCircleIcon from '@mui/icons-material/FlagCircle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Chip from '@mui/material/Chip';
import {ArrowCircleLeftOutlined, ExpandMore, FlagCircleOutlined, InfoTwoTone, Search} from "@mui/icons-material";
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import {MuiColorInput} from "mui-color-input";

import mammoth from 'mammoth';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from './firebase'; // Assuming you have a firebase.js file exporting `auth`
//FireBase imports

// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// const firebaseConfig = {
//     apiKey: "AIzaSyCGK1BL0n4t_L_53iKZ40U1ozIKHf6-GaI",
//     authDomain: "yorkuassurance.firebaseapp.com",
//     projectId: "yorkuassurance",
//     storageBucket: "yorkuassurance.appspot.com",
//     messagingSenderId: "997144539474",
//     appId: "1:997144539474:web:ba786fe11fa7e50b530a8b",
//     measurementId: "G-2B5DVNB9HH"
//   };

// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

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
    hidden?: boolean;
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

const Ruler = ({showRuler}: { showRuler: boolean }) => {
    const {x, y} = useViewport();
    const rulerRef = useRef(null);

    useEffect(() => {
        const canvas: any = rulerRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const step = 100; // Fixed step size for ruler lines

        ctx.clearRect(0, 0, width, height);

        if (showRuler) {
            ctx.strokeStyle = '#000';
            ctx.fillStyle = '#000';
            ctx.lineWidth = 1;

            // Draw top ruler (x-axis)
            for (let i = x % step; i < width; i += step) {
                const position = Math.round(i - x); // Corrected to move in the same direction as canvas
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, 20);
                ctx.stroke();
                ctx.fillText(position, i + 2, 10); // Display the fixed position on the ruler
            }

            // Draw left ruler (y-axis)
            for (let i = y % step; i < height; i += step) {
                const position = Math.round(i - y); // Corrected to move in the same direction as canvas
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(20, i);
                ctx.stroke();
                ctx.fillText(position, 2, i + 10); // Display the fixed position on the ruler
            }
        }

        return () => {
            // Clear the canvas when the component is unmounted or re-rendered
            ctx.clearRect(0, 0, width, height);
        };
    }, [x, y, showRuler]);

    return (
        <canvas
            ref={rulerRef}
            width={window.innerWidth}
            height={window.innerHeight}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex: 1,
                display: showRuler ? 'block' : 'none', // Toggle display based on state
            }}
        />
    );
};

// Creation of initial Tree and initial Rich Tree to display them.
// @ts-ignore
let initialTree = buildTree(initialNodes, initialEdges);
let richTree = initialTree.map(convertTreeNodeToDesiredNode);
let copyOfText = treeToText(initialTree);
let oneTime = 0; // Function to handle layouting one time

function FlowComponent() {
    // Values for getting and setting the viewport
    const {fitView, getViewport, setViewport} = useReactFlow();
    const [showMiniMap, setShowMiniMap] = useState(true);
    const [exporting, setExporting] = useState('');
    const inputFileRef = useRef<HTMLInputElement>(null);

    // Values for searching nodes
    const [searchMode, setSearchMode] = useState('id');
    const [searchValue, setSearchValue] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);

    // Values for the side panel
    const [isPanelOpen, setPanelOpen] = useState(false);
    const [backgroundShapes, setBackgroundShapes] = useState(BackgroundVariant.Dots);
    const [backgroundPaneColor, setBackgroundPaneColor] = useState('#ffffff');
    const [shapeColor, setShapeColor] = useState('#777777');
    const [shapeGap, setShapeGap] = useState(28);
    const [edgeType, setEdgeType] = useState('step');
    const [edgeTypeCopy, setEdgeTypeCopy] = useState('step');
    const [showRuler, setShowRuler] = useState(true);

    // Values for text dialogs
    const [importFromFileDialog, setImportFromFileDialog] = useState(false);
    const [importFromFileText, setImportFromFileText] = useState("");
    const [isImportFromFileTextValid, setImportFromFileTextValid] = useState(true);
    const [addNodeDialog, setAddNodeDialog] = useState(false);
    const [addNodeDialogText, setAddNodeDialogText] = useState("");
    const [importFromTextInfo, setImportFromTextInfo] = useState(false);

    // Values for the nodes and their functionality
    // const [indent, setIndent] = useState(defaultIndent);
    const [view, setView] = useState('textField'); // Estado para manejar la vista actual
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const labels = useRef<string[]>(nodes.map(node => node.data.label));
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Parameters to create nodes on edge drop
    const connectingNodeId = useRef(null);
    const [actualNode, setActualNode] = useState('');
    const [actualLetter, setActualLetter] = useState('');
    const {openDialog, formData, setFormData, isOpen} = useDialog();

    // Alerts for invalid actions.
    const [invalidConnectingNodeAlert, setInvalidConnectingNodeAlert] = useState(false); // type 1
    const [nodeConnectOnItselfAlert, setNodeConnectOnItselfAlert] = useState(false); // type 2
    const [connectionHasParentAlert, setConnectionHasParentAlert] = useState(false); // type 3
    const [invalidNodeDropAlert, setInvalidNodeDropAlert] = useState(false); // type 4

    // Creation of initial assurance case text
    const [initialAssuranceText, setInitialAssuranceText] = useState(treeToText(initialTree));

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


    const onDragStart = (data: any) => (event: any) => {
        event.dataTransfer.setData('application/reactflow', 'custom-node');
        event.dataTransfer.effectAllowed = 'move';
        switch (data) {
            case 'goal':
                setActualNode('goal');
                setActualLetter('G')
                break;
            case 'context':
                setActualNode('context');
                setActualLetter('C')
                break;
            case 'assumption':
                setActualNode('assumption');
                setActualLetter('A')
                break;
            case 'justification':
                setActualNode('justification');
                setActualLetter('J')
                break;
            case 'strategy':
                setActualNode('strategy');
                setActualLetter('S')
                break;
            case 'solution':
                setActualNode('solution');
                setActualLetter('Sn')
                break;
            default:
                setActualNode('goal');
                break;
        }
    };

    const onDrop = (event: any) => {
        event.preventDefault();
        const targetIsPane = event.target.classList.contains('react-flow__pane');
        if (targetIsPane) {
            openAddNodeDialog();
        } else if (!targetIsPane) {
            showInvalidConnectingNodeAlert('type4');
        }
    };

    const onDragOver = (event: any) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };


    // Function to clean the connecting node when it's created
    const onConnect = useCallback(() => {
        connectingNodeId.current = null;
    }, []);

    // Function to keep track of the connecting node
    const onConnectStart = useCallback((_: any, {nodeId}: any) => {
        connectingNodeId.current = nodeId;
    }, []);

    // Data to manage the current state of nodes and edges
    // React manages two different states of nodes and edges for some reason.
    const nodesRef = useRef(nodes);
    const edgesRef = useRef(edges);

    useEffect(() => {
        nodesRef.current = nodes;
        edgesRef.current = edges;
    }, [nodes, edges]);

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

    // Function to open a dialog on edge drop, if the connecting node is not itself.
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

    // Function to handle node search by id
    const handleSearch = (searchId: any) => {
        setNodes((prevNodes) => {
            const searchedNodes = prevNodes.filter(node => node.data.id === searchId);

            if (searchedNodes.length > 0) {
                // Highlight the nodes
                const updatedNodes = prevNodes.map(node => {
                    if (searchedNodes.some(searchedNode => searchedNode.id === node.id)) {
                        return {
                            ...node,
                            style: {
                                ...node.style,
                                border: '7px solid black',
                            },
                        };
                    } else {
                        return {
                            ...node,
                            style: {
                                ...node.style,
                                border: 'none',
                            },
                        };
                    }
                });

                // Calculate the midpoint and zoom accordingly
                const totalNodes = searchedNodes.length;
                if (totalNodes === 1) {
                    // Single node case: Zoom into the single node
                    const node = searchedNodes[0];
                    setTimeout(() => {
                        fitView({nodes: [node], padding: 5, duration: 800});
                    }, 100);
                } else {
                    // Multiple nodes case: Zoom into the midpoint of all nodes
                    const midpoint = searchedNodes.reduce(
                        (acc, node) => {
                            acc.x += node.position.x;
                            acc.y += node.position.y;
                            return acc;
                        },
                        {x: 0, y: 0}
                    );
                    midpoint.x /= totalNodes;
                    midpoint.y /= totalNodes;

                    setTimeout(() => {
                        fitView({
                            // @ts-ignore
                            position: midpoint,
                            zoom: 1, // Adjust zoom depending on distance
                            duration: 800,
                        });
                    }, 100);
                }

                // Revert the highlighting after a few seconds
                setTimeout(() => {
                    setNodes((prevNodes) => prevNodes.map(node => {
                        return {
                            ...node,
                            style: {
                                ...node.style,
                                border: 'none',
                            },
                        };
                    }));
                }, 2000); // 2000ms = 2 seconds

                return updatedNodes;
            }

            return prevNodes;
        });
    };

// Function to handle node search by text
    const handleSearchByText = (searchText: any) => {
        setNodes((prevNodes) => {
            const searchedNodes = prevNodes.filter(node => node.data.label.includes(searchText));

            if (searchedNodes.length > 0) {
                // Highlight the nodes
                const updatedNodes = prevNodes.map(node => {
                    if (searchedNodes.some(searchedNode => searchedNode.id === node.id)) {
                        return {
                            ...node,
                            style: {
                                ...node.style,
                                border: '7px solid black',
                            },
                        };
                    } else {
                        return {
                            ...node,
                            style: {
                                ...node.style,
                                border: 'none',
                            },
                        };
                    }
                });

                // Calculate the midpoint and zoom accordingly
                const totalNodes = searchedNodes.length;
                if (totalNodes === 1) {
                    // Single node case: Zoom into the single node
                    const node = searchedNodes[0];
                    setTimeout(() => {
                        fitView({nodes: [node], padding: 5, duration: 800});
                    }, 100);
                } else {
                    // Multiple nodes case: Zoom into the midpoint of all nodes
                    const midpoint = searchedNodes.reduce(
                        (acc, node) => {
                            acc.x += node.position.x;
                            acc.y += node.position.y;
                            return acc;
                        },
                        {x: 0, y: 0}
                    );
                    midpoint.x /= totalNodes;
                    midpoint.y /= totalNodes;

                    setTimeout(() => {
                        fitView({
                            // @ts-ignore
                            position: midpoint,
                            zoom: 1, // Adjust zoom depending on distance
                            duration: 800,
                        });
                    }, 100);
                }

                // Revert the highlighting after a few seconds
                setTimeout(() => {
                    setNodes((prevNodes) => prevNodes.map(node => {
                        return {
                            ...node,
                            style: {
                                ...node.style,
                                border: 'none',
                            },
                        };
                    }));
                }, 2000); // 2000ms = 2 seconds

                return updatedNodes;
            }

            return prevNodes;
        });
    };


    // Function to synchronize the data between the graph, textview and treeview
    useEffect(() => {
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
                type: edgeType,
                markerEnd: arrowMarker,
                style: arrowFill
            }
            const newNodes = nodes.concat(newNode);
            // @ts-ignore
            const newEdges = edges.concat(newEdge);
            // @ts-ignore
            const newTree = buildTree(newNodes, newEdges);
            const uniqueTree = assignUniqueIdsToTree(newTree);
            replaceTree(uniqueTree);
            richTree = uniqueTree.map(convertTreeNodeToDesiredNode);
            setInitialAssuranceText(treeToText(uniqueTree));
            connectingNodeId.current = null;
            setFormData('');
        }
        if (copyOfText !== initialAssuranceText) {
            copyOfText = initialAssuranceText;
            handleReloadButton();
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
                        break;
                    }
                }
            }
        }
        // automate label change
    }, [formData, isOpen, nodes]);

    // Function to detect when the nodes are going to be exported to an image format, and then export them
    useEffect(() => {
        if (exporting) {
            const originalViewport = getViewport();
            fitView();

            setTimeout(async () => {
                const element = document.querySelector('.react-flow') as HTMLElement;
                let dataUrl;

                if (exporting === 'png') {
                    dataUrl = await htmlToImage.toPng(element);
                } else if (exporting === 'jpeg') {
                    dataUrl = await htmlToImage.toJpeg(element);
                } else if (exporting === 'svg') {
                    dataUrl = await htmlToImage.toSvg(element);
                }

                if (dataUrl) {
                    download(dataUrl, `graph.${exporting}`);
                }

                setViewport(originalViewport);
                setShowMiniMap(true);
                setExporting('');
            }, 100); // Delay to ensure state update
        }
    }, [exporting]);

    // Function that layouts the graph initially
    useEffect(() => {
        const layoutedElements = getLayoutedElements(nodes, edges, {direction: 'TB'});
        setNodes([...layoutedElements.nodes]);
        setEdges([...layoutedElements.edges]);
        const tree = buildTree(layoutedElements.nodes, layoutedElements.edges);
        richTree = tree.map(convertTreeNodeToDesiredNode);
        setInitialAssuranceText(treeToText(tree));
        if (oneTime < 2) {
            handleReloadButton();
            oneTime += 1;
        }
        if (edgeTypeCopy !== edgeType) {
            handleReloadButton();
            setEdgeTypeCopy(edgeType);
        }
    }, [nodes.length, edges.length, edgeType]);

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
                    type: edgeType,
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
                    type: defineTypeOfNode(node.node.id),
                    hidden: node.node.hidden,
                },
                ...createNodesFromTree(node.children)
            ]);
        };

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
        function hideChildrenIfUndeveloped(
            node: TreeNode,
            ancestorHasUndeveloped: boolean = false
        ) {
            // Oculta el nodo actual si algún ancestro tiene "undeveloped"
            node.node.hidden = ancestorHasUndeveloped;

            // Verifica si el nodo actual tiene "undeveloped"
            const currentHasUndeveloped = node.node.data.label.includes('undeveloped');

            // Aplica la función recursivamente a los hijos
            node.children.forEach(child => {
                // Determina si el hijo inmediato debe ser ocultado
                const isImmediateChildToHide = currentHasUndeveloped && !/^[CAJ]/.test(child.node.id);

                // Propaga el estado de ocultación solo si es un ancestro o el hijo inmediato debe ser ocultado
                hideChildrenIfUndeveloped(
                    child,
                    ancestorHasUndeveloped || isImmediateChildToHide
                );
            });
        }

        // Aplica la función a cada nodo raíz en el árbol
        tree.forEach(rootNode => hideChildrenIfUndeveloped(rootNode));


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
    const handleReloadButton = () => {
        const newTree = textToTree(replaceTabsWithSpaces(initialAssuranceText));
        replaceTree(newTree);
        richTree = newTree.map(convertTreeNodeToDesiredNode);
    }

    // Alternate version to handle reload when scanning for new labels.
    const handleReloadAdvanced = (actualLabels: string[]) => {
        // @ts-ignore
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

    // Function that replaces tabs with spaces
    function replaceTabsWithSpaces(input: string, spacesPerTab: number = 8): string {
        if (!input.includes('\t')) {
            return input;
        }
        const spaces = ' '.repeat(spacesPerTab);
        return input.replace(/\t/g, spaces);
    }

    // Function to export to JSON
    const exportToJSON = () => {
        const blob = new Blob([JSON.stringify(richTree, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'nodes.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    // Function to import from JSON file.
    const importFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            console.error("No file selected");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target && typeof e.target.result === 'string') {
                try {
                    const content = JSON.parse(e.target.result);
                    console.log("Imported JSON content:", content);
                    const newTree = jsonToTree(content);
                    console.log("New tree structure:", newTree);
                    replaceTree(newTree);
                    handleReloadButton();
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            } else {
                console.error("Failed to read file content");
            }
        };
        reader.readAsText(file);
    }

    // Convert JSON to TreeNode[]
    function jsonToTree(json: DesiredNode[]): TreeNode[] {
        // Recursive function to convert each node
        function convertNode(node: DesiredNode): TreeNode {
            return {
                node: {
                    id: node.id,
                    position: {x: 0, y: 0}, // Positions are adjusted later
                    data: {label: node.label, id: node.id},
                    type: defineTypeOfNode(node.id)
                },
                children: node.children ? node.children.map(convertNode) : []
            };
        }

        return json.map(convertNode);
    }

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // Function to handle the import button
    const handleImportButtonClick = () => {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    };

    // Function to handle the export and the viewport.
    const handleExport = (format: any) => {
        setShowMiniMap(false);
        setExporting(format);
    };

    // Function to handle the indentation change
    // const handleChangeIndent = (event: SelectChangeEvent) => {
    //     setIndent(parseInt(event.target.value));
    // }

    // Function to handle the searching mode
    const handleSearchModeChange = (_event: any, newSearchMode: any) => {
        if (newSearchMode !== null) {
            setSearchMode(newSearchMode);
        }
    };

    // Function to handle when the search type changes.
    const handleSearchChange = (event: any) => {
        setSearchValue(event.target.value);
    };

    // Function to call for either id or text searches.
    const handleSearchSubmit = () => {
        if (searchMode === 'id') {
            handleSearch(searchValue);
        } else if (searchMode === 'text') {
            handleSearchByText(searchValue);
        }
        setSearchValue('');
    };

    const handleClosePanel = () => {
        setPanelOpen(false);
    }

    const handleOpenPanel = () => {
        setPanelOpen(!isPanelOpen);
    }

    const handleBackgroundChange = (newBackground: BackgroundVariant) => {
        setBackgroundShapes(newBackground);
    };

    const handleShapeGap = (_event: Event, newValue: number | number[]) => {
        setShapeGap(newValue as number);
    };

    const handleEdgeTypeChange = useCallback((data: string) => {
        return () => {
            console.log(data);
            setEdgeType(data);
        };
    }, []);

    const navigate = useNavigate();

    const handleAccountClick = () => {
        navigate('/login'); // Navigates to the Login component
    };

    const handleFileImport = async (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (fileExtension === 'txt') {
                // Handle text files
                const reader = new FileReader();
                reader.onload = (e) => {
                    // @ts-ignore
                    const fileContent = e.target.result;
                    alert(`File content:\n${fileContent}`);
                };
                reader.readAsText(file);
            } else if (fileExtension === 'docx') {
                // Handle Word (.docx) files using mammoth
                try {
                    const arrayBuffer = await file.arrayBuffer();
                    const result = await mammoth.extractRawText({arrayBuffer});
                    const text = result.value;
                    setImportFromFileText(text);
                    handleTextDialogOpen();
                } catch (error) {
                    alert('Error reading Word document.');
                }
            } else {
                alert('Unsupported file type. Please upload a .txt or .docx file.');
            }
        }
    };

    // Function to trigger file input
    const handleTxtImportButtonClick = () => {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    };

    const [projectMenuAnchorEl, setProjectMenuAnchorEl] = useState<null | HTMLElement>(null);
    const isProjectMenuOpen = Boolean(projectMenuAnchorEl);

    const handleProjectMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setProjectMenuAnchorEl(event.currentTarget);
    };

    const handleProjectMenuClose = () => {
        setProjectMenuAnchorEl(null);
    };

    const handleTextDialogOpen = () => {
        setImportFromFileDialog(true);
    };

    const handleTextDialogClose = () => {
        setImportFromFileDialog(false);
    };

    const handleTextDialogAccept = () => {
        setInitialAssuranceText(importFromFileText);
        handleTextDialogClose();
    }

    const validateTextFormat = (text: string) => {
        const lines = text.split('\n');
        const regex = /^- [A-Za-z0-9_]+: .+$/;

        for (const line of lines) {
            if (!regex.test(line.trim())) {
                setImportFromFileTextValid(false);
                return false;
            }
        }
        setImportFromFileTextValid(true);
        return true;
    };

    function validateAssuranceText(): boolean {
        const input = initialAssuranceText;
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

    function isAddNodeDialogNumber(): boolean {
        const value = addNodeDialogText;
        return !isNaN(Number(value)) && value.trim() !== '';
    }

    const handleTextDialog = (e: any) => {
        const newText = e.target.value;
        setImportFromFileText(newText);
        validateTextFormat(newText); // Valida el nuevo texto cada vez que cambia
    };

    const handleAddNodeDialogClose = () => {
        setAddNodeDialog(false);
    };

    const handleAddNodeDialogAccept = () => {
        setAddNodeDialog(false);
        if (addNodeDialogText) {
            const nodeId = actualLetter + addNodeDialogText;
            const newNode = {
                id: nodeId,
                data: {label: 'New label', id: nodeId},
                position: {x: 100, y: 100},
                type: actualNode,
            }
            const newNodes = nodes.concat(newNode);
            setNodes(newNodes);
        }
        setActualNode('');
    };

    const openAddNodeDialog = () => {
        setAddNodeDialog(true);
    }

    const handleImportFromTextInfoClose = () => {
        setImportFromTextInfo(false);
    }

    const handleImportFromTextInfoOpen = () => {
        setImportFromTextInfo(true);
    }

    const formatText = () => {
        let input = importFromFileText;

        // Reemplazar puntos decimales por guiones bajos en los identificadores
        input = input.replace(/(\d+)\.(\d+)/g, '$1_$2');

        // Dividimos el string en líneas
        const lines = input.trim().split('\n');

        // Creamos un arreglo para las líneas formateadas
        const formattedLines: string[] = [];

        // Recorremos cada línea para procesarlas
        lines.forEach((line) => {
            // Eliminamos espacios innecesarios y ajustamos la línea
            const trimmedLine = line.trim();

            // Verificamos que la línea no esté vacía
            if (trimmedLine !== '') {
                const indentLevel = line.match(/^\s*/)?.[0].length || 0;

                // Agregamos la línea con su nivel de indentación original
                formattedLines.push(' '.repeat(indentLevel) + trimmedLine);
            }
        });

        // Unimos las líneas formateadas con un salto de línea
        setImportFromFileText(formattedLines.join('\n'));
    };

    // HTML section
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
            <div className="app-container">
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <AppBar position="fixed" color="transparent"
                        sx={{height: '8vh', display: 'flex', justifyContent: 'center'}}>
                    <Toolbar sx={{minHeight: '8vh', display: 'flex', alignItems: 'center', padding: '0 16px'}}>
                        <IconButton onClick={handleClick} size="large" edge="start" color="primary" aria-label="menu"
                                    sx={{mr: 2}}>
                            <MenuIcon/>
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>

                            <Divider>
                                <Chip label="JSON Manager" size="small"/>
                            </Divider>
                            <MenuItem onClick={exportToJSON}>Export graphic to JSON</MenuItem>
                            <MenuItem onClick={handleImportButtonClick}>
                                Import graphic from JSON
                                <input
                                    accept="application/json"
                                    style={{display: 'none'}}
                                    type="file"
                                    onChange={importFromJSON}
                                    ref={inputFileRef}
                                />
                            </MenuItem>
                            <Divider>
                                <Chip label="Text Import" size="small"/>
                            </Divider>
                            <MenuItem onClick={handleTxtImportButtonClick}>
                                Import graphic from text file
                                <IconButton
                                    color="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleImportFromTextInfoOpen();
                                    }}
                                >
                                    <InfoTwoTone/>
                                </IconButton>
                                <input
                                    type="file"
                                    accept=".txt,.docx"
                                    ref={inputFileRef}
                                    style={{display: 'none'}}
                                    onChange={handleFileImport}
                                />
                            </MenuItem>
                            <Divider>
                                <Chip label="Image Export" size="small"/>
                            </Divider>
                            <MenuItem onClick={() => handleExport('png')}>Export to PNG</MenuItem>
                            <MenuItem onClick={() => handleExport('jpeg')}>Export to JPEG</MenuItem>
                            <MenuItem onClick={() => handleExport('svg')}>Export to SVG</MenuItem>
                        </Menu>
                        <Button variant="text" color="primary" onClick={handleProjectMenuClick}>
                            ProjectName
                        </Button>
                        <Menu
                            anchorEl={projectMenuAnchorEl}
                            open={isProjectMenuOpen}
                            onClose={handleProjectMenuClose}
                        >
                            <MenuItem onClick={handleProjectMenuClose}>Option 1</MenuItem>
                            <MenuItem onClick={handleProjectMenuClose}>Option 2</MenuItem>
                            <MenuItem onClick={handleProjectMenuClose}>Option 3</MenuItem>
                        </Menu>
                        <div style={{display: 'flex', alignItems: 'center', marginLeft: 'auto'}}>
                            <TextField
                                label={`Search node by ${searchMode}`}
                                variant="outlined"
                                sx={{height: '36px', flexGrow: 1, maxWidth: '300px', marginRight: '8px'}}
                                size="small"
                                value={searchValue}
                                onChange={handleSearchChange}
                            />
                            <IconButton color="primary" size="large" onClick={handleSearchSubmit}>
                                <Search/>
                            </IconButton>
                            <ToggleButtonGroup
                                value={searchMode}
                                exclusive
                                color="primary"
                                onChange={handleSearchModeChange}
                                aria-label="search mode"
                                sx={{marginLeft: '8px'}}
                            >
                                <ToggleButton value="id" aria-label="search by ID">
                                    ID
                                </ToggleButton>
                                <ToggleButton value="text" aria-label="search by text">
                                    Text
                                </ToggleButton>
                            </ToggleButtonGroup>
                            <IconButton aria-label="AccountButton" sx={{ml: 2}} color="primary"
                                        onClick={handleAccountClick}>
                                <AccountCircleIcon/>
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
                <Grid container direction="row" spacing={0} style={{marginTop: '8vh', maxHeight: '92vh'}}>
                    <Grid item xs={12} md={4} padding="30px" style={{maxHeight: 'inherit', overflowY: 'auto'}}>
                        <Grid container direction="column" spacing={2} style={{minHeight: 'inherit'}}
                              justifyContent="center">
                            <Grid item>
                                <Typography variant='h4' gutterBottom>ProjectName</Typography>
                            </Grid>
                            <Accordion style={{backgroundColor: '#f0f3f4'}}>
                                <AccordionSummary expandIcon={<ExpandMore/>}>
                                    Node selector
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={1} alignItems='center' justifyContent='center'>
                                        <Grid item xs>
                                            <div className="goalNode"
                                                 style={{
                                                     textAlign: 'center',
                                                     cursor: 'pointer',
                                                     userSelect: 'none',
                                                 }}
                                                 draggable='true'
                                                 onDragStart={onDragStart("goal")}>
                                                Goal
                                            </div>
                                        </Grid>
                                        <Grid item xs>
                                            <div className="contextNode"
                                                 style={{
                                                     textAlign: 'center',
                                                     cursor: 'pointer',
                                                     userSelect: 'none',
                                                 }}
                                                 draggable='true'
                                                 onDragStart={onDragStart('context')}>
                                                Context
                                            </div>
                                        </Grid>
                                        <Grid item xs>
                                            <div className="strategyNodeBorder"
                                                 style={{
                                                     textAlign: 'center',
                                                     cursor: 'pointer',
                                                     userSelect: 'none',
                                                 }}
                                                 draggable='true'
                                                 onDragStart={onDragStart('strategy')}>
                                                <div className="strategyNode">
                                                    Strategy
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item xs>
                                            <div className="ajNodeBorder"
                                                 style={{
                                                     textAlign: 'center',
                                                     cursor: 'pointer',
                                                     userSelect: 'none',
                                                 }}
                                                 draggable='true'
                                                 onDragStart={onDragStart('assumption')}>
                                                <div className="ajNode">
                                                    Assumption
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item xs>
                                            <div className="ajNodeBorder"
                                                 style={{
                                                     textAlign: 'center',
                                                     cursor: 'pointer',
                                                     userSelect: 'none',
                                                 }}
                                                 draggable='true'
                                                 onDragStart={onDragStart('justification')}>
                                                <div className="ajNode">
                                                    Justification
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item xs>
                                            <div className="solutionNodeBorder"
                                                 style={{
                                                     width: '80px',
                                                     height: '80px',
                                                     left: '17%',
                                                     textAlign: 'center',
                                                     cursor: 'pointer',
                                                     userSelect: 'none',
                                                 }}
                                                 draggable='true'
                                                 onDragStart={onDragStart('solution')}>
                                                <div className="solutionNode" style={{width: '60px', height: '60px'}}>
                                                    Solution
                                                </div>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion defaultExpanded style={{backgroundColor: '#f0f3f4'}}>
                                <AccordionSummary expandIcon={<ExpandMore/>}>
                                    Text editor
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container direction='column' spacing={2}>
                                        <Grid item>
                                            <ToggleButtonGroup
                                                value={view}
                                                exclusive
                                                onChange={(_event, newView) => setView(newView)}
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
                                        <Grid item style={{flex: 1}}>
                                            <Grid container direction="column" spacing={1} justifyContent="flex-start">
                                                <Grid item>
                                                    {view === 'textField' && (
                                                        <TextField
                                                            id="AssuranceText"
                                                            multiline
                                                            fullWidth
                                                            variant="outlined"
                                                            error={!validateAssuranceText()}
                                                            helperText={!validateAssuranceText() ? 'Follow the GSN rules when creating the assurance cases' : ''}
                                                            value={initialAssuranceText}
                                                            onChange={(e) => setInitialAssuranceText(e.target.value)}
                                                            onKeyDown={handleTab}
                                                        />
                                                    )}
                                                    {view === 'richTreeView' && (
                                                        <div>
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
                                            </Grid>
                                        </Grid>
                                        {/*<Grid item>*/}
                                        {/*    <FormControl fullWidth>*/}
                                        {/*        <InputLabel id="indentSelect">Indentation</InputLabel>*/}
                                        {/*        <Select*/}
                                        {/*            value={indent.toString()}*/}
                                        {/*            label="Indent"*/}
                                        {/*            onChange={handleChangeIndent}*/}
                                        {/*        >*/}
                                        {/*            <MenuItem value={2}>Two spaces</MenuItem>*/}
                                        {/*            <MenuItem value={4}>Four spaces</MenuItem>*/}
                                        {/*            <MenuItem value={8}>Tabulations</MenuItem>*/}
                                        {/*        </Select>*/}
                                        {/*    </FormControl>*/}
                                        {/*</Grid>*/}
                                        <Grid item>
                                            <Button variant="outlined" fullWidth disabled={!validateAssuranceText()}
                                                    onClick={handleReloadButton}>Accept changes</Button>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={8} style={{minHeight: '92vh'}}>
                        <Grid container
                              style={{
                                  minHeight: "inherit",
                                  position: 'relative',
                                  overflowX: 'hidden',
                                  overflowY: 'hidden',
                              }}
                              onDrop={onDrop}
                              onDragOver={onDragOver}
                        >
                            <FormDialog/>
                            <Ruler showRuler={showRuler}/>
                            <React.Fragment>
                                <Dialog
                                    fullScreen
                                    open={importFromFileDialog}
                                    keepMounted
                                >
                                    <DialogTitle>Text file preview</DialogTitle>
                                    <DialogContent>
                                        <TextField
                                            value={importFromFileText}
                                            multiline
                                            fullWidth
                                            error={!isImportFromFileTextValid}
                                            helperText="Each line must have the required format: ['- '][Node ID][': '][Node text]['undeveloped and uninstantiated']. Eliminate whitespaces in between the lines. Subindixes must be represented with underscores: 'G0_1'"
                                            onChange={handleTextDialog}
                                        />
                                        <Button onClick={formatText} fullWidth>Format text</Button>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleTextDialogClose}>Cancel</Button>
                                        <Button
                                            onClick={handleTextDialogAccept}
                                            autoFocus
                                            disabled={!isImportFromFileTextValid}
                                        >
                                            Accept
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </React.Fragment>
                            <React.Fragment>
                                <Dialog
                                    open={addNodeDialog}
                                    keepMounted
                                >
                                    <DialogTitle>Adding manual node</DialogTitle>
                                    <DialogContent>
                                        <Grid container spacing={2} alignItems='center'>
                                            <Grid item xs={12}>
                                                Enter the ID number of the {actualNode} node:
                                            </Grid>
                                            <Grid item xs={1}>
                                                {actualLetter} :
                                            </Grid>
                                            <Grid item xs>
                                                <TextField label='Node ID number'
                                                           error={!isAddNodeDialogNumber()}
                                                           value={addNodeDialogText}
                                                           helperText={!isAddNodeDialogNumber() ? 'Only numbers are allowed as node IDs' : ''}
                                                           onChange={(e) => setAddNodeDialogText(e.target.value)}
                                                ></TextField>
                                            </Grid>
                                        </Grid>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleAddNodeDialogClose}>Cancel</Button>
                                        <Button onClick={handleAddNodeDialogAccept}
                                                disabled={!isAddNodeDialogNumber()}
                                        >Accept</Button>
                                    </DialogActions>
                                </Dialog>
                            </React.Fragment>
                            <React.Fragment>
                                <Dialog
                                    open={importFromTextInfo}
                                    keepMounted
                                >
                                    <DialogTitle>Import from text file</DialogTitle>
                                    <DialogContent>
                                        <Grid container>
                                            <Grid item xs={2} alignSelf='center'>
                                                <InfoTwoTone color="primary" sx={{fontSize: 50}}/>
                                            </Grid>
                                            <Grid item xs>
                                                You can import the assurance cases from a text file, with extensions
                                                '.docx' or
                                                '.txt'. Tabulations are deleted when importing txt and docx files. Make
                                                sure the
                                                nodes' indentation are represented by spaces
                                            </Grid>
                                        </Grid>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleImportFromTextInfoClose}> Ok</Button>
                                    </DialogActions>
                                </Dialog>
                            </React.Fragment>
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
                                    style={{backgroundColor: backgroundPaneColor}}/>
                                {showMiniMap && <MiniMap/>}
                                <Controls style={{marginLeft: 25}}/>
                            </ReactFlow>
                            <SidePanel
                                isPanelOpen={isPanelOpen}
                                handleClosePanel={handleClosePanel}
                                setNewBackgroundShape={handleBackgroundChange}
                                backgroundPaneColor={backgroundPaneColor}
                                setBackgroundPaneColor={setBackgroundPaneColor}
                                shapeColor={shapeColor}
                                setShapeColor={setShapeColor}
                                shapeGap={shapeGap}
                                handleShapeGap={handleShapeGap}
                                handleEdgeTypeChange={handleEdgeTypeChange}
                                showRuler={showRuler}  // Pass showRuler state
                                toggleRuler={() => setShowRuler(!showRuler)}
                            />
                            <IconButton style={{
                                position: 'absolute',
                                top: '50%',
                                right: isPanelOpen ? '400px' : '0px',
                                transition: 'right 0.3s ease-in-out, transform 0.4s ease-in-out',
                                transform: isPanelOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            }} onClick={handleOpenPanel}>
                                <ArrowBackIosRoundedIcon></ArrowBackIosRoundedIcon>
                            </IconButton>
                            <Slide direction="up" in={invalidConnectingNodeAlert} mountOnEnter unmountOnExit>
                                <Alert severity="error"
                                       style={{
                                           position: 'absolute',
                                           bottom: '5%',
                                           right: '50%',
                                           maxWidth: '40%',
                                       }}>
                                    Warning: GSN does not allow nodes of type 'Context', 'Justification',
                                    'Assumption' and 'Solution' to have children nodes.
                                </Alert>
                            </Slide>
                            <Slide direction="up" in={nodeConnectOnItselfAlert} mountOnEnter unmountOnExit>
                                <Alert severity="error"
                                       style={{
                                           position: 'absolute',
                                           bottom: '5%',
                                           right: '58%',
                                           maxWidth: '40%',
                                       }}>
                                    Warning: Invalid node connection to itself.
                                </Alert>
                            </Slide>
                            <Slide direction="up" in={connectionHasParentAlert} mountOnEnter unmountOnExit>
                                <Alert severity="error"
                                       style={{
                                           position: 'absolute',
                                           bottom: '5%',
                                           right: '55%',
                                           maxWidth: '40%',
                                       }}>
                                    Warning: Target node already has a parent node
                                </Alert>
                            </Slide>
                            <Slide direction="up" in={invalidNodeDropAlert} mountOnEnter unmountOnExit>
                                <Alert severity="error"
                                       style={{
                                           position: 'absolute',
                                           bottom: '5%',
                                           right: '55%',
                                           maxWidth: '40%',
                                       }}>
                                    Warning: Nodes can only be dropped on the pane.
                                </Alert>
                            </Slide>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </>
    );
}

const SidePanel = ({
                       isPanelOpen,
                       handleClosePanel,
                       setNewBackgroundShape,
                       backgroundPaneColor,
                       setBackgroundPaneColor,
                       shapeColor,
                       setShapeColor,
                       shapeGap,
                       handleShapeGap,
                       handleEdgeTypeChange,
                       showRuler,
                       toggleRuler
                   }
                       : {
    isPanelOpen: boolean;
    handleClosePanel: () => void;
    setNewBackgroundShape: any;
    backgroundPaneColor: any;
    setBackgroundPaneColor: any;
    shapeColor: any;
    setShapeColor: any;
    shapeGap: any;
    handleShapeGap: any;
    handleEdgeTypeChange: any;
    showRuler: boolean;
    toggleRuler: () => void;
}) => {
    return (
        <div
            style={{
                position: 'absolute',
                top: '50%',
                right: isPanelOpen ? '0px' : '-400px',
                visibility: isPanelOpen ? 'visible' : 'hidden',
                transform: 'translateY(-50%)',
                backgroundColor: '#fff',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
                padding: '20px',
                width: '350px',
                transition: 'right 0.3s ease-in-out',
            }}
        >
            <Grid container direction='column' spacing={1}>
                <Grid item>
                    <p>Grid style</p>
                </Grid>
                <Grid item alignSelf="center">
                    <ButtonGroup variant="text">
                        <Button onClick={() => setNewBackgroundShape(BackgroundVariant.Lines)}>
                            Lines
                        </Button>
                        <Button onClick={() => setNewBackgroundShape(BackgroundVariant.Dots)}>
                            Dots
                        </Button>
                        <Button onClick={() => setNewBackgroundShape(BackgroundVariant.Cross)}>
                            Cross
                        </Button>
                        <Button onClick={() => setNewBackgroundShape(BackgroundVariant)}>
                            Empty
                        </Button>
                    </ButtonGroup>
                </Grid>
                <Grid item>
                    <p>Connection style</p>
                </Grid>
                <Grid item alignSelf='center'>
                    <ButtonGroup variant='text'>
                        <Button onClick={handleEdgeTypeChange('straight')}>
                            Straight
                        </Button>
                        <Button onClick={handleEdgeTypeChange('step')}>
                            Step
                        </Button>
                        <Button onClick={handleEdgeTypeChange('smoothstep')}>
                            Smooth
                        </Button>
                        <Button onClick={handleEdgeTypeChange('simplebezier')}>
                            Bezier
                        </Button>
                    </ButtonGroup>
                </Grid>
                <Grid item>
                    Grid size
                    <Slider
                        value={shapeGap}
                        onChange={handleShapeGap}
                        min={1}
                        max={100}
                        step={1}
                    />
                </Grid>
                <Grid item style={{justifySelf: 'center'}}>
                    <p>
                        Grid color
                    </p>
                    <MuiColorInput format="hex" value={shapeColor} onChange={setShapeColor}></MuiColorInput>
                </Grid>
                <Grid item>
                    <p>Ruler</p>
                    <Switch checked={showRuler} onChange={toggleRuler}/>
                </Grid>
                <Grid item>
                    <p>
                        Background color
                    </p>
                    <MuiColorInput format="hex" value={backgroundPaneColor}
                                   onChange={setBackgroundPaneColor}></MuiColorInput>
                </Grid>
                <Grid item alignSelf='center'>
                    <Button variant='text' onClick={handleClosePanel}>Close</Button>
                </Grid>
            </Grid>
        </div>
    );
};


export default function App() {
    // Function to encapsule the HTML into a ReactFlow provider
    return (
        <Router>
            <ReactFlowProvider>
                <Routes>
                    <Route path="/" element={<FlowComponent />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </ReactFlowProvider>
        </Router>
    );
}