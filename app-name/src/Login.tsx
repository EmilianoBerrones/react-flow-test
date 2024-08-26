import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Firebase Resources
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";

const BackgroundBox = styled(Box)(({ theme }) => ({
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

const ProjectName = styled(Typography)(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(2),
    left: theme.spacing(2),
    color: theme.palette.primary.main,
    fontWeight: 'bold',
}));

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSignUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('User signed up:', userCredential.user);
        } catch (error) {
            console.error('Error signing up:', error.message);
        }
    };

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('User signed in:', userCredential.user);
            navigate('/'); // Redirect to the main page after successful login
        } catch (error) {
            console.error('Error signing in:', error.message);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log('User signed out');
        } catch (error) {
            console.error('Error signing out:', error.message);
        }
    };

    return (
        <BackgroundBox>
            <ProjectName variant="h4">
                ProjectName
            </ProjectName>
            <LoginBox>
                <Typography variant="h4" gutterBottom>
                    Welcome Back
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Please login to your account
                </Typography>
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
                    onClick={handleSignUp}
                >
                    Sign Up
                </Button>
                <Button
                    color="secondary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={handleLogout}
                >
                    Logout
                </Button>
                <Button
                    color="secondary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Forgot Password?
                </Button>
            </LoginBox>
        </BackgroundBox>
    );
};

export default LoginScreen;
