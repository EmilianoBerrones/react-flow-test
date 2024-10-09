import React, { useState, useEffect } from 'react';
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

    const [exactMtch, setExactMtch] = useState(1);
    const [BleuScore, setBleuScore] = useState(1);
    const [SemSim, setSemSim] = useState(1);

    const [bleuCalculated, setBleuCalculated] = useState(1);
    const [SemSimFinal, setSemSimFinal] = useState(1);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);
    

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

    const handleExactMtchChange = (_event:any , value:number | number[]) => {
        setExactMtch(value as number);
    };

    const handleBleuScoreChange = (_event:any, value:number | number[]) => {
        setBleuScore(value as number);
    };

    const handleSemSimChange = (_event:any, value:number | number[]) => {
        setSemSim(value as number);
    }

    const handleSubmit = async () => {
        setLoading(true);
    
        // Function to extract text between labels
        const extractText = (text:any, startLabel:any, endLabel:any) => {
            const startIndex = text.indexOf(startLabel);
            const endIndex = text.indexOf(endLabel);
    
            if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
                const extracted = text.substring(startIndex + startLabel.length, endIndex).trim();
                console.log(`Extracted Text between ${startLabel} and ${endLabel}:`, extracted);
                return extracted;
            } else {
                console.log(`Could not find labels ${startLabel} or ${endLabel}`);
                return null;
            }
        };
    
        // Extract Assurance Case Pattern and Assurance Case
        const assuranceCasePattern = extractText(userPrompt, '@Assurance_Case_Pattern', '@End_Assurance_Case_Pattern');
        const assuranceCaseStartIndex = userPrompt.indexOf('@End_Assurance_Case_Pattern');
        const remainingText = userPrompt.substring(assuranceCaseStartIndex + '@End_Assurance_Case_Pattern'.length);
        const assuranceCase = extractText(remainingText, '@Assurance_Case', '@End_Assurance_Case');
    
        // Log extracted texts
        console.log("Extracted Assurance Case Pattern:", assuranceCasePattern);
        console.log("Extracted Assurance Case:", assuranceCase);
    
        // Check if extraction was successful
        if (!assuranceCasePattern || !assuranceCase) {
            setAssistantResponse("Error: Could not extract the assurance case pattern or assurance case.");
            setLoading(false);
            return;
        }
    
        try {
            // Step 1: Call compareTexts to get the similarity metrics
            const responseFromComparison = await compareTexts(assuranceCasePattern, assuranceCase);
    
            const exactMTCH = responseFromComparison.exact_match_score;
            const bleuScore = setBleuCalculated(responseFromComparison.bleu_score);
            const SemSim = setSemSimFinal(responseFromComparison.semantic_similarity_score);

            // Log the results
            console.log('Exact Match Score:', responseFromComparison.exact_match_score);
            console.log('BLEU Score:', responseFromComparison.bleu_score);
            console.log('Semantic Similarity Score:', responseFromComparison.semantic_similarity_score);
    
            // Step 2: Construct the similarity metrics string
            const similarityMetrics = `BLEU: ${responseFromComparison.bleu_score}, Semantic Similarity: ${responseFromComparison.semantic_similarity_score}`;
    
            // Step 3: Send the similarity metrics along with the user prompt to the Heroku API
            const response = await fetch('https://smartgsnopenai-cb66a3d6a0f4.herokuapp.com/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: userPrompt + similarityMetrics + MetricsThreshold,
                    model: selectedModel,
                    temperature: temperature,
                    max_tokens: maxTokens,
                    assuranceCasePattern,   // Send extracted Assurance Case Pattern
                    assuranceCase,          // Send extracted Assurance Case
                    fullSystemPrompt
                }),
            });
    
            if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
    
            const data = await response.text();
            setAssistantResponse(data);
        } catch (error) {
            console.error("Error in fetching data:", error);
            //@ts-ignore
            setAssistantResponse("An error occurred: " + error.message);
        } finally {
            setLoading(false);
        }
        return 
    };
    
    // Add this function to call your FastAPI server
    const compareTexts = async (text1:any, text2:any) => {
        const response = await fetch('https://pythonmetrics-e7c8fe7b3e52.herokuapp.com/compare_texts/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text1: text1,
                text2: text2,
            }),
        });
        const data = await response.json();
        return data;  // Return the similarity results
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

    const handleDomainInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDomainInfo(event.target.value);  // Update domainInfo when user types in the TextField
    };

    const openLogin = Boolean(anchorLogin);

    const preliminaryAC= `You are an assistant tasked with detecting an assurance case pattern within an assurance case both represented in Goal Structuring Notation (GSN). Your responsibility is to evaluate the similarity between an assurance case pattern and an assurance case using predefined metrics. Your role is to utilize the Goal Structuring Notation (GSN), contextual information, predicate-based rules and domain information provided to compute the similarity between an assurance case pattern and an assurance case. The metrics include the BLEU score, Exact Match, and Semantic Similarity. 

The rule for detecting the assurance case pattern within an assurance case is as follows: "If the BLEU score is higher than ‘X’ OR the exact match score is higher than ‘X’ OR if the semantic similarity is higher than ‘X’, then conclude that the pattern has been detected in the assurance case. Otherwise, conclude that the pattern has not been detected in the assurance case."

Note:

1.	The contextual information for an assurance case begins with the delimiter “@Context_Assurance_Case” and ends with the delimiter “@End_Context_Assurance_Case”

2.	The contextual information for an assurance case pattern begins with the delimiter “@Context_Assurance_Case_Pattern” and ends with the delimiter “@End_Context_Assurance_Case_Pattern”

3.	The predicate-based rules for the elements and decorator used in an assurance case and assurance case pattern begins with the delimiter “@Assurance_Case_Predicate” and ends with the delimiter “@End_Assurance_Case_Predicate”

4.	The predicate-based rules for the additional decorators used to support assurance case patterns to ease their understanding begins with the delimiter “@Assurance_Case_Pattern_Predicate” and ends with the delimiter “@End_Assurance_Case_Patten_Predicate”

5.	The predicate-based rules that helps to capture the hierarchical tree structure of an assurance case and an assurance case pattern represented in GSN begins with the delimiter “@Structural_Predicate” and ends with the delimiter “@End_Structural_Predicate”

6.	The domain information about the specific system for which we provide its assurance case and assurance case pattern begins with the delimiter “@Domain_Information” and ends with the delimiter “@End_Domain_Information”
`
const contextAC=`@Context_Assurance_Case
An assurance case, such as a safety case or security case, can be represented using Goal Structuring Notation (GSN), a visual representation that presents the elements of an assurance case in a tree structure. The main elements of a GSN assurance case include Goals, Strategies, Solutions (evidence), Contexts, Assumptions, and Justifications. 

Additionally, an assurance case in GSN may include an undeveloped element decorator, represented as a hollow diamond placed at the bottom center of a goal or strategy element. This indicates that a particular line of argument for the goal or strategy has not been fully developed and needs to be further developed.

Each element of an assurance case in GSN is explained below:

1.	 Goal – A goal is represented by a rectangle and denoted as G. It represents the claims made in the argument. Goals should contain only claims. For the top-level claim, it should contain the most fundamental objective of the entire assurance case.

2.	 Strategy – A strategy is represented by a parallelogram and denoted as S. It describes the reasoning that connects the parent goals and their supporting goals. A Strategy should only summarize the argument approach. The text in a strategy element is usually preceded by phrases such as “Argument by appeal to…”, “Argument by …”, “Argument across …” etc.

3.	 Solution – A solution is represented by a circle and denoted as Sn. A solution element makes no claims but are simply references to evidence that provides support to a claim.

4.	 Context (Rounded rectangles) – In GSN, context is represented by a rounded rectangle and denoted as C. The context element provides additional background information for an argument and the scope for a goal or strategy within an assurance case.

5.	 Assumption – An assumption element is represented by an oval with the letter ‘A’ at the top- or bottom-right. It presents an intentionally unsubstantiated statement accepted as true within an assurance case. It is denoted by A

6.	 Justification (Ovals) – A justification element is represented by an oval with the letter ‘J’ at the top- or bottom-right. It presents a statement of reasoning or rationale within an assurance case. It is denoted by J. 

@End_Context_Assurance_Case
`

const contextACP=`@Context_Assurance_Case_Pattern

Assurance case patterns in GSN (Goal Structuring Notation) are templates that can be re-used to create an assurance case. Assurance case patterns encapsulate common structures of argumentation that have been found effective for addressing recurrent safety, reliability, or security concerns. An assurance case pattern can be instantiated to develop an assurance case by replacing generic information in placeholder decorator with concrete or system specific information.

To represent assurance case patterns in GSN format, additional decorators have been provided to support assurance case patterns. These additional decorators are used together with the elements of an assurance case to represent assurance case pattern. The additional decorator to support assurance case pattern in GSN is explained below

1.	Uninstantiated - This decorator denotes that a GSN element remains to be instantiated, i.e. at some later stage, the generic information in placeholders within a GSN element needs to be replaced (instantiated) with a more concrete or system specific information. This decorator can be applied to any GSN element.

2.	Uninstantiated and Undeveloped – Both decorators of undeveloped and uninstantiated are overlaid to form this decorator. This decorator denotes that a GSN element requires both further development and instantiation. 

3.	Placeholders – This is represented as curly brackets “{}” within the description of an 
element to allow for customization. The placeholder "{}" should be directly inserted within the description of elements for which the predicate "HasPlaceholder (X)" returns true. The placeholder "{}" can sometimes be empty or contain generic information that will need to be replaced when an assurance case pattern is instantiated. 

4.	Choice - A solid diamond is the symbol for Choice. A GSN choice can be used to denote alternatives in satisfying a relationship or represent alternative lines of argument used to support a particular goal.

5.	Multiplicity - A solid ball is the symbol for multiple instantiations. It represents generalized n-ary relationships between GSN elements. Multiplicity symbols can be used to describe how many instances of one element-type relate to another element.

6.	Optionality - A hollow ball indicates ‘optional’ instantiation. Optionality represents optional and alternative relationships between GSN elements.

The following steps is used to create an assurance case from an Assurance cases pattern.

•	Create the assurance case using only elements and decorators defined for assurance cases.

•	Remove all additional assurance case pattern decorators such as (Uninstantiated, Placeholders, Choice, Multiplicity, Optionality, and the combined Uninstantiated and Undeveloped decorator)

•	Remove the placeholder symbol "{}" and replace all generic information in placeholders “{}” with system specific or concrete information.

“@End_Context_Assurance_Case_Pattern
`

const acPredicate=`@Assurance_Case_Predicate

1.	Goal(G): True if G is a goal within the assurance case. This predicate is represented as Goal (ID, Description) where ID is the unique identifier for the goal, and description is the textual information of the goal.

2.	Strategy(S): True if S is a strategy within the assurance case. This predicate is represented as Strategy (ID, Description) where ID is the unique identifier for the strategy and description is the textual information of the Strategy.

3.	Solution (Sn): True if Sn is evidence within the assurance case. This predicate is represented as Solution (ID, Description) where ID is the unique identifier for the evidence or solution and description is the textual information of the evidence.

4.	Context(C): True if C is a context within the assurance case. This predicate is represented as Context (ID, Description) where ID is the unique identifier for the context and description is the textual information of the context.

5.	Assumption (A): True if A is an assumption within the assurance case. This predicate is represented as Assumption (ID, Description) where ID is the unique identifier for the assumption and description is the textual information of the assumption.

6.	Justification (J): True if J is a justification within the assurance case. This predicate is represented as Justification (ID, Description) where ID is the unique identifier for the justification and description is the textual information of the justification.

7.	Undeveloped(X): True if X is either a Goal(G) or Strategy(S) marked as undeveloped. This predicate is represented as Undeveloped(X), where X can be either a goal or strategy.

@End_Assurance_Case_Predicate
`

const acPatternPredicate=`@Assurance_Case_Pattern_Predicate

1.	Uninstantiated (X): True if element X (can be any GSN element) is marked as uninstantiated.

2.	UndevelopStantiated (X): True if element X is either a Goal(G) or Strategy(S) and is marked both as uninstantiated and undeveloped.

3.	HasPlaceholder (X): True if element ‘X’ (can be any GSN element) contains a placeholder ‘{}’ within its description that needs instantiation.

4.	HasChoice (X, [Y], Label): True if an element ‘X’ (either a Goal(G) or Strategy(S)) can be supported by selecting among any number of elements in [Y] (where Y can be any GSN element) according to the cardinality specified by an optional Label. The label specifies the cardinality of the relationship between ‘X’ and ‘Y’. A label is of the general form “m of n” (e.g. a label given as “1 of 3” implies an element ‘X’ can be supported by any one of three possible supporting elements in [Y])

5.	HasMultiplicity (X, [Y], Label): True if multiple instances of an element X (either a Goal(G) or Strategy(S)) relate to multiple instances of another element [Y] (where Y can be any GSN element) according to the cardinality specified by an optional Label. The label specifies the cardinality of the relationship between X and Y. (i.e., how many instances of an element in X relates with how many instances of an element in [Y]. e.g. m of n implies m instances of an element in X must be supported by n instances of an element in Y)

6.	 IsOptional (X, [Y], Label): True if an element X (either a Goal(G) or Strategy(S)) can be optionally supported by another element [Y] (where Y can be any GSN element) according to the cardinality specified by an optional Label. The label specifies the cardinality of the relationship between X and Y. (i.e. an instance of an element in X may be supported by another instance of an element in [Y], but it is not required)

@End_Assurance_Case_Patten_Predicate
`

const StructuralPredicate=`@Structural_Predicate

1.	IncontextOf (X, [N], D): True if element X at depth D has a neighbour [N] to the left or right at depth D, where ‘[N]’ can be an Assumption (A), Justification (J), or Context (C), ‘X’ can be a Goal (G), or Strategy (S) and ‘D’ represents the height or depth of the goal or strategy element and its neighbours in the GSN hierarchical structure.

2.	SupportedBy (X, [C], D): True if element X at depth D has children [C] directly below it, where [C] can include Goal (G), Strategy (S), or Solution (Sn) and ‘X’ can be a Goal (G), or Strategy (S).
•	If X is Strategy (S), [C] can only be Goal (G).
•	If X is Goal (G), [C] can be either Goal (G), Strategy(S), or Solution (Sn).
@End_Structural_Predicate
`

const fullSystemPrompt=preliminaryAC+contextAC+contextACP+acPredicate+acPatternPredicate+StructuralPredicate+domainInfo;

const MetricsThreshold = `- If the BLEU score is higher than` + BleuScore.toString() + `OR the semantic similarity score is higher than`+ SemSim.toString() +`, conclude that the pattern has been detected in the assurance case.
- Otherwise, conclude that the pattern has not been detected in the assurance case.`;

    return (
        <div>
            <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
                <AppBar
                    position="fixed"
                    color="default"
                    sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height: '8vh', display: 'flex', justifyContent: 'center' }}
                >
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
                            height: 400,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                            overflowY: 'auto',
                        }}
                    >
                        <Typography id="system-prompt-title" variant="h6" component="h2">
                            Full System Prompt
                        </Typography>
                        <Typography
                            id="system-prompt-description"
                            sx={{ mt: 2, whiteSpace: 'pre-wrap' }}
                        >
                            {fullSystemPrompt} {/* Display the full system prompt here */}
                        </Typography>

                        <Button onClick={handleCloseModal} variant="contained" color="primary" sx={{ mt: 2 }}>
                            Close
                        </Button>
                    </Box>
                </Modal>

                {/* Content below AppBar */}
                <Box sx={{ display: 'flex', flexGrow: 1, marginTop: '8vh' }}>
                    {/* Left Panel */}
                    <Box
                        sx={{
                            width: '30%',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: 2,
                            borderRight: '1px solid #ddd',
                            overflowY: 'auto',
                            maxHeight: 'calc(100vh - 8vh)',
                        }}
                    >
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
                                    onChange={handleDomainInfoChange}
                                />
                                <TextField
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                    value={fullSystemPrompt}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    onClick={handleOpenModal}
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

                        <Accordion style={{ backgroundColor: '#f0f3f4', marginBottom: '8px' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                Similarity Metrics
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>BLEU Score{BleuScore}</Typography>
                                <Slider value={BleuScore} min={0} max={1} step={0.05} onChange={handleBleuScoreChange} />
                                <Typography>Semantic Similarity{SemSim}</Typography>
                                <Slider value={SemSim} min={0} max={1} step={0.05} onChange={handleSemSimChange} />
                            </AccordionDetails>
                        </Accordion>
                    </Box>

                    {/* Assistant Response Box */}
                    <Box
                        sx={{
                            flexGrow: 1, // Fills the remaining space next to the left panel
                            display: 'flex',
                            flexDirection: 'column',
                            padding: 2,
                            overflowY: 'auto', // Ensure it scrolls if the content is too long
                        }}
                    >
                        {assistantResponse && (
                            <Box
                                sx={{
                                    flexGrow: 1, // Allows the Box to grow and fill the available space
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                }}
                            >
                                <TextField
                                    id="AssuranceText"
                                    multiline
                                    fullWidth
                                    variant="outlined"
                                    value={assistantResponse}
                                    error={!isValidAssuranceText}
                                    helperText={!isValidAssuranceText ? 'Please check the format of the response.' : ''}
                                    sx={{
                                        flexGrow: 1, // Ensure the TextField grows to fill the parent Box
                                        maxHeight: isExpanded ? '600px' : 'auto', // Allow the box to expand up to 600px or grow naturally
                                        overflow: 'auto',
                                    }}
                                />
                                <IconButton sx={{ position: 'absolute', top: 5, right: 20 }} onClick={toggleExpand}>
                                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </IconButton>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </div>
    );

}

export default function PatternDetection() {
    return (
            <DetectionMenu />
    );
}