# qLearning3
Visualising qLearning. Link: https://slooi.github.io/qLearning3/

## Keys:

S - start

A - agent


## Variables values:
learningRate = 0.1

movementCost = 0.1

discount = 0.8

## Update function

The agent's QMatrix is updated using:

(1-learningRate) * Q(s,a) + learningRate * [R(s,a) - movementCost + discount * MaxQVal(s',a)]

## Actions
The agent can only move in one direction at a time: up, down, left or right.

The agent can not move outside the map

## How an action is chosen
The agent chooses a random action 50% of the time.

The other 50% of the time, the agent uses its QMatrix to choose the best possible action given its current state. In the event multiple actions have the same Qvalue / equally good, one of those actions are randomly selected.
