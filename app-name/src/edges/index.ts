import {Edge, EdgeTypes, MarkerType} from "reactflow";

const arrowMarker = {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: 'red',
}

export const initialEdges = [
    {id: 'G1 to C1', source: 'G1', target: 'C1', animated: true, type: 'step', markerEnd: arrowMarker, style: {color: 'red'}},
    {id: 'G1 to C2', source: 'G1', target: 'C2', animated: true, type: 'step', markerEnd: arrowMarker, style: {color: 'red'}},
    {id: 'G1 to G2', source: 'G1', target: 'G2', animated: true, type: 'step', markerEnd: arrowMarker, style: {color: 'red'}},
    {id: 'G2 to C3', source: 'G2', target: 'C3', animated: true, type: 'step', markerEnd: arrowMarker, style: {color: 'red'}},
    {id: 'G2 to S1', source: 'G2', target: 'S1', animated: true, type: 'step', markerEnd: arrowMarker, style: {color: 'red'}},
    {id: 'S1 to A1', source: 'S1', target: 'A1', animated: true, type: 'step', markerEnd: arrowMarker, style: {color: 'red'}},
    {id: 'S1 to G3', source: 'S1', target: 'G3', animated: true, type: 'step', markerEnd: arrowMarker, style: {color: 'red'}},
    {id: 'G3 to Sn1', source: 'G3', target: 'Sn1', animated: true, type: 'step', markerEnd: arrowMarker, style: {color: 'red'}},
] satisfies Edge[];

export const edgeTypes = {
    // Add your custom edge types here!
} satisfies EdgeTypes;
