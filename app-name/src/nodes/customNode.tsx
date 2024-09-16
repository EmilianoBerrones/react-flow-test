// customNode.tsx
import React, {useState} from 'react';
import {Handle, NodeToolbar, Position, useReactFlow} from 'reactflow';
import './customNodeDesign.css';
import {Button, Checkbox, Divider, Grid, TextField} from "@mui/material";
import {MuiColorInput} from "mui-color-input";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";


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
    const [isLabelDialogOpen, setIsLabelDialogOpen] = useState(false); // Estado para abrir/cerrar el dialog
    const [isIdDialogOpen, setIsIdDialogOpen] = useState(false);
    const [newLabel, setNewLabel] = useState(data.label); // Estado para almacenar el nuevo labe
    const [newId, setNewId] = useState(data.id);

    const cleanLabel = (label: string, terms: string[]): string => {
        const regex = new RegExp(`\\(([^()]*(${terms.join('|')})[^()]*)\\)`, 'gi');
        return label.replace(regex, '').trim();
    };

    let uninstantiated = false;
    let undeveloped = false;

    let displayed = data.label;

    if (/uninstantiated/i.test(displayed)) {
        uninstantiated = true;
    }

    if (/undeveloped/i.test(displayed)) {
        undeveloped = true;
    }

    displayed = cleanLabel(displayed, ['undeveloped', 'uninstantiated']);

    if (uninstantiated) {
        displayed = displayed.replace(/(?:and\s)?uninstantiated/i, '').trim();
    }

    if (undeveloped) {
        displayed = displayed.replace(/(?:and\s)?undeveloped/i, '').trim();
    }

    displayed = displayed.replace(/\s+/g, ' ').trim();

    const [isUndeveloped, setIsUndeveloped] = useState(undeveloped);

    const handleColorChange = (newValue: React.SetStateAction<string>) => {
        setBackgroundColor(newValue);
    }

    const handleOpenLabelDialog = () => {
        setIsLabelDialogOpen(true); // Abre el diálogo
    };

    const handleCloseLabelDialog = () => {
        setIsLabelDialogOpen(false); // Cierra el diálogo sin hacer cambios
    };

    const handleOpenIdDialog = () => {
        setIsIdDialogOpen(true);
    };

    const handleCloseIdDialog = () => {
        setIsIdDialogOpen(false);
    }

    const handleAcceptLabelDialog = () => {
        if (newLabel.trim() !== '') {
            data.label = newLabel; // Actualiza el label del nodo
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
            setNodes(newNodes); // Actualiza los nodos
        }
        setIsLabelDialogOpen(false); // Cierra el diálogo después de aceptar
    };

    const handleAcceptIdDialog = () => {
        if (newId.trim() !== ''){
            data.label = data.label + " ";
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
    }

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
                                <Button variant="text" fullWidth onClick={handleOpenIdDialog}>ID</Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="text" fullWidth onClick={handleOpenLabelDialog}>Label</Button>
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
            <React.Fragment>
                <Dialog open={isLabelDialogOpen} onClose={handleCloseLabelDialog}>
                    <DialogTitle>Modify label</DialogTitle>
                    <DialogContent>
                        <Grid container direction="column" style={{width: '40vh'}} spacing={1}>
                            <Grid item>
                                Enter the new label
                            </Grid>
                            <Grid item>
                                <TextField
                                    fullWidth
                                    value={newLabel}
                                    onChange={(e) => setNewLabel(e.target.value)} // Actualiza el nuevo label
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseLabelDialog}>Close</Button>
                        <Button onClick={handleAcceptLabelDialog} disabled={newLabel.trim() === ''}>Accept</Button> {/* Deshabilitar si el label está vacío */}
                    </DialogActions>
                </Dialog>
            </React.Fragment>
            <React.Fragment>
                <Dialog open={isIdDialogOpen} onClose={handleCloseIdDialog}>
                    <DialogTitle>Modify ID</DialogTitle>
                    <DialogContent>
                        <Grid container direction="column" style={{width: '40vh'}} spacing={1}>
                            <Grid item>
                                Enter the new id
                            </Grid>
                            <Grid item>
                                <TextField
                                    fullWidth
                                    value={newId}
                                    helperText="Example: 'G1'. It is case sensitive, and changes in the letter will be reflected in the type of node."
                                    onChange={(e) => setNewId(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseIdDialog}>Close</Button>
                        <Button onClick={handleAcceptIdDialog} disabled={newId.trim() === ''}>Accept</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>

        </div>
    );
};

export const ContextNode: React.FC<CustomNodeProps> = ({data, id}) => {
    const [backgroundColor, setBackgroundColor] = React.useState('#faefb6')
    const {setNodes, getNodes} = useReactFlow();
    const {setEdges, getEdges} = useReactFlow();
    const [isLabelDialogOpen, setIsLabelDialogOpen] = useState(false); // Estado para abrir/cerrar el dialog
    const [isIdDialogOpen, setIsIdDialogOpen] = useState(false);
    const [newLabel, setNewLabel] = useState(data.label); // Estado para almacenar el nuevo labe
    const [newId, setNewId] = useState(data.id);

    const cleanLabel = (label: string, terms: string[]): string => {
        const regex = new RegExp(`\\(([^()]*(${terms.join('|')})[^()]*)\\)`, 'gi');
        return label.replace(regex, '').trim();
    };

    let uninstantiated = false;
    let undeveloped = false;

    let displayed = data.label;

    if (/uninstantiated/i.test(displayed)) {
        uninstantiated = true;
    }

    if (/undeveloped/i.test(displayed)) {
        undeveloped = true;
    }

    displayed = cleanLabel(displayed, ['undeveloped', 'uninstantiated']);

    if (uninstantiated) {
        displayed = displayed.replace(/(?:and\s)?uninstantiated/i, '').trim();
    }

    if (undeveloped) {
        displayed = displayed.replace(/(?:and\s)?undeveloped/i, '').trim();
    }

    displayed = displayed.replace(/\s+/g, ' ').trim();

    const [isUndeveloped, setIsUndeveloped] = useState(undeveloped);

    const handleColorChange = (newValue: React.SetStateAction<string>) => {
        setBackgroundColor(newValue);
    }

    const handleOpenLabelDialog = () => {
        setIsLabelDialogOpen(true); // Abre el diálogo
    };

    const handleCloseLabelDialog = () => {
        setIsLabelDialogOpen(false); // Cierra el diálogo sin hacer cambios
    };

    const handleOpenIdDialog = () => {
        setIsIdDialogOpen(true);
    };

    const handleCloseIdDialog = () => {
        setIsIdDialogOpen(false);
    }

    const handleAcceptLabelDialog = () => {
        if (newLabel.trim() !== '') {
            data.label = newLabel; // Actualiza el label del nodo
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
            setNodes(newNodes); // Actualiza los nodos
        }
        setIsLabelDialogOpen(false); // Cierra el diálogo después de aceptar
    };

    const handleAcceptIdDialog = () => {
        if (newId.trim() !== ''){
            data.label = data.label + " ";
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
    }

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
                                <Button variant="text" fullWidth onClick={handleOpenIdDialog}>ID</Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="text" fullWidth onClick={handleOpenLabelDialog}>Label</Button>
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
            <React.Fragment>
                <Dialog open={isLabelDialogOpen} onClose={handleCloseLabelDialog}>
                    <DialogTitle>Modify label</DialogTitle>
                    <DialogContent>
                        <Grid container direction="column" style={{width: '40vh'}} spacing={1}>
                            <Grid item>
                                Enter the new label
                            </Grid>
                            <Grid item>
                                <TextField
                                    fullWidth
                                    value={newLabel}
                                    onChange={(e) => setNewLabel(e.target.value)} // Actualiza el nuevo label
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseLabelDialog}>Close</Button>
                        <Button onClick={handleAcceptLabelDialog} disabled={newLabel.trim() === ''}>Accept</Button> {/* Deshabilitar si el label está vacío */}
                    </DialogActions>
                </Dialog>
            </React.Fragment>
            <React.Fragment>
                <Dialog open={isIdDialogOpen} onClose={handleCloseIdDialog}>
                    <DialogTitle>Modify ID</DialogTitle>
                    <DialogContent>
                        <Grid container direction="column" style={{width: '40vh'}} spacing={1}>
                            <Grid item>
                                Enter the new id
                            </Grid>
                            <Grid item>
                                <TextField
                                    fullWidth
                                    value={newId}
                                    helperText="Example: 'C1'. It is case sensitive, and changes in the letter will be reflected in the type of node."
                                    onChange={(e) => setNewId(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseIdDialog}>Close</Button>
                        <Button onClick={handleAcceptIdDialog} disabled={newId.trim() === ''}>Accept</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </div>
    );
};

export const StrategyNode: React.FC<CustomNodeProps> = ({data, id}) => {
    const [backgroundColor, setBackgroundColor] = React.useState('#faefb6')
    const {setNodes, getNodes} = useReactFlow();
    const {setEdges, getEdges} = useReactFlow();
    const [isLabelDialogOpen, setIsLabelDialogOpen] = useState(false); // Estado para abrir/cerrar el dialog
    const [isIdDialogOpen, setIsIdDialogOpen] = useState(false);
    const [newLabel, setNewLabel] = useState(data.label); // Estado para almacenar el nuevo labe
    const [newId, setNewId] = useState(data.id);

    const cleanLabel = (label: string, terms: string[]): string => {
        const regex = new RegExp(`\\(([^()]*(${terms.join('|')})[^()]*)\\)`, 'gi');
        return label.replace(regex, '').trim();
    };

    let uninstantiated = false;
    let undeveloped = false;

    let displayed = data.label;

    if (/uninstantiated/i.test(displayed)) {
        uninstantiated = true;
    }

    if (/undeveloped/i.test(displayed)) {
        undeveloped = true;
    }

    displayed = cleanLabel(displayed, ['undeveloped', 'uninstantiated']);

    if (uninstantiated) {
        displayed = displayed.replace(/(?:and\s)?uninstantiated/i, '').trim();
    }

    if (undeveloped) {
        displayed = displayed.replace(/(?:and\s)?undeveloped/i, '').trim();
    }

    displayed = displayed.replace(/\s+/g, ' ').trim();

    const [isUndeveloped, setIsUndeveloped] = useState(undeveloped);

    const handleColorChange = (newValue: React.SetStateAction<string>) => {
        setBackgroundColor(newValue);
    }

    const handleOpenLabelDialog = () => {
        setIsLabelDialogOpen(true); // Abre el diálogo
    };

    const handleCloseLabelDialog = () => {
        setIsLabelDialogOpen(false); // Cierra el diálogo sin hacer cambios
    };

    const handleOpenIdDialog = () => {
        setIsIdDialogOpen(true);
    };

    const handleCloseIdDialog = () => {
        setIsIdDialogOpen(false);
    }

    const handleAcceptLabelDialog = () => {
        if (newLabel.trim() !== '') {
            data.label = newLabel; // Actualiza el label del nodo
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
            setNodes(newNodes); // Actualiza los nodos
        }
        setIsLabelDialogOpen(false); // Cierra el diálogo después de aceptar
    };

    const handleAcceptIdDialog = () => {
        if (newId.trim() !== ''){
            data.label = data.label + " ";
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
    }

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
                                <Button variant="text" fullWidth onClick={handleOpenIdDialog}>ID</Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="text" fullWidth onClick={handleOpenLabelDialog}>Label</Button>
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
            <React.Fragment>
                <Dialog open={isLabelDialogOpen} onClose={handleCloseLabelDialog}>
                    <DialogTitle>Modify label</DialogTitle>
                    <DialogContent>
                        <Grid container direction="column" style={{width: '40vh'}} spacing={1}>
                            <Grid item>
                                Enter the new label
                            </Grid>
                            <Grid item>
                                <TextField
                                    fullWidth
                                    value={newLabel}
                                    onChange={(e) => setNewLabel(e.target.value)} // Actualiza el nuevo label
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseLabelDialog}>Close</Button>
                        <Button onClick={handleAcceptLabelDialog} disabled={newLabel.trim() === ''}>Accept</Button> {/* Deshabilitar si el label está vacío */}
                    </DialogActions>
                </Dialog>
            </React.Fragment>
            <React.Fragment>
                <Dialog open={isIdDialogOpen} onClose={handleCloseIdDialog}>
                    <DialogTitle>Modify ID</DialogTitle>
                    <DialogContent>
                        <Grid container direction="column" style={{width: '40vh'}} spacing={1}>
                            <Grid item>
                                Enter the new id
                            </Grid>
                            <Grid item>
                                <TextField
                                    fullWidth
                                    value={newId}
                                    helperText="Example: 'S1'. It is case sensitive, and changes in the letter will be reflected in the type of node."
                                    onChange={(e) => setNewId(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseIdDialog}>Close</Button>
                        <Button onClick={handleAcceptIdDialog} disabled={newId.trim() === ''}>Accept</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </div>
    );
};

export const AssumptionNode: React.FC<CustomNodeProps> = ({data, id}) => {
    const [backgroundColor, setBackgroundColor] = React.useState('#faefb6')
    const {setNodes, getNodes} = useReactFlow();
    const {setEdges, getEdges} = useReactFlow();
    const [isLabelDialogOpen, setIsLabelDialogOpen] = useState(false); // Estado para abrir/cerrar el dialog
    const [isIdDialogOpen, setIsIdDialogOpen] = useState(false);
    const [newLabel, setNewLabel] = useState(data.label); // Estado para almacenar el nuevo labe
    const [newId, setNewId] = useState(data.id);

    const cleanLabel = (label: string, terms: string[]): string => {
        const regex = new RegExp(`\\(([^()]*(${terms.join('|')})[^()]*)\\)`, 'gi');
        return label.replace(regex, '').trim();
    };

    let uninstantiated = false;
    let undeveloped = false;

    let displayed = data.label;

    if (/uninstantiated/i.test(displayed)) {
        uninstantiated = true;
    }

    if (/undeveloped/i.test(displayed)) {
        undeveloped = true;
    }

    displayed = cleanLabel(displayed, ['undeveloped', 'uninstantiated']);

    if (uninstantiated) {
        displayed = displayed.replace(/(?:and\s)?uninstantiated/i, '').trim();
    }

    if (undeveloped) {
        displayed = displayed.replace(/(?:and\s)?undeveloped/i, '').trim();
    }

    displayed = displayed.replace(/\s+/g, ' ').trim();

    const [isUndeveloped, setIsUndeveloped] = useState(undeveloped);

    const handleColorChange = (newValue: React.SetStateAction<string>) => {
        setBackgroundColor(newValue);
    }

    const handleOpenLabelDialog = () => {
        setIsLabelDialogOpen(true); // Abre el diálogo
    };

    const handleCloseLabelDialog = () => {
        setIsLabelDialogOpen(false); // Cierra el diálogo sin hacer cambios
    };

    const handleOpenIdDialog = () => {
        setIsIdDialogOpen(true);
    };

    const handleCloseIdDialog = () => {
        setIsIdDialogOpen(false);
    }

    const handleAcceptLabelDialog = () => {
        if (newLabel.trim() !== '') {
            data.label = newLabel; // Actualiza el label del nodo
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
            setNodes(newNodes); // Actualiza los nodos
        }
        setIsLabelDialogOpen(false); // Cierra el diálogo después de aceptar
    };

    const handleAcceptIdDialog = () => {
        if (newId.trim() !== ''){
            data.label = data.label + " ";
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
    }

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
                                <Button variant="text" fullWidth onClick={handleOpenIdDialog}>ID</Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="text" fullWidth onClick={handleOpenLabelDialog}>Label</Button>
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
            <React.Fragment>
                <Dialog open={isLabelDialogOpen} onClose={handleCloseLabelDialog}>
                    <DialogTitle>Modify label</DialogTitle>
                    <DialogContent>
                        <Grid container direction="column" style={{width: '40vh'}} spacing={1}>
                            <Grid item>
                                Enter the new label
                            </Grid>
                            <Grid item>
                                <TextField
                                    fullWidth
                                    value={newLabel}
                                    onChange={(e) => setNewLabel(e.target.value)} // Actualiza el nuevo label
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseLabelDialog}>Close</Button>
                        <Button onClick={handleAcceptLabelDialog} disabled={newLabel.trim() === ''}>Accept</Button> {/* Deshabilitar si el label está vacío */}
                    </DialogActions>
                </Dialog>
            </React.Fragment>
            <React.Fragment>
                <Dialog open={isIdDialogOpen} onClose={handleCloseIdDialog}>
                    <DialogTitle>Modify ID</DialogTitle>
                    <DialogContent>
                        <Grid container direction="column" style={{width: '40vh'}} spacing={1}>
                            <Grid item>
                                Enter the new id
                            </Grid>
                            <Grid item>
                                <TextField
                                    fullWidth
                                    value={newId}
                                    helperText="Example: 'A1'. It is case sensitive, and changes in the letter will be reflected in the type of node."
                                    onChange={(e) => setNewId(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseIdDialog}>Close</Button>
                        <Button onClick={handleAcceptIdDialog} disabled={newId.trim() === ''}>Accept</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </div>
    );
};

export const JustificationNode: React.FC<CustomNodeProps> = ({data, id}) => {
    const [backgroundColor, setBackgroundColor] = React.useState('#faefb6')
    const {setNodes, getNodes} = useReactFlow();
    const {setEdges, getEdges} = useReactFlow();
    const [isLabelDialogOpen, setIsLabelDialogOpen] = useState(false); // Estado para abrir/cerrar el dialog
    const [isIdDialogOpen, setIsIdDialogOpen] = useState(false);
    const [newLabel, setNewLabel] = useState(data.label); // Estado para almacenar el nuevo labe
    const [newId, setNewId] = useState(data.id);

    const cleanLabel = (label: string, terms: string[]): string => {
        const regex = new RegExp(`\\(([^()]*(${terms.join('|')})[^()]*)\\)`, 'gi');
        return label.replace(regex, '').trim();
    };

    let uninstantiated = false;
    let undeveloped = false;

    let displayed = data.label;

    if (/uninstantiated/i.test(displayed)) {
        uninstantiated = true;
    }

    if (/undeveloped/i.test(displayed)) {
        undeveloped = true;
    }

    displayed = cleanLabel(displayed, ['undeveloped', 'uninstantiated']);

    if (uninstantiated) {
        displayed = displayed.replace(/(?:and\s)?uninstantiated/i, '').trim();
    }

    if (undeveloped) {
        displayed = displayed.replace(/(?:and\s)?undeveloped/i, '').trim();
    }

    displayed = displayed.replace(/\s+/g, ' ').trim();

    const [isUndeveloped, setIsUndeveloped] = useState(undeveloped);

    const handleColorChange = (newValue: React.SetStateAction<string>) => {
        setBackgroundColor(newValue);
    }

    const handleOpenLabelDialog = () => {
        setIsLabelDialogOpen(true); // Abre el diálogo
    };

    const handleCloseLabelDialog = () => {
        setIsLabelDialogOpen(false); // Cierra el diálogo sin hacer cambios
    };

    const handleOpenIdDialog = () => {
        setIsIdDialogOpen(true);
    };

    const handleCloseIdDialog = () => {
        setIsIdDialogOpen(false);
    }

    const handleAcceptLabelDialog = () => {
        if (newLabel.trim() !== '') {
            data.label = newLabel; // Actualiza el label del nodo
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
            setNodes(newNodes); // Actualiza los nodos
        }
        setIsLabelDialogOpen(false); // Cierra el diálogo después de aceptar
    };

    const handleAcceptIdDialog = () => {
        if (newId.trim() !== ''){
            data.label = data.label + " ";
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
    }

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
                                <Button variant="text" fullWidth onClick={handleOpenIdDialog}>ID</Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="text" fullWidth onClick={handleOpenLabelDialog}>Label</Button>
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
            <React.Fragment>
                <Dialog open={isLabelDialogOpen} onClose={handleCloseLabelDialog}>
                    <DialogTitle>Modify label</DialogTitle>
                    <DialogContent>
                        <Grid container direction="column" style={{width: '40vh'}} spacing={1}>
                            <Grid item>
                                Enter the new label
                            </Grid>
                            <Grid item>
                                <TextField
                                    fullWidth
                                    value={newLabel}
                                    onChange={(e) => setNewLabel(e.target.value)} // Actualiza el nuevo label
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseLabelDialog}>Close</Button>
                        <Button onClick={handleAcceptLabelDialog} disabled={newLabel.trim() === ''}>Accept</Button> {/* Deshabilitar si el label está vacío */}
                    </DialogActions>
                </Dialog>
            </React.Fragment>
            <React.Fragment>
                <Dialog open={isIdDialogOpen} onClose={handleCloseIdDialog}>
                    <DialogTitle>Modify ID</DialogTitle>
                    <DialogContent>
                        <Grid container direction="column" style={{width: '40vh'}} spacing={1}>
                            <Grid item>
                                Enter the new id
                            </Grid>
                            <Grid item>
                                <TextField
                                    fullWidth
                                    value={newId}
                                    helperText="Example: 'J1'. It is case sensitive, and changes in the letter will be reflected in the type of node."
                                    onChange={(e) => setNewId(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseIdDialog}>Close</Button>
                        <Button onClick={handleAcceptIdDialog} disabled={newId.trim() === ''}>Accept</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </div>
    );
};

export const SolutionNode: React.FC<CustomNodeProps> = ({data, id}) => {
    const [backgroundColor, setBackgroundColor] = React.useState('#faefb6')
    const {setNodes, getNodes} = useReactFlow();
    const {setEdges, getEdges} = useReactFlow();
    const [isLabelDialogOpen, setIsLabelDialogOpen] = useState(false); // Estado para abrir/cerrar el dialog
    const [isIdDialogOpen, setIsIdDialogOpen] = useState(false);
    const [newLabel, setNewLabel] = useState(data.label); // Estado para almacenar el nuevo labe
    const [newId, setNewId] = useState(data.id);

    const cleanLabel = (label: string, terms: string[]): string => {
        const regex = new RegExp(`\\(([^()]*(${terms.join('|')})[^()]*)\\)`, 'gi');
        return label.replace(regex, '').trim();
    };

    let uninstantiated = false;
    let undeveloped = false;

    let displayed = data.label;

    if (/uninstantiated/i.test(displayed)) {
        uninstantiated = true;
    }

    if (/undeveloped/i.test(displayed)) {
        undeveloped = true;
    }

    displayed = cleanLabel(displayed, ['undeveloped', 'uninstantiated']);

    if (uninstantiated) {
        displayed = displayed.replace(/(?:and\s)?uninstantiated/i, '').trim();
    }

    if (undeveloped) {
        displayed = displayed.replace(/(?:and\s)?undeveloped/i, '').trim();
    }

    displayed = displayed.replace(/\s+/g, ' ').trim();

    const [isUndeveloped, setIsUndeveloped] = useState(undeveloped);

    const handleColorChange = (newValue: React.SetStateAction<string>) => {
        setBackgroundColor(newValue);
    }

    const handleOpenLabelDialog = () => {
        setIsLabelDialogOpen(true); // Abre el diálogo
    };

    const handleCloseLabelDialog = () => {
        setIsLabelDialogOpen(false); // Cierra el diálogo sin hacer cambios
    };

    const handleOpenIdDialog = () => {
        setIsIdDialogOpen(true);
    };

    const handleCloseIdDialog = () => {
        setIsIdDialogOpen(false);
    }

    const handleAcceptLabelDialog = () => {
        if (newLabel.trim() !== '') {
            data.label = newLabel; // Actualiza el label del nodo
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
            setNodes(newNodes); // Actualiza los nodos
        }
        setIsLabelDialogOpen(false); // Cierra el diálogo después de aceptar
    };

    const handleAcceptIdDialog = () => {
        if (newId.trim() !== ''){
            data.label = data.label + " ";
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
    }

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
                                <Button variant="text" fullWidth onClick={handleOpenIdDialog}>ID</Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="text" fullWidth onClick={handleOpenLabelDialog}>Label</Button>
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
            <React.Fragment>
                <Dialog open={isLabelDialogOpen} onClose={handleCloseLabelDialog}>
                    <DialogTitle>Modify label</DialogTitle>
                    <DialogContent>
                        <Grid container direction="column" style={{width: '40vh'}} spacing={1}>
                            <Grid item>
                                Enter the new label
                            </Grid>
                            <Grid item>
                                <TextField
                                    fullWidth
                                    value={newLabel}
                                    onChange={(e) => setNewLabel(e.target.value)} // Actualiza el nuevo label
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseLabelDialog}>Close</Button>
                        <Button onClick={handleAcceptLabelDialog} disabled={newLabel.trim() === ''}>Accept</Button> {/* Deshabilitar si el label está vacío */}
                    </DialogActions>
                </Dialog>
            </React.Fragment>
            <React.Fragment>
                <Dialog open={isIdDialogOpen} onClose={handleCloseIdDialog}>
                    <DialogTitle>Modify ID</DialogTitle>
                    <DialogContent>
                        <Grid container direction="column" style={{width: '40vh'}} spacing={1}>
                            <Grid item>
                                Enter the new id
                            </Grid>
                            <Grid item>
                                <TextField
                                    fullWidth
                                    value={newId}
                                    helperText="Example: 'Sn1'. It is case sensitive, and changes in the letter will be reflected in the type of node."
                                    onChange={(e) => setNewId(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseIdDialog}>Close</Button>
                        <Button onClick={handleAcceptIdDialog} disabled={newId.trim() === ''}>Accept</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </div>
    );
};