import {Box, TextField, Select, MenuItem, FormControl, InputLabel, Paper, Typography} from '@mui/material';

const LLMMenu = () => {
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
                    rows={3}
                    variant="outlined"
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
                <Box>
                    <TextField
                        label="Assistant Prompt"
                        multiline
                        fullWidth
                        rows={3}
                        variant="outlined"
                        disabled // Asumiendo que es solo de lectura
                    />
                </Box>

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
