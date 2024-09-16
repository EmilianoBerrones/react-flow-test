import { useState } from 'react';
import { TextField, Button, Typography, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Firebase Resources
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
// @ts-ignore
import { auth } from "./firebase";

import {
    BrowserRouter as Router,
    Route,
    Routes,
} from 'react-router-dom';

import FlowComponent from './App';

const BackgroundBox = styled(Box)(({ }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundImage: 'url(https://media.ed.edmunds-media.com/tesla/model-s/2024/oem/2024_tesla_model-s_sedan_plaid_fq_oem_1_1600.jpg)', // Replace with your image URL
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
}));

const LoginBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[5],
    maxWidth: 400,
    width: '100%',
    textAlign: 'center',
}));

const ToolName = styled(Typography)(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(2),
    left: theme.spacing(2),
    color: theme.palette.primary.main,
    fontWeight: 'bold',
}));

function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false); // State for Forgot Password dialog
    const [signUpOpen, setSignUpOpen] = useState(false); // State for Sign Up dialog
    const [signUpEmail, setSignUpEmail] = useState(''); // State for sign up email
    const [signUpPassword, setSignUpPassword] = useState(''); // State for sign up password
    const [signUpMessage, setSignUpMessage] = useState(''); // State for sign up response message
    const [resetEmail, setResetEmail] = useState(''); // State for reset email
    const [resetMessage, setResetMessage] = useState(''); // State for reset email response message
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSignUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
            console.log('User signed up:', userCredential.user);
            setSignUpMessage('Account created successfully!');
            setErrorMessage(''); // Clear any existing error message
        } catch (error) {
            // @ts-ignore
            console.error('Error signing up:', error.message);
            setSignUpMessage('Error signing up. Please try again.');
        }
    };

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('User signed in:', userCredential.user);
            setErrorMessage(''); // Clear any existing error message
            navigate('/App'); // Redirect to the main page after successful login
        } catch (error) {
            // @ts-ignore
            console.error('Error signing in:', error.message);
            setErrorMessage('Incorrect email or password. Please try again or sign up.');
        }
    };

    const handleForgotPassword = async () => {
        try {
            await sendPasswordResetEmail(auth, resetEmail);
            setResetMessage('Password reset email sent! Please check your inbox.');
        } catch (error) {
            // @ts-ignore
            console.error('Error sending password reset email:', error.message);
            setResetMessage('Error sending reset email. Please try again.');
        }
    };

    return (
        <BackgroundBox>
            <ToolName variant="h4">
                ToolName
            </ToolName>
            <LoginBox>
                <Typography variant="h4" gutterBottom>
                    Welcome Back
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Please login to your account
                </Typography>
                {errorMessage && (
                    <Typography variant="body2" color="error" gutterBottom>
                        {errorMessage}
                    </Typography>
                )}
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleLogin}
                >
                    Login
                </Button>
                <Button
                    color="secondary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => setSignUpOpen(true)}
                >
                    Sign Up
                </Button>
                <Button
                    color="secondary"
                    variant="text"
                    size="small"
                    onClick={() => setForgotPasswordOpen(true)}
                >
                    Forgot Password?
                </Button>
            </LoginBox>

            {/* Forgot Password Dialog */}
            <Dialog open={forgotPasswordOpen} onClose={() => setForgotPasswordOpen(false)}>
                <DialogTitle>Reset Password</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your email address to receive a link to reset your password.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                    />
                    {resetMessage && (
                        <Typography variant="body2" color={resetMessage.includes('sent') ? 'primary' : 'error'} gutterBottom>
                            {resetMessage}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleForgotPassword} color="primary">
                        Send Reset Link
                    </Button>
                    <Button onClick={() => setForgotPasswordOpen(false)} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Sign Up Dialog */}
            <Dialog open={signUpOpen} onClose={() => setSignUpOpen(false)}>
                <DialogTitle>Create an Account</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your email address and password to create a new account.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                    />
                    {signUpMessage && (
                        <Typography variant="body2" color={signUpMessage.includes('successfully') ? 'primary' : 'error'} gutterBottom>
                            {signUpMessage}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSignUp} color="primary">
                        Sign Up
                    </Button>
                    <Button onClick={() => setSignUpOpen(false)} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </BackgroundBox>
    );
};

export default function LoginRoutes(){
    return(
        <Router>
            <Routes>
                <Route path="/" element={<LoginScreen />} />
                <Route path="/App" element={<FlowComponent />} />
            </Routes>
        </Router>
    );
}
