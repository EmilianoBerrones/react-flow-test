import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Paper, Typography, Button, Slider } from '@mui/material';
import { useState } from 'react';

const LLMMenu = () => {
    const [userPrompt, setUserPrompt] = useState('');
    const [assistantResponse, setAssistantResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState('gpt-4o'); // Default to gpt-4o
    const [temperature, setTemperature] = useState(1); // Default temperature to 1
    const [maxTokens, setMaxTokens] = useState(4000); // Default max tokens to 4000

    const handleUserPromptChange = (event: any) => {
        setUserPrompt(event.target.value);
    };

    const handleModelChange = (event: any) => {
        setSelectedModel(event.target.value);
    };

    const handleTemperatureChange = (event: any, value: number | number[]) => {
        setTemperature(value as number);
    };

    const handleMaxTokensChange = (event: any, value: number | number[]) => {
        setMaxTokens(value as number);
    };

    // Handle form submit
    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Send JSON
                },
                body: JSON.stringify({
                    prompt: userPrompt,
                    model: selectedModel,
                    temperature: temperature,
                    max_tokens: maxTokens // Include max_tokens in the request
                }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const data = await response.text();
            setAssistantResponse(data);
        } catch (error: any) {
            console.error("Error in fetching data:", error);
            setAssistantResponse("An error occurred: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Box
                sx={{
                    width: '30%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    padding: 2,
                    borderRight: '1px solid #ddd',
                }}
            >
                <Typography variant="h6" component="div">
                    Project Name
                </Typography>

                <TextField
                    label="User Prompt"
                    multiline
                    rows={4}
                    variant="outlined"
                    value={userPrompt}
                    onChange={handleUserPromptChange}
                    fullWidth
                />

                <TextField
                    label="System Prompt"
                    multiline
                    rows={3}
                    variant="outlined"
                    disabled
                />

                <FormControl fullWidth variant="outlined">
                    <InputLabel>Choose LLM</InputLabel>
                    <Select label="Choose LLM" value={selectedModel} onChange={handleModelChange}>
                        <MenuItem value="gpt-4-turbo">GPT-4 Turbo</MenuItem>
                        <MenuItem value="gpt-4o">GPT-4 Omni</MenuItem>
                    </Select>
                </FormControl>

                <Typography>Temperature: {temperature}</Typography>
                <Slider
                    value={temperature}
                    min={0}
                    max={2}
                    step={0.1}
                    onChange={handleTemperatureChange}
                    aria-labelledby="temperature-slider"
                />

                {/* Slider for Max Tokens */}
                <Typography>Max Tokens: {maxTokens}</Typography>
                <Slider
                    value={maxTokens}
                    min={1}
                    max={4000}
                    step={1}
                    onChange={handleMaxTokensChange}
                    aria-labelledby="max-tokens-slider"
                />

                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Generating..." : "Send"}
                </Button>
            </Box>

            <Box
                sx={{
                    flexGrow: 1,
                    padding: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                {assistantResponse && (
                    <Box
                        sx={{ marginTop: 2, width: '100%' }} // Ensure it takes the full width of the container
                    >
                        <Typography variant="h6">Assistant Response</Typography>
                        <Box
                            sx={{
                                width: '100%',   // Make sure it takes the full width of the containing box
                                height: '200px', // Set a fixed height for the response box (adjust as needed)
                                overflowY: 'auto',  // Enable vertical scrolling when content exceeds the height
                                wordWrap: 'break-word',  // Ensure long words wrap within the box
                                overflowWrap: 'break-word', // Support for breaking long words
                                whiteSpace: 'pre-wrap',  // Preserve line breaks in the text
                                border: '1px solid #ddd',  // Optional: add a border for clarity
                                padding: 1,  // Optional: add padding for better readability
                            }}
                        >
                            <Typography>
                                {assistantResponse}
                            </Typography>
                        </Box>
                    </Box>
                )}

                <Box
                    sx={{
                        flexGrow: 1,
                        border: '1px solid #ddd',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    React Flow
                </Box>
            </Box>
        </Box>
    );
};

export default LLMMenu;
