# qLearning3
Visualising qLearning. 
Link: https://slooi.github.io/qLearning3/

Keys:
S - start
A - agent

Uses the following formula to update agent's QMatrix:
(1-learningRate) * Q(s,a) + learningRate * [R(s,a) - movementCost + discount * MaxQVal(s',a)]

Variables values:
learningRate = 0.1
movementCost = 0.1
discount = 0.8
