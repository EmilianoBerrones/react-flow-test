import type {Node, NodeTypes} from "reactflow";
import {GoalNode} from "./customNode.tsx";
import {ContextNode} from "./customNode.tsx";
import {StrategyNode} from "./customNode.tsx";
import {AssumptionNode} from "./customNode.tsx";
import {JustificationNode} from "./customNode.tsx";
import {SolutionNode} from "./customNode.tsx";

export const initialNodes = [
    
] satisfies Node[];

export const nodeTypes = {
    goal: GoalNode,
    goal_uninstantiated: GoalNode,
    goal_undeveloped: GoalNode,
    context: ContextNode,
    strategy: StrategyNode,
    assumption: AssumptionNode,
    justification: JustificationNode,
    solution: SolutionNode,
} satisfies NodeTypes;
