import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDialog } from './DialogContext';
import {Grid, MenuItem, Select, SelectChangeEvent} from "@mui/material";

export default function FormDialog() {
    const { isOpen, closeDialog, setFormData } = useDialog();
    const [dropdownValue, setDropdownValue] = React.useState('');
    const [idValue, setIdValue] = React.useState('');

    const handleDropDownChange = (event: SelectChangeEvent) => {
        const selectedDropDownValue = event.target.value;
        setDropdownValue(selectedDropDownValue);
        let initialIdState = '';
        switch (selectedDropDownValue) {
            case 'Goal':
                initialIdState = 'G';
                break;
            case 'Context':
                initialIdState = 'C';
                break;
            case 'Assumption':
                initialIdState = 'A';
                break;
            case 'Justification':
                initialIdState = 'J';
                break;
            case 'Strategy':
                initialIdState = 'S';
                break;
            case 'Solution':
                initialIdState = 'Sn';
                break;
            default:
                break;
        }
        setIdValue(initialIdState);
    }

    return (
        <React.Fragment>
            <Dialog
                open={isOpen}
                fullWidth
                maxWidth="sm"
                onClose={closeDialog}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData as any).entries());
                        const nodeId = formJson.nodeId;
                        const nodeData = formJson.nodeData;
                        const dropdownOption = formJson.dropdown;
                        const result = nodeId + "," + nodeData;
                        setFormData(result);
                        closeDialog();
                    },
                }}
            >
                <DialogTitle>New node</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the new node's ID and content.
                    </DialogContentText>
                    <Grid container direction="column" spacing={1}>
                        <Grid item>
                            <Select
                                value={dropdownValue}
                                onChange={handleDropDownChange}
                                displayEmpty
                                inputProps={{name: 'dropdown', id: 'dropdown'}}
                                variant="standard"
                                margin="dense"
                            >
                                <MenuItem value="" disabled>
                                    Select an option
                                </MenuItem>
                                <MenuItem value="Goal">Goal</MenuItem>
                                <MenuItem value="Context">Context</MenuItem>
                                <MenuItem value="Assumption">Assumption</MenuItem>
                                <MenuItem value="Justification">Justification</MenuItem>
                                <MenuItem value="Strategy">Strategy</MenuItem>
                                <MenuItem value="Solution">Solution</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item>
                            <TextField
                                autoFocus
                                required
                                value={idValue}
                                onChange={(event) => setIdValue(event.target.value)}
                                margin="dense"
                                id="nodeId"
                                name="nodeId"
                                label="Node ID"
                                type="text"
                                variant="standard"
                            />
                        </Grid>
                        <Grid item style={{width: '100%'}}>
                            <TextField
                                autoFocus
                                required
                                minRows={3}
                                maxRows={10}
                                margin="dense"
                                id="nodeData"
                                name="nodeData"
                                label="Node content"
                                type="text"
                                fullWidth
                                variant="standard"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Cancel</Button>
                    <Button type="submit">Accept</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
