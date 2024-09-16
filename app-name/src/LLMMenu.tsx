import {Box, TextField, Select, MenuItem, FormControl, InputLabel, Paper, Typography, Button} from '@mui/material';
import {useState} from 'react';

const LLMMenu = () => {

    const [userPrompt, setUserPrompt] = useState('');
    const [assistantResponse, setAssistantResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUserPromptChange = (event:any) => {
        setUserPrompt(event.target.value);
    };

    // Handle form submit
    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain', // Sending plain text
                },
                body: userPrompt, // Sending user prompt as plain text
            });
    
            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }
    
            // Get the response as plain text
            const data = await response.text();
            setAssistantResponse(data); // Set the plain text response
        } catch (error:any) {
            console.error("Error in fetching data:", error);
            setAssistantResponse("An error occurred: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            {/* Columna Izquierda */}
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
                {/* User Prompt */}
                <TextField
                    label="User Prompt"
                    multiline
                    rows={4}
                    variant="outlined"
                    value={userPrompt}
                    onChange={handleUserPromptChange}
                    fullWidth
                />

                {/* System Prompt */}
                <TextField
                    label="System Prompt"
                    multiline
                    rows={3}
                    variant="outlined"
                    disabled // Asumiendo que es solo de lectura
                />

                {/* Choose LLM */}
                <FormControl fullWidth variant="outlined">
                    <InputLabel>Choose LLM</InputLabel>
                    <Select label="Choose LLM" defaultValue="">
                        <MenuItem value="gpt4-turbo">GPT-4 Turbo</MenuItem>
                        <MenuItem value="gpt4-omni">GPT-4 Omni</MenuItem>
                    </Select>
                </FormControl>

                {/* Section for Parameters */}
                <Paper sx={{ padding: 2, display: 'flex', gap: 1 }}>
                    {/* Ajusta este bloque según los parámetros específicos que desees mostrar */}
                    <Select defaultValue="">
                        <MenuItem value="param1">Param 1</MenuItem>
                        <MenuItem value="param2">Param 2</MenuItem>
                        <MenuItem value="param3">Param 3</MenuItem>
                    </Select>
                </Paper>

                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                {loading ? "Generating..." : "Send"}
                </Button>

            </Box>

            <Box
                sx={{
                    flexGrow: 1,
                    padding: 2,
                    display: 'flex',
                    flexDirection: 'column', // Aseguramos que los elementos se coloquen en columna
                    gap: 2, // Espacio entre el Assistant Prompt y el gráfico
                }}
            >
                {/* Assistant Prompt */}
                {assistantResponse && (
                <Box 
                sx={{ marginTop: 2, width: '100%' }} // Ensure it takes the full width of the container
            >
                <Typography variant="h6">Assistant Response</Typography>
                <Typography 
                    sx={{ 
                        width: '100%',   // Make sure it takes the full width of the containing box
                        wordWrap: 'break-word',  // Ensure long words wrap within the box
                        overflowWrap: 'break-word', // Support for breaking long words
                        whiteSpace: 'pre-wrap'  // Preserve line breaks in the text
                    }}
                >
                    {assistantResponse}
                </Typography>
            </Box>
                )}

                {/* Gráfico ocupa el espacio restante */}
                <Box
                    sx={{
                        flexGrow: 1, // Permite que el gráfico tome todo el espacio disponible
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////