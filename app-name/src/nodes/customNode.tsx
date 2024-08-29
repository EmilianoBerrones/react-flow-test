// customNode.tsx
import React, {useState} from 'react';
import {Handle, NodeToolbar, Position, useReactFlow} from 'reactflow';
import './customNodeDesign.css';
import {Button, Checkbox, Divider, Grid} from "@mui/material";
import {MuiColorInput} from "mui-color-input";


interface CustomNodeProps {
    id: string,
    data: {
        label: string,
        id: string
    };
}

export const GoalNode: React.FC<CustomNodeProps> = ({data, id}) => {
    const [backgroundColor, setBackgroundColor] = React.useState('#faefb6')
    const {setNodes, getNodes} = useReactFlow();
    const {setEdges, getEdges} = useReactFlow();

    let uninstantiated = false;
    let undeveloped = false;

    let displayed = data.label;

    if (data.label.includes('uninstantiated')) {
        uninstantiated = true;
        if (data.label.includes('and uninstantiated')) {
            displayed = displayed.replace('and uninstantiated', '').trim();
        } else {
            displayed = displayed.replace('uninstantiated', '').trim();
        }
    }

    if (data.label.includes('undeveloped')) {
        undeveloped = true;
        if (data.label.includes('and undeveloped')) {
            displayed = displayed.replace('and undeveloped', '').trim();
        } else {
            displayed = displayed.replace('undeveloped', '').trim();
        }
    }

    const [isUndeveloped, setIsUndeveloped] = useState(undeveloped);

    displayed = displayed.replace(/\s+/g, ' ').trim();

    const handleColorChange = (newValue: React.SetStateAction<string>) => {
        setBackgroundColor(newValue);
    }

    const handleLabel = () => {
        const newLabel = prompt('Enter the new label');
        if (newLabel) {
            data.label = newLabel;
            const nodes = getNodes();
            const newNodes = nodes.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            label: newLabel,
                        },
                    };
                }
                return node;
            });
            setNodes(newNodes);
        }
    };

    const handleId = () => {
        const newId = prompt('Enter the new ID');
        if (newId) {
            data.label = data.label + " ";
            const nodes = getNodes();
            const edges = getEdges();
            const newNodes = nodes.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        id: newId,
                        data: {
                            label: node.data.label,
                            id: newId,
                        },
                    };
                }
                return node;
            });
            console.log(newNodes);

            // Actualiza las conexiones de edges si las hay
            const newEdges = edges.map((edge) => {
                if (edge.source === id) {
                    return {
                        ...edge,
                        source: newId,
                    };
                }
                if (edge.target === id) {
                    return {
                        ...edge,
                        target: newId,
                    };
                }
                return edge;
            });

            setNodes(newNodes);
            setEdges(newEdges);
        }
    };

    const deleteNode = () => {
        const nodes = getNodes();
        const updatedNodes = nodes.filter((node) => node.id !== id);

        const edges = getEdges();
        const updatedEdges = edges.filter((edge) => edge.source !== id && edge.target !== id);

        setNodes(updatedNodes);
        setEdges(updatedEdges);
    };

    const handleDeveloping = () => {
        const newLabel = isUndeveloped
            ? data.label.replace('undeveloped', '').trim()
            : `${data.label} undeveloped`;

        data.label = newLabel;
        setIsUndeveloped(!isUndeveloped); // Actualiza el estado local

        const nodes = getNodes();
        const newNodes = nodes.map((node) => {
            if (node.id === id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        label: newLabel,
                    },
                };
            }
            return node;
        });
        setNodes(newNodes);
    };


    return (
        <div className="goalNode" style={{backgroundColor}}>
            {(uninstantiated || undeveloped) && (
                <div className="nodeAttribute__container">
                    {undeveloped && (
                        <div className="nodeAttribute__undevelopedContainer">
                            <div className="nodeAttribute__undeveloped"></div>
                        </div>
                    )}
                    {uninstantiated && (
                        <div className="nodeAttribute__uninstantiatedContainer">
                            <div className="nodeAttribute__uninstantiated"></div>
                        </div>
                    )}
                </div>
            )}
            <NodeToolbar>
                <Grid container direction="row">
                    <Grid item>
                        <Grid container direction='row' >
                            <Grid item xs={12} textAlign='center'>
                                Modify
                            </Grid>
                            <Grid item xs={12}>
                                <Divider></Divider>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="text" fullWidth onClick={handleId}>ID</Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="text" fullWidth onClick={handleLabel}>Label</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction='row'>
                            <Grid item xs={12} textAlign='center'>
                                Color
                            </Grid>
                            <Grid item xs={12} textAlign='center'>
                                <MuiColorInput format="hex" value={backgroundColor} onChange={handleColorChange}></MuiColorInput>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction='row'>
                            <Grid item xs={12} textAlign='center'>
                                Undevelop
                            </Grid>
                            <Grid item xs={12} textAlign='center'>
                                <Checkbox
                                    checked={isUndeveloped}
                                    onChange={() => {
                                        handleDeveloping(); // Cambia el estado 'isUndeveloped' y modifica el label del nodo
                                    }}
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" color='error' style={{height: '100%'}} onClick={deleteNode}>Delete</Button>
                    </Grid>
                </Grid>
            </NodeToolbar>
            <Handle type="target" style={{background: '#555'}} position={Position.Top}/>
            <div><b>{data.id}</b></div>
            <div>{displayed}</div>
            <Handle type="source" position={Position.Bottom} style={{background: '#555'}}/>
        </div>
    );
};

export const ContextNode: React.FC<CustomNodeProps> = ({data, id}) => {
    const [backgroundColor, setBackgroundColor] = React.useState('#faefb6')
    const {setNodes, getNodes} = useReactFlow();
    const {setEdges, getEdges} = useReactFlow();

    let uninstantiated = false;
    let undeveloped = false;

    let displayed = data.label;

    if (data.label.includes('uninstantiated')) {
        uninstantiated = true;
        if (data.label.includes('and uninstantiated')) {
            displayed = displayed.replace('and uninstantiated', '').trim();
        } else {
            displayed = displayed.replace('uninstantiated', '').trim();
        }
    }

    if (data.label.includes('undeveloped')) {
        undeveloped = true;
        if (data.label.includes('and undeveloped')) {
            displayed = displayed.replace('and undeveloped', '').trim();
        } else {
            displayed = displayed.replace('undeveloped', '').trim();
        }
    }

    const [isUndeveloped, setIsUndeveloped] = useState(undeveloped);

    displayed = displayed.replace(/\s+/g, ' ').trim();

    const handleColorChange = (newValue: React.SetStateAction<string>) => {
        setBackgroundColor(newValue);
    }

    const handleLabel = () => {
        const newLabel = prompt('Enter the new label');
        if (newLabel) {
            data.label = newLabel;
            const nodes = getNodes();
            const newNodes = nodes.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            label: newLabel,
                        },
                    };
                }
                return node;
            });
            setNodes(newNodes);
        }
    };

    const handleId = () => {
        const newId = prompt('Enter the new ID');
        if (newId) {
            data.label = data.label + " ";
            const nodes = getNodes();
            const edges = getEdges();
            const newNodes = nodes.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        id: newId,
                        data: {
                            label: node.data.label,
                            id: newId,
                        },
                    };
                }
                return node;
            });
            console.log(newNodes);

            // Actualiza las conexiones de edges si las hay
            const newEdges = edges.map((edge) => {
                if (edge.source === id) {
                    return {
                        ...edge,
                        source: newId,
                    };
                }
                if (edge.target === id) {
                    return {
                        ...edge,
                        target: newId,
                    };
                }
                return edge;
            });

            setNodes(newNodes);
            setEdges(newEdges);
        }
    };

    const deleteNode = () => {
        const nodes = getNodes();
        const updatedNodes = nodes.filter((node) => node.id !== id);

        const edges = getEdges();
        const updatedEdges = edges.filter((edge) => edge.source !== id && edge.target !== id);

        setNodes(updatedNodes);
        setEdges(updatedEdges);
    };

    const handleDeveloping = () => {
        const newLabel = isUndeveloped
            ? data.label.replace('undeveloped', '').trim()
            : `${data.label} undeveloped`;

        data.label = newLabel;
        setIsUndeveloped(!isUndeveloped); // Actualiza el estado local

        const nodes = getNodes();
        const newNodes = nodes.map((node) => {
            if (node.id === id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        label: newLabel,
                    },
                };
            }
            return node;
        });
        setNodes(newNodes);
    };

    return (
        <div className="contextNode" style={{backgroundColor}}>
            {(uninstantiated || undeveloped) && (
                <div className="nodeAttribute__container">
                    {undeveloped && (
                        <div className="nodeAttribute__undevelopedContainer">
                            <div className="nodeAttribute__undeveloped"></div>
                        </div>
                    )}
                    {uninstantiated && (
                        <div className="nodeAttribute__uninstantiatedContainer">
                            <div className="nodeAttribute__uninstantiated"></div>
                        </div>
                    )}
                </div>
            )}
            <NodeToolbar>
                <Grid container direction="row">
                    <Grid item>
                        <Grid container direction='row' >
                            <Grid item xs={12} textAlign='center'>
                                Modify
                            </Grid>
                            <Grid item xs={12}>
                                <Divider></Divider>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="text" fullWidth onClick={handleId}>ID</Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="text" fullWidth onClick={handleLabel}>Label</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction='row'>
                            <Grid item xs={12} textAlign='center'>
                                Color
                            </Grid>
                            <Grid item xs={12} textAlign='center'>
                                <MuiColorInput format="hex" value={backgroundColor} onChange={handleColorChange}></MuiColorInput>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction='row'>
                            <Grid item xs={12} textAlign='center'>
                                Undevelop
                            </Grid>
                            <Grid item xs={12} textAlign='center'>
                                <Checkbox
                                    checked={isUndeveloped}
                                    onChange={() => {
                                        handleDeveloping(); // Cambia el estado 'isUndeveloped' y modifica el label del nodo
                                    }}
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" color='error' style={{height: '100%'}} onClick={deleteNode}>Delete</Button>
                    </Grid>
                </Grid>
            </NodeToolbar>
            <Handle type="target" position={Position.Top} style={{background: '#555'}}/>
            <div><b>{data.id}</b></div>
            <div>{displayed}</div>
            <Handle type="source" position={Position.Bottom} style={{background: '#555'}}/>
        </div>
    );
};

export const StrategyNode: React.FC<CustomNodeProps> = ({data, id}) => {
    const [backgroundColor, setBackgroundColor] = React.useState('#faefb6')
    const {setNodes, getNodes} = useReactFlow();
    const {setEdges, getEdges} = useReactFlow();

    let uninstantiated = false;
    let undeveloped = false;

    let displayed = data.label;

    if (data.label.includes('uninstantiated')) {
        uninstantiated = true;
        if (data.label.includes('and uninstantiated')) {
            displayed = displayed.replace('and uninstantiated', '').trim();
        } else {
            displayed = displayed.replace('uninstantiated', '').trim();
        }
    }

    if (data.label.includes('undeveloped')) {
        undeveloped = true;
        if (data.label.includes('and undeveloped')) {
            displayed = displayed.replace('and undeveloped', '').trim();
        } else {
            displayed = displayed.replace('undeveloped', '').trim();
        }
    }

    const [isUndeveloped, setIsUndeveloped] = useState(undeveloped);

    displayed = displayed.replace(/\s+/g, ' ').trim();

    const handleColorChange = (newValue: React.SetStateAction<string>) => {
        setBackgroundColor(newValue);
    }

    const handleLabel = () => {
        const newLabel = prompt('Enter the new label');
        if (newLabel) {
            data.label = newLabel;
            const nodes = getNodes();
            const newNodes = nodes.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            label: newLabel,
                        },
                    };
                }
                return node;
            });
            setNodes(newNodes);
        }
    };

    const handleId = () => {
        const newId = prompt('Enter the new ID');
        if (newId) {
            data.label = data.label + " ";
            const nodes = getNodes();
            const edges = getEdges();
            const newNodes = nodes.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        id: newId,
                        data: {
                            label: node.data.label,
                            id: newId,
                        },
                    };
                }
                return node;
            });
            console.log(newNodes);

            // Actualiza las conexiones de edges si las hay
            const newEdges = edges.map((edge) => {
                if (edge.source === id) {
                    return {
                        ...edge,
                        source: newId,
                    };
                }
                if (edge.target === id) {
                    return {
                        ...edge,
                        target: newId,
                    };
                }
                return edge;
            });

            setNodes(newNodes);
            setEdges(newEdges);
        }
    };

    const deleteNode = () => {
        const nodes = getNodes();
        const updatedNodes = nodes.filter((node) => node.id !== id);

        const edges = getEdges();
        const updatedEdges = edges.filter((edge) => edge.source !== id && edge.target !== id);

        setNodes(updatedNodes);
        setEdges(updatedEdges);
    };

    const handleDeveloping = () => {
        const newLabel = isUndeveloped
            ? data.label.replace('undeveloped', '').trim()
            : `${data.label} undeveloped`;

        data.label = newLabel;
        setIsUndeveloped(!isUndeveloped); // Actualiza el estado local

        const nodes = getNodes();
        const newNodes = nodes.map((node) => {
            if (node.id === id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        label: newLabel,
                    },
                };
            }
            return node;
        });
        setNodes(newNodes);
    };

    return (
        <div>
            {(uninstantiated || undeveloped) && (
                <div className="nodeAttribute__container">
                    {undeveloped && (
                        <div className="nodeAttribute__undevelopedContainer">
                            <div className="nodeAttribute__undeveloped"></div>
                        </div>
                    )}
                    {uninstantiated && (
                        <div className="nodeAttribute__uninstantiatedContainer">
                            <div className="nodeAttribute__uninstantiated"></div>
                        </div>
                    )}
                </div>
            )}
            <NodeToolbar>
                <Grid container direction="row">
                    <Grid item>
                        <Grid container direction='row' >
                            <Grid item xs={12} textAlign='center'>
                                Modify
                            </Grid>
                            <Grid item xs={12}>
                                <Divider></Divider>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="text" fullWidth onClick={handleId}>ID</Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="text" fullWidth onClick={handleLabel}>Label</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction='row'>
                            <Grid item xs={12} textAlign='center'>
                                Color
                            </Grid>
                            <Grid item xs={12} textAlign='center'>
                                <MuiColorInput format="hex" value={backgroundColor} onChange={handleColorChange}></MuiColorInput>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction='row'>
                            <Grid item xs={12} textAlign='center'>
                                Undevelop
                            </Grid>
                            <Grid item xs={12} textAlign='center'>
                                <Checkbox
                                    checked={isUndeveloped}
                                    onChange={() => {
                                        handleDeveloping(); // Cambia el estado 'isUndeveloped' y modifica el label del nodo
                                    }}
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" color='error' style={{height: '100%'}} onClick={deleteNode}>Delete</Button>
                    </Grid>
                </Grid>
            </NodeToolbar>
            <div className="strategyNodeBorder">
                <div className="strategyNode" style={{backgroundColor}}>
                    <Handle type="target" style={{background: '#555'}} position={Position.Top}/>
                    <div><b>{data.id}</b></div>
                    <div>{displayed}</div>
                    <Handle type="source" position={Position.Bottom} style={{background: '#555'}}/>
                </div>
            </div>
        </div>
    );
};

export const AssumptionNode: React.FC<CustomNodeProps> = ({data, id}) => {
    const [backgroundColor, setBackgroundColor] = React.useState('#faefb6')
    const {setNodes, getNodes} = useReactFlow();
    const {setEdges, getEdges} = useReactFlow();

    let uninstantiated = false;
    let undeveloped = false;

    let displayed = data.label;

    if (data.label.includes('uninstantiated')) {
        uninstantiated = true;
        if (data.label.includes('and uninstantiated')) {
            displayed = displayed.replace('and uninstantiated', '').trim();
        } else {
            displayed = displayed.replace('uninstantiated', '').trim();
        }
    }

    if (data.label.includes('undeveloped')) {
        undeveloped = true;
        if (data.label.includes('and undeveloped')) {
            displayed = displayed.replace('and undeveloped', '').trim();
        } else {
            displayed = displayed.replace('undeveloped', '').trim();
        }
    }

    const [isUndeveloped, setIsUndeveloped] = useState(undeveloped);

    displayed = displayed.replace(/\s+/g, ' ').trim();

    const handleColorChange = (newValue: React.SetStateAction<string>) => {
        setBackgroundColor(newValue);
    }

    const handleLabel = () => {
        const newLabel = prompt('Enter the new label');
        if (newLabel) {
            data.label = newLabel;
            const nodes = getNodes();
            const newNodes = nodes.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            label: newLabel,
                        },
                    };
                }
                return node;
            });
            setNodes(newNodes);
        }
    };

    const handleId = () => {
        const newId = prompt('Enter the new ID');
        if (newId) {
            data.label = data.label + " ";
            const nodes = getNodes();
            const edges = getEdges();
            const newNodes = nodes.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        id: newId,
                        data: {
                            label: node.data.label,
                            id: newId,
                        },
                    };
                }
                return node;
            });
            console.log(newNodes);

            // Actualiza las conexiones de edges si las hay
            const newEdges = edges.map((edge) => {
                if (edge.source === id) {
                    return {
                        ...edge,
                        source: newId,
                    };
                }
                if (edge.target === id) {
                    return {
                        ...edge,
                        target: newId,
                    };
                }
                return edge;
            });

            setNodes(newNodes);
            setEdges(newEdges);
        }
    };

    const deleteNode = () => {
        const nodes = getNodes();
        const updatedNodes = nodes.filter((node) => node.id !== id);

        const edges = getEdges();
        const updatedEdges = edges.filter((edge) => edge.source !== id && edge.target !== id);

        setNodes(updatedNodes);
        setEdges(updatedEdges);
    };

    const handleDeveloping = () => {
        const newLabel = isUndeveloped
            ? data.label.replace('undeveloped', '').trim()
            : `${data.label} undeveloped`;

        data.label = newLabel;
        setIsUndeveloped(!isUndeveloped); // Actualiza el estado local

        const nodes = getNodes();
        const newNodes = nodes.map((node) => {
            if (node.id === id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        label: newLabel,
                    },
                };
            }
            return node;
        });
        setNodes(newNodes);
    };

    return (
        <div>
            {(uninstantiated || undeveloped) && (
                <div className="nodeAttribute__container">
                    {undeveloped && (
                        <div className="nodeAttribute__undevelopedContainer">
                            <div className="nodeAttribute__undeveloped"></div>
                        </div>
                    )}
                    {uninstantiated && (
                        <div className="nodeAttribute__uninstantiatedContainer">
                            <div className="nodeAttribute__uninstantiated"></div>
                        </div>
                    )}
                </div>
            )}
            <NodeToolbar>
                <Grid container direction="row">
                    <Grid item>
                        <Grid container direction='row' >
                            <Grid item xs={12} textAlign='center'>
                                Modify
                            </Grid>
                            <Grid item xs={12}>
                                <Divider></Divider>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="text" fullWidth onClick={handleId}>ID</Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="text" fullWidth onClick={handleLabel}>Label</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction='row'>
                            <Grid item xs={12} textAlign='center'>
                                Color
                            </Grid>
                            <Grid item xs={12} textAlign='center'>
                                <MuiColorInput format="hex" value={backgroundColor} onChange={handleColorChange}></MuiColorInput>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction='row'>
                            <Grid item xs={12} textAlign='center'>
                                Undevelop
                            </Grid>
                            <Grid item xs={12} textAlign='center'>
                                <Checkbox
                                    checked={isUndeveloped}
                                    onChange={() => {
                                        handleDeveloping(); // Cambia el estado 'isUndeveloped' y modifica el label del nodo
                                    }}
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" color='error' style={{height: '100%'}} onClick={deleteNode}>Delete</Button>
                    </Grid>
                </Grid>
            </NodeToolbar>
            <div className="ajNodeBorder">
                <div className="ajNode" style={{backgroundColor}}>
                    <Handle type="target" style={{background: '#555'}} position={Position.Top}/>
                    <div><b>{data.id}</b></div>
                    <div>{displayed}</div>
                    <Handle type="source" position={Position.Bottom} style={{background: '#555'}}/>
                </div>
            </div>
            <div className="ajLetter">
                A
            </div>
        </div>
    );
};

export const JustificationNode: React.FC<CustomNodeProps> = ({data, id}) => {
    const [backgroundColor, setBackgroundColor] = React.useState('#faefb6')
    const {setNodes, getNodes} = useReactFlow();
    const {setEdges, getEdges} = useReactFlow();

    let uninstantiated = false;
    let undeveloped = false;

    let displayed = data.label;

    if (data.label.includes('uninstantiated')) {
        uninstantiated = true;
        if (data.label.includes('and uninstantiated')) {
            displayed = displayed.replace('and uninstantiated', '').trim();
        } else {
            displayed = displayed.replace('uninstantiated', '').trim();
        }
    }

    if (data.label.includes('undeveloped')) {
        undeveloped = true;
        if (data.label.includes('and undeveloped')) {
            displayed = displayed.replace('and undeveloped', '').trim();
        } else {
            displayed = displayed.replace('undeveloped', '').trim();
        }
    }

    const [isUndeveloped, setIsUndeveloped] = useState(undeveloped);

    displayed = displayed.replace(/\s+/g, ' ').trim();

    const handleColorChange = (newValue: React.SetStateAction<string>) => {
        setBackgroundColor(newValue);
    }

    const handleLabel = () => {
        const newLabel = prompt('Enter the new label');
        if (newLabel) {
            data.label = newLabel;
            const nodes = getNodes();
            const newNodes = nodes.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            label: newLabel,
                        },
                    };
                }
                return node;
            });
            setNodes(newNodes);
        }
    };

    const handleId = () => {
        const newId = prompt('Enter the new ID');
        if (newId) {
            data.label = data.label + " ";
            const nodes = getNodes();
            const edges = getEdges();
            const newNodes = nodes.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        id: newId,
                        data: {
                            label: node.data.label,
                            id: newId,
                        },
                    };
                }
                return node;
            });
            console.log(newNodes);

            // Actualiza las conexiones de edges si las hay
            const newEdges = edges.map((edge) => {
                if (edge.source === id) {
                    return {
                        ...edge,
                        source: newId,
                    };
                }
                if (edge.target === id) {
                    return {
                        ...edge,
                        target: newId,
                    };
                }
                return edge;
            });

            setNodes(newNodes);
            setEdges(newEdges);
        }
    };

    const deleteNode = () => {
        const nodes = getNodes();
        const updatedNodes = nodes.filter((node) => node.id !== id);

        const edges = getEdges();
        const updatedEdges = edges.filter((edge) => edge.source !== id && edge.target !== id);

        setNodes(updatedNodes);
        setEdges(updatedEdges);
    };

    const handleDeveloping = () => {
        const newLabel = isUndeveloped
            ? data.label.replace('undeveloped', '').trim()
            : `${data.label} undeveloped`;

        data.label = newLabel;
        setIsUndeveloped(!isUndeveloped); // Actualiza el estado local

        const nodes = getNodes();
        const newNodes = nodes.map((node) => {
            if (node.id === id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        label: newLabel,
                    },
                };
            }
            return node;
        });
        setNodes(newNodes);
    };

    return (
        <div>
            {(uninstantiated || undeveloped) && (
                <div className="nodeAttribute__container">
                    {undeveloped && (
                        <div className="nodeAttribute__undevelopedContainer">
                            <div className="nodeAttribute__undeveloped"></div>
                        </div>
                    )}
                    {uninstantiated && (
                        <div className="nodeAttribute__uninstantiatedContainer">
                            <div className="nodeAttribute__uninstantiated"></div>
                        </div>
                    )}
                </div>
            )}
            <NodeToolbar>
                <Grid container direction="row">
                    <Grid item>
                        <Grid container direction='row' >
                            <Grid item xs={12} textAlign='center'>
                                Modify
                            </Grid>
                            <Grid item xs={12}>
                                <Divider></Divider>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="text" fullWidth onClick={handleId}>ID</Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="text" fullWidth onClick={handleLabel}>Label</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction='row'>
                            <Grid item xs={12} textAlign='center'>
                                Color
                            </Grid>
                            <Grid item xs={12} textAlign='center'>
                                <MuiColorInput format="hex" value={backgroundColor} onChange={handleColorChange}></MuiColorInput>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction='row'>
                            <Grid item xs={12} textAlign='center'>
                                Undevelop
                            </Grid>
                            <Grid item xs={12} textAlign='center'>
                                <Checkbox
                                    checked={isUndeveloped}
                                    onChange={() => {
                                        handleDeveloping(); // Cambia el estado 'isUndeveloped' y modifica el label del nodo
                                    }}
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" color='error' style={{height: '100%'}} onClick={deleteNode}>Delete</Button>
                    </Grid>
                </Grid>
            </NodeToolbar>
            <div className="ajNodeBorder">
                <div className="ajNode" style={{backgroundColor}}>
                    <Handle type="target" style={{background: '#555'}} position={Position.Top}/>
                    <div><b>{data.id}</b></div>
                    <div>{displayed}</div>
                    <Handle type="source" position={Position.Bottom} style={{background: '#555'}}/>
                </div>
            </div>
            <div className='ajLetter'>
                J
            </div>
        </div>
    );
};

export const SolutionNode: React.FC<CustomNodeProps> = ({data, id}) => {
    const [backgroundColor, setBackgroundColor] = React.useState('#faefb6')
    const {setNodes, getNodes} = useReactFlow();
    const {setEdges, getEdges} = useReactFlow();

    let uninstantiated = false;
    let undeveloped = false;

    let displayed = data.label;

    if (data.label.includes('uninstantiated')) {
        uninstantiated = true;
        if (data.label.includes('and uninstantiated')) {
            displayed = displayed.replace('and uninstantiated', '').trim();
        } else {
            displayed = displayed.replace('uninstantiated', '').trim();
        }
    }

    if (data.label.includes('undeveloped')) {
        undeveloped = true;
        if (data.label.includes('and undeveloped')) {
            displayed = displayed.replace('and undeveloped', '').trim();
        } else {
            displayed = displayed.replace('undeveloped', '').trim();
        }
    }

    const [isUndeveloped, setIsUndeveloped] = useState(undeveloped);

    displayed = displayed.replace(/\s+/g, ' ').trim();

    const handleColorChange = (newValue: React.SetStateAction<string>) => {
        setBackgroundColor(newValue);
    }

    const handleLabel = () => {
        const newLabel = prompt('Enter the new label');
        if (newLabel) {
            data.label = newLabel;
            const nodes = getNodes();
            const newNodes = nodes.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            label: newLabel,
                        },
                    };
                }
                return node;
            });
            setNodes(newNodes);
        }
    };

    const handleId = () => {
        const newId = prompt('Enter the new ID');
        if (newId) {
            data.label = data.label + " ";
            const nodes = getNodes();
            const edges = getEdges();
            const newNodes = nodes.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        id: newId,
                        data: {
                            label: node.data.label,
                            id: newId,
                        },
                    };
                }
                return node;
            });
            console.log(newNodes);

            // Actualiza las conexiones de edges si las hay
            const newEdges = edges.map((edge) => {
                if (edge.source === id) {
                    return {
                        ...edge,
                        source: newId,
                    };
                }
                if (edge.target === id) {
                    return {
                        ...edge,
                        target: newId,
                    };
                }
                return edge;
            });

            setNodes(newNodes);
            setEdges(newEdges);
        }
    };

    const deleteNode = () => {
        const nodes = getNodes();
        const updatedNodes = nodes.filter((node) => node.id !== id);

        const edges = getEdges();
        const updatedEdges = edges.filter((edge) => edge.source !== id && edge.target !== id);

        setNodes(updatedNodes);
        setEdges(updatedEdges);
    };

    const handleDeveloping = () => {
        const newLabel = isUndeveloped
            ? data.label.replace('undeveloped', '').trim()
            : `${data.label} undeveloped`;

        data.label = newLabel;
        setIsUndeveloped(!isUndeveloped); // Actualiza el estado local

        const nodes = getNodes();
        const newNodes = nodes.map((node) => {
            if (node.id === id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        label: newLabel,
                    },
                };
            }
            return node;
        });
        setNodes(newNodes);
    };

    return (
        <div>
            {(uninstantiated || undeveloped) && (
                <div className="nodeAttribute__container">
                    {undeveloped && (
                        <div className="nodeAttribute__undevelopedContainer">
                            <div className="nodeAttribute__undeveloped"></div>
                        </div>
                    )}
                    {uninstantiated && (
                        <div className="nodeAttribute__uninstantiatedContainer">
                            <div className="nodeAttribute__uninstantiated"></div>
                        </div>
                    )}
                </div>
            )}
            <NodeToolbar>
                <Grid container direction="row">
                    <Grid item>
                        <Grid container direction='row' >
                            <Grid item xs={12} textAlign='center'>
                                Modify
                            </Grid>
                            <Grid item xs={12}>
                                <Divider></Divider>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="text" fullWidth onClick={handleId}>ID</Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="text" fullWidth onClick={handleLabel}>Label</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction='row'>
                            <Grid item xs={12} textAlign='center'>
                                Color
                            </Grid>
                            <Grid item xs={12} textAlign='center'>
                                <MuiColorInput format="hex" value={backgroundColor} onChange={handleColorChange}></MuiColorInput>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction='row'>
                            <Grid item xs={12} textAlign='center'>
                                Undevelop
                            </Grid>
                            <Grid item xs={12} textAlign='center'>
                                <Checkbox
                                    checked={isUndeveloped}
                                    onChange={() => {
                                        handleDeveloping(); // Cambia el estado 'isUndeveloped' y modifica el label del nodo
                                    }}
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" color='error' style={{height: '100%'}} onClick={deleteNode}>Delete</Button>
                    </Grid>
                </Grid>
            </NodeToolbar>
            <div className="solutionNodeBorder">
                <div className="solutionNode" style={{backgroundColor}}>
                    <Handle type="target" style={{background: '#555'}} position={Position.Top}/>
                    <div><b>{data.id}</b></div>
                    <div style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}>{displayed}</div>
                    <Handle type="source" position={Position.Bottom} style={{background: '#555'}}/>
                </div>
            </div>
        </div>
    );
};