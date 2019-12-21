console.log('main.js loaded')

// Algorithm
let learningRate = 0.1
let discount = 0.8
const moveCost = 0.1

// World
// let rMatrix = [[0,0,0],[0,0,0],[0,0,0]]
// Map which shows the reward if you land on that title
// let map = [
// 	[0,		0,	0,	-1,	0],
// 	[-1,	0,	0,	0,	0],
// 	[0,		0,	0,	-1,	0],
// 	[0,		-1,	-1,	-1,	0],
// 	[0,		0,	0,	0,	10]
// ]

// World Information
// let map = [
// 	[0,		0],
// 	[0,	-1],
// 	[0, 10]
// ]
let map = [
	[0,		0, -10, -10],
	[-1,	-1, -10, -10],
	[10, -1, -10, 100]
]
const spawn = {
	x: 0,
	y: 0
}

// Player Information
let qMatrix = createQMatrix(map,4)
let state = [spawn.x,spawn.y]
let reward = 0


function createQMatrix(map,numOfActions){
	const tempM = new Array(map.length)
	map.forEach((row,i)=>{
		tempM[i] = new Array(map[0].length).fill(0).map(ele=>new Array(numOfActions).fill(0))
	})

	return tempM
}

function step(){
	for(let i=0;i<1;i++){
		// Determine action
		const action = getAction(state)
		// update state & get reward
		const previousState = state
		const feedbackRes = feedback(state,action)
		state = feedbackRes[0]
		reward = feedbackRes[1]
		// update qMatrix
		updateQMatrix(qMatrix,previousState,state,action,reward)
	}
}

function updateQMatrix(qMatrix,previousState,currentState,previousAction,r){
	const preQVal = qMatrix[previousState[1]][previousState[0]][previousAction]
	const preQVals = qMatrix[previousState[1]][previousState[0]]
	const currentQVals = qMatrix[currentState[1]][currentState[0]]
	preQVals[previousAction] = (1 - learningRate) * preQVal + learningRate * (r - moveCost + discount * maxQ(currentQVals))
}

function maxQ(qVals){
	return qVals.reduce((holder,value)=>Math.max(holder,value))
}

function feedback(state,action){
	const newState = updateState(state,action)
	const reward = getReward(newState)
	return [newState, reward]
}

function getReward(newState){
	return map[newState[1]][newState[0]]
}

function updateState(state,action){
	// Will move in direction if possible
	const newState = new Array(2).fill(0)
	const actionVec = actionIndexToVec(action)
	newState[0] = state[0] + actionVec[0]
	newState[1] = state[1] + actionVec[1]

	if(checkStateInMap(newState,map)){
		return newState
	}
	return state	
}

function checkStateInMap(state,map){
	// Check if above or left of map
	if(state[0] < 0 || state[1] < 0){
		return false
	}
	// Check if underneath or right of map
	if(state[0] >= map[0].length || state[1] >= map.length){
		return false
	}

	return true
}

// returns action
// state: 1D array with two values
function getAction(state){
	// Randomly selects an action 50% of the time
	if(Math.random() < 0.5){
		// choose action randomly 

		const actionIndex = ranInt(0,3)
		const action = actionIndexToVec(actionIndex)
		return actionIndex
	}else{
		// choose action from qMatrix 

		const actionQVals = qMatrix[state[1]][state[0]]
		let highestVal = actionQVals[0]
		let highestValIndex = [0]
		// add highest QVal to list my replace/add
		for(let i=1;i<actionQVals.length;i++){
			if(actionQVals[i]>highestVal){
				highestVal = actionQVals[i]
				highestValIndex = [i]
			}else if(actionQVals[i]===highestVal){
				highestValIndex.push(i)
			}
		}
		// Randomly select an action from list of best actions
		const actionIndex = highestValIndex[ranInt(0,highestValIndex.length-1)]
		const action = actionIndexToVec(actionIndex)
		return actionIndex
	}
}

function actionIndexToVec(actionIndex){
	// action index:		0				1				2				3
	// action actual:		[-1,0]	[1,0]		[0,-1]	[0,1]
	// action english:	left		right		down		up
	const action = new Array(2).fill(0)
	switch(actionIndex){
		case 0:
			action[0] = -1
			break;
		case 1:
			action[0] = 1		
			break;
		case 2:
			action[1] = -1
		break;
		case 3:
			action[1] = 1
			break;
	}
	return action
}

function ranInt(min,max){
	return Math.floor(Math.random()*(max-min+1)+min)
}

function initMapTable(parent,map){
	let html = ''
	map.forEach((row,y)=>{
		html+='<tr>'
		row.forEach((ele,x)=>{
			let color
			switch (true){
				case ele<0:
					color = 'red'
					break;
				case ele>0:
					color = 'green'
			}
			html += color ? `<td class=${color}>` : `<td>`
			html+=`<span>${ele}</span>`
			html+= (y===state[1] && x===state[0]) ? '<span class="agent">A</span>' : ''
			html+= (y===spawn.y && x===spawn.x) ? `<span class="spawn">S</span>` : ''
			html+='</td>'
		})
		html+='</tr>'
	})
	let table = document.createElement('table')
	table.innerHTML = html
	parent.appendChild(table)
}



function initQTable(parent,map){
	let html = ''
	map.forEach((row,y)=>{
		html+='<tr>'
		row.forEach((ele,x)=>{
			html+='<td>'
			html+=`<span class="top">${round(qMatrix[y][x][2])}</span>`
			html+=`<span class="bottom">${round(qMatrix[y][x][3])}</span>`
			html+=`<span class="left">${round(qMatrix[y][x][0])}</span>`
			html+=`<span class="right">${round(qMatrix[y][x][1])}</span>`
			html+='</td>'
		})
		html+='</tr>'
	})
	let table = document.createElement('table')
	table.innerHTML = html
	parent.appendChild(table)
}

function setup(){
	render()
}
setup()

function tick(){
	step()
	render()
}

function render(){
	const ul = document.getElementsByTagName('ul')[0]
	const li = document.createElement('li')
	ul.append(li)
	initMapTable(li,map)
	initQTable(li,qMatrix)
	document.getElementsByClassName('end')[0].scrollIntoView()
}

function round(num){
	return Math.round(num*100)/100
}