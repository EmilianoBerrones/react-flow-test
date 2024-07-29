import type {Node, NodeTypes} from "reactflow";
import {PositionLoggerNode} from "./PositionLoggerNode";
import {GoalNode} from "./customNode.tsx";
import {ContextNode} from "./customNode.tsx";
import {StrategyNode} from "./customNode.tsx";
import {AssumptionNode} from "./customNode.tsx";
import {JustificationNode} from "./customNode.tsx";
import {SolutionNode} from "./customNode.tsx";

export const initialNodes = [
    {
        id: 'G1',
        type: 'goal',
        data: {label: 'Map system is acceptably safe to operate', id: 'G1'},
        position: {x: 0, y: 0},
    },
    {
        id: 'C1',
        type: 'context',
        data: {label: 'Map systems is defined ', id: 'C1'},
        position: {x: 0, y: 100},
    },
    {
        id: 'C2',
        type: 'context',
        data: {label: 'Map role and context', id: 'C2'},
        position: {x: 0, y: 200},
    },
    {
        id: 'G2',
        type: 'goal',
        data: {label: 'All identified hazards have been eliminated or sufficiently mitigated', id: 'G2'},
        position: {x: 0, y: 300},
    },
    {
        id: 'C3',
        type: 'context',
        data: {label: 'Hazards identified from DAO', id: 'C3'},
        position: {x: 0, y: 400},
    },
    {
        id: 'S1',
        type: 'strategy',
        data: {label: 'Argumentation over each identified hazard undeveloped', id: 'S1',},
        position: {x: 0, y: 500},
    },
    {
        id: 'A1',
        type: 'assumption',
        data: {label: 'All hazards have been identified undeveloped', id: 'A1'},
        position: {x: 200, y: 100},
    },
    {
        id: 'G3',
        type: 'goal',
        data: {label: 'Hazard H1 has been eliminated', id: 'G3'},
        position: {x: 300, y: 300},
    },
    {
        id: 'Sn1',
        type: 'solution',
        data: {label: 'Safety rules execution undeveloped', id: 'Sn1'},
        position: {x: 300, y: 400},
    },
] satisfies Node[];

export const nodeTypes = {
    "position-logger": PositionLoggerNode,
    goal: GoalNode,
    goal_uninstantiated: GoalNode,
    goal_undeveloped: GoalNode,
    context: ContextNode,
    strategy: StrategyNode,
    assumption: AssumptionNode,
    justification: JustificationNode,
    solution: SolutionNode,
} satisfies NodeTypes;
