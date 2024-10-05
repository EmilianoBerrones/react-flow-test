import React, { useState } from 'react';
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
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Modal,
} from '@mui/material';

import {
    AppBar, Avatar, IconButton, Menu, Toolbar, Tooltip, Divider, ListItemIcon
} from "@mui/material";
import { Logout, ExpandMore, Menu as MenuIcon } from "@mui/icons-material";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { useNavigate } from 'react-router-dom';

function DetectionMenu() {
    const [userPrompt, setUserPrompt] = useState('');
    const [assistantResponse, setAssistantResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedModel, setSelectedModel] = useState('gpt-4-turbo');
    const [temperature, setTemperature] = useState(1);
    const [maxTokens, setMaxTokens] = useState(4000);
    const [isValidAssuranceText, setIsValidAssuranceText] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [domainInfo, setDomainInfo] = useState('');
    const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const [projectName, setProjectName] = useState('Project Name');
    const [anchorLogin, setAnchorLogin] = useState<null | HTMLElement>(null);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const fullSystemPrompt="Hola chat";

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorMenu(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorMenu(null);
    };

    const handleUserPromptChange = (event: any) => {
        setUserPrompt(event.target.value);
    };

    const handleModelChange = (event: any) => {
        setSelectedModel(event.target.value);
    };

    const handleTemperatureChange = (_event: any, value: number | number[]) => {
        setTemperature(value as number);
    };

    const handleMaxTokensChange = (_event: any, value: number | number[]) => {
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

    const toggleExpand = () => {
        setIsExpanded(prev => !prev);
    };

    const handleTravelClick = () => {
        navigate('/App');
    };
    const handleTravelLogout = () => {
        navigate('/');
    }

    const handleProjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProjectName(event.target.value);  // Update the project name state
    };

    const handleLoginClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorLogin(event.currentTarget);
    };
    const handleLoginClose = () => {
        setAnchorLogin(null);
    };

    const openLogin = Boolean(anchorLogin);

    return (
        <div>
            <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
            <AppBar position="fixed" color="default" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height: '8vh', display: 'flex', justifyContent: 'center' }}>
                    <Toolbar sx={{ minHeight: '8vh', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
                        <IconButton onClick={handleMenuClick} size="large" edge="start" color="primary" aria-label="menu" sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                        <Menu anchorEl={anchorMenu} open={Boolean(anchorMenu)} onClose={handleMenuClose}>
                            <MenuItem onClick={handleTravelClick}>Assurance case editor</MenuItem>
                            <MenuItem>Pattern instantiation</MenuItem>
                            <MenuItem>Pattern detection</MenuItem>
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
                            </Box>
                        </Box>

                        <Accordion style={{ backgroundColor: '#f0f3f4', marginBottom: '8px' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                User Prompt
                            </AccordionSummary>
                            <AccordionDetails>
                                <TextField multiline rows={4} variant="outlined" value={userPrompt} onChange={handleUserPromptChange} fullWidth />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion style={{ backgroundColor: '#f0f3f4', marginBottom: '8px' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                System Prompt
                            </AccordionSummary>
                            <AccordionDetails>
                                <TextField
                                    label="Enter Domain Info"
                                    variant="outlined"
                                    fullWidth
                                    value={domainInfo}
                                    onChange={(e) => setDomainInfo(e.target.value)}
                                />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion style={{ backgroundColor: '#f0f3f4', marginBottom: '8px' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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

                    {/* Assistant Response Box */}
                    <Box sx={{ flexGrow: 1, padding: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {assistantResponse && (
                            <Box sx={{ position: 'relative' }}>
                                <TextField
                                    id="AssuranceText"
                                    multiline
                                    fullWidth
                                    variant="outlined"
                                    value={assistantResponse}
                                    error={!isValidAssuranceText}
                                    helperText={!isValidAssuranceText ? 'Please check the format of the response.' : ''}
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
                    </Box>
                </Box>
            </Box>

            {/* Modal for System Prompt */}
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
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography id="system-prompt-title" variant="h6">
                        Full System Prompt
                    </Typography>
                    <Typography id="system-prompt-description" sx={{ mt: 2 }}>
                        {domainInfo}
                    </Typography>
                    <Button onClick={handleCloseModal} variant="contained" color="primary" sx={{ mt: 2 }}>
                        Close
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}

export default function PatternDetection() {
    return (
            <DetectionMenu />
    );
}