import { 
    Box, 
    TextField, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    Typography, 
    Button, 
    Slider } from '@mui/material';

import { useNavigate } from 'react-router-dom';

import {
    Background,
    ReactFlow,
    ReactFlowProvider,
    useNodesState,
    MarkerType,
    useEdgesState,
    addEdge,
    BackgroundVariant,
    MiniMap,
    Controls
} from "reactflow";

import React, { useState, useCallback, useRef, useEffect } from "react";
import "reactflow/dist/style.css";
import "./updatenode.css";

import Dagre from '@dagrejs/dagre'

import {
    AppBar, Avatar, IconButton, Menu, Toolbar, Tooltip, ToggleButton, ToggleButtonGroup, Divider, ListItemIcon
} from "@mui/material";
import { Logout, Search, ExpandMore, Menu as MenuIcon } from "@mui/icons-material";

import {initialNodes, nodeTypes} from "./nodes";
import {edgeTypes, initialEdges} from "./edges";

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

function LLMMenu() {
    const [userPrompt, setUserPrompt] = useState('');
    const [assistantResponse, setAssistantResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState('gpt-4o'); // Default to gpt-4o
    const [temperature, setTemperature] = useState(1); // Default temperature to 1
    const [maxTokens, setMaxTokens] = useState(4000); // Default max tokens to 4000
    const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);
    const [projectMenuAnchorEl, setProjectMenuAnchorEl] = useState<null | HTMLElement>(null);
    const isProjectMenuOpen = Boolean(projectMenuAnchorEl);
    const [searchMode, setSearchMode] = useState('id');
    const [searchValue, setSearchValue] = useState('');
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
    const [showMiniMap] = useState(true);
    const navigate = useNavigate(); // Initialize useNavigate

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
    const handleTemperatureChange = (event: any, value: number | number[]) => {
        setTemperature(value as number);
    };

    // @ts-ignore
    const handleMaxTokensChange = (event: any, value: number | number[]) => {
        setMaxTokens(value as number);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: userPrompt,
                    model: selectedModel,
                    temperature: temperature,
                    max_tokens: maxTokens
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

    const handleProjectMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setProjectMenuAnchorEl(event.currentTarget);
    };

    const handleProjectMenuClose = () => {
        setProjectMenuAnchorEl(null);
    };

    const handleSearchChange = (event: any) => {
        setSearchValue(event.target.value);
    };

    const handleSearchSubmit = () => {
        if (searchMode === 'id') {
            // Implement search by ID
        } else if (searchMode === 'text') {
            // Implement search by text
        }
        setSearchValue('');
    };

    const handleSearchModeChange = (_event: any, newSearchMode: any) => {
        if (newSearchMode !== null) setSearchMode(newSearchMode);
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

    return (
        <div>
            <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
                {/* AppBar */}
                <AppBar position="fixed" color="transparent" sx={{ height: '8vh', display: 'flex', justifyContent: 'center' }}>
                    <Toolbar sx={{ minHeight: '8vh', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
                        <IconButton onClick={handleMenuClick} size="large" edge="start" color="primary" aria-label="menu" sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                        <Menu anchorEl={anchorMenu} open={Boolean(anchorMenu)} onClose={handleMenuClose}>
                            <MenuItem onClick={handleTravelClick}>Assurance case editor</MenuItem>
                            <MenuItem>Pattern instantiation</MenuItem>
                            <MenuItem>Pattern detection</MenuItem>
                        </Menu>
                        <Button variant="outlined" color="primary" onClick={handleProjectMenuClick}>
                            ProjectName <ExpandMore />
                        </Button>
                        <Menu anchorEl={projectMenuAnchorEl} open={isProjectMenuOpen} onClose={handleProjectMenuClose}>
                            <MenuItem onClick={handleProjectMenuClose}>Project 1</MenuItem>
                            <MenuItem onClick={handleProjectMenuClose}>Project 2</MenuItem>
                            <MenuItem onClick={handleProjectMenuClose}>Project 3</MenuItem>
                        </Menu>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                            <TextField
                                label={`Search node by ${searchMode}`}
                                variant="outlined"
                                sx={{ height: '36px', flexGrow: 1, maxWidth: '300px', marginRight: '8px' }}
                                size="small"
                                value={searchValue}
                                onChange={handleSearchChange}
                            />
                            <IconButton color="primary" size="large" onClick={handleSearchSubmit}>
                                <Search />
                            </IconButton>
                            <ToggleButtonGroup value={searchMode} exclusive color="primary" onChange={handleSearchModeChange}>
                                <ToggleButton value="id">ID</ToggleButton>
                                <ToggleButton value="text">Text</ToggleButton>
                            </ToggleButtonGroup>
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

                {/* Content below AppBar */}
                <Box sx={{ display: 'flex', flexGrow: 1, marginTop: '8vh' }}>
                    {/* Left Panel */}
                    <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column', gap: 2, padding: 2, borderRight: '1px solid #ddd' }}>
                        <Typography variant="h6">Project Name</Typography>
                        <TextField label="User Prompt" multiline rows={4} variant="outlined" value={userPrompt} onChange={handleUserPromptChange} fullWidth />
                        <TextField label="System Prompt" multiline rows={3} variant="outlined" disabled />
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Choose LLM</InputLabel>
                            <Select label="Choose LLM" value={selectedModel} onChange={handleModelChange}>
                                <MenuItem value="gpt-4-turbo">GPT-4 Turbo</MenuItem>
                                <MenuItem value="gpt-4o">GPT-4 Omni</MenuItem>
                            </Select>
                        </FormControl>
                        <Typography>Temperature: {temperature}</Typography>
                        <Slider value={temperature} min={0} max={2} step={0.1} onChange={handleTemperatureChange} />
                        <Typography>Max Tokens: {maxTokens}</Typography>
                        <Slider value={maxTokens} min={1} max={4000} step={1} onChange={handleMaxTokensChange} />
                        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                            {loading ? "Generating..." : "Send"}
                        </Button>
                    </Box>

                    {/* Right Panel */}
                    <Box sx={{ flexGrow: 1, padding: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {assistantResponse && (
                            <Box sx={{ marginTop: 2, width: '100%' }}>
                                <Typography variant="h6">Assistant Response</Typography>
                                <Box sx={{ width: '100%', height: '100px', overflowY: 'auto', wordWrap: 'break-word', whiteSpace: 'pre-wrap', border: '1px solid #ddd', padding: 1 }}>
                                    <Typography>{assistantResponse}</Typography>
                                </Box>
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
                                    style={{backgroundColor: backgroundPaneColor}}/>
                                {showMiniMap && <MiniMap/>}
                                <Controls style={{marginLeft: 25}}/>
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