import type {Node, NodeTypes} from "reactflow";
import {PositionLoggerNode} from "./PositionLoggerNode";

export const initialNodes = [
    {
        id: 'G1',
        data: {label: 'Map system is acceptably safe to operate'},
        position: {x: 0, y: 0},
    },
    {
        id: 'C1',
        data: {label: 'Map systems is defined '},
        position: {x: 0, y: 100},
    },
    {
        id: 'C2',
        data: {label: 'Map role and context'},
        position: {x: 0, y: 200},
    },
    {
        id: 'G2',
        data: {label: 'All identified hazards have been eliminated or sufficiently mitigated'},
        position: {x: 0, y: 300},
    },
    {
        id: 'C3',
        data: {label: 'Hazards identified from DAO'},
        position: {x: 0, y: 400},
    },
    {
        id: 'S1',
        data: {label: 'Argumentation over each identified hazard'},
        position: {x: 0, y: 500},
    },
    {
        id: 'A1',
        data: {label: 'All hazards have been identified'},
        position: {x: 200, y: 100},
    },
    {
        id: 'G3',
        data: {label: 'Hazard H1 has been eliminated'},
        position: {x: 300, y: 300},
    },
    {
        id: 'Sn1',
        data: {label: 'Safety rules execution'},
        position: {x: 300, y: 400},
    },
] satisfies Node[];

export const nodeTypes = {
    "position-logger": PositionLoggerNode,
    // Add any of your custom nodes here!
} satisfies NodeTypes;
