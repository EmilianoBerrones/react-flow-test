import type {Node, NodeTypes} from "reactflow";
import {PositionLoggerNode} from "./PositionLoggerNode";

export const initialNodes = [
    {
        id: 'G1',
        type: 'input',
        data: {label: 'Node G1'},
        position: {x: 0, y: 0},
    },
    {
        id: 'C1',
        data: {label: 'Node C1'},
        position: {x: 0, y: 100},
    },
    {
        id: 'C2',
        data: {label: 'Node C2'},
        position: {x: 0, y: 200},
    },
    {
        id: 'G2',
        data: {label: 'Node G2'},
        position: {x: 0, y: 300},
    },
    {
        id: 'C3',
        data: {label: 'Node C3'},
        position: {x: 0, y: 400},
    },
    {
        id: 'S1',
        data: {label: 'Node S1'},
        position: {x: 0, y: 500},
    },
    {
        id: 'A1',
        data: {label: 'Node A1'},
        position: {x: 200, y: 100},
    },
    {
        id: 'G3',
        data: {label: 'Node G3'},
        position: {x: 300, y: 300},
    },
    {
        id: 'Sn1',
        data: {label: 'Node Sn1'},
        position: {x: 300, y: 400},
    },
] satisfies Node[];

export const nodeTypes = {
    "position-logger": PositionLoggerNode,
    // Add any of your custom nodes here!
} satisfies NodeTypes;
