function solve(){
    let initial_state = get_initial_state()
    let solvable = isSolvable(initial_state)
    let parent_node = null
    let parent_action = null
    let path_cost = 0
    let initial_node = {state:initial_state, parent_node, parent_action, path_cost}

    let frontier = []
    let frontierEmpty = false
    let explored = []
    let heuristicValues = []
    let gValues = []
    let sumValues = []
    let starIndex = null

    frontier.push(initial_node)

    if(solvable){
        while(true){
            if(!frontier.length){
                frontierEmpty = true
                break
            }
            
            frontier.forEach((node)=>{
                heuristicValues.push(heuristic(node.state))
                gValues.push(node.path_cost)
            })
            
            for(let i=0; i<frontier.length; i++){
                let sum = heuristicValues[i] + gValues[i]
                sumValues.push(sum)
            }
     
            starIndex = sumValues.indexOf(Math.min(...sumValues))
            
            if(checkGoalState(frontier[starIndex].state)){
                break
            }
    
            let actions = Actions(frontier[starIndex].state)
            let temp = []
            
            actions.forEach((action)=>{
                let state = Result(JSON.parse(JSON.stringify(frontier[starIndex].state)), action)
                let parent_action = action
                let parent_node = frontier[starIndex]
                let path_cost = frontier[starIndex].path_cost + 1
                let node = {state, parent_node, parent_action, path_cost}
    
                let alreadyDone = false
                let combinedArr = frontier.concat(explored)
            
                combinedArr.forEach((cnode)=>{
                    if(match(cnode.state, node.state)){
                        alreadyDone = true
                    }
                })
                if(!alreadyDone){
                    temp.push(node)
                }    
            })
    
            explored.push(frontier[starIndex])
            frontier.splice(starIndex,1)
            
            temp.forEach((node)=>{
                frontier.push(node)
            })
    
            heuristicValues = []
            gValues = []
            sumValues = []
        }
    }

    if(frontierEmpty || !solvable){
        alert('No solution possible!')
        window.location.reload()
    }
    else if(!frontierEmpty){
        let actionsArray = []
        let state = frontier[starIndex].state
        let node = frontier[starIndex]
    
        while(state != initial_state){
            actionsArray.push(node.parent_action)
            node = node.parent_node
            state = node.state
        }
    
        actionsArray.reverse()  
        animate(actionsArray)
    }    
}

function isSolvable(arr){
    let plain_array = []

    let inv_count = 0

    for(let i=0; i<3; i++){
        for(let j=0; j<3; j++){
            plain_array.push(arr[i][j])
        }
    }

    for(let i=0; i<9; i++){
        for(let j=i+1; j<9; j++){
            if(Number(plain_array[i])>0 && Number(plain_array[j])>0 && Number(plain_array[i])>Number(plain_array[j])){
                inv_count += 1
            }           
        }
    }

    return (inv_count % 2 == 0)
}

function Result(state, action){
    let row
    let col

    for(let i=0; i<3; i++){
        for(let j=0; j<3; j++){
            if(state[i][j]=='0'){
                row = i
                col = j
                break
            }
        }
    }

    if(action=='left'){
        state[row][col] = state[row][col+1]
        state[row][col+1] = '0'
    }
    else if(action=='right'){
        state[row][col] = state[row][col-1]
        state[row][col-1] = '0'
    }
    else if(action=='up'){
        state[row][col] = state[row+1][col]
        state[row+1][col] = '0'
    }
    else if(action=='down'){
        state[row][col] = state[row-1][col]
        state[row-1][col] = '0'
    }
    
    return state
}

function match(state_A, state_B){
    for(let i=0; i<3; i++){
        for(let j=0; j<3; j++){
            if(state_A[i][j]!=state_B[i][j]){
                return false
            }
        }
    }

    return true
}

function Actions(state){
    let actions = []

    for(let i=0; i<3; i++){
        for(let j=0; j<3; j++){
            if(state[i][j]=='0'){
                if(i==0){
                    actions.push('up')
                }
                else if(i==2){
                    actions.push('down') 
                }
                else{
                    actions.push('up')
                    actions.push('down') 
                }

                if(j==0){
                    actions.push('left')
                }
                else if(j==2){
                    actions.push('right') 
                }
                else{
                    actions.push('left')
                    actions.push('right') 
                }
                break
            }
        }
    }

    return actions
}

function heuristic(state){
    let goal_state = [['1','2','3'],['4','5','6'],['7','8','0']]
    let distance = 0

    for(let i=0; i<3; i++){
        for(let j=0; j<3; j++){
            for(let k=0; k<3; k++){
                for(let l=0; l<3; l++){
                    if(state[i][j]==goal_state[k][l]){
                        if(i>k){
                            distance += (i-k)
                        }
                        else if(i<k){
                            distance += (k-i)
                        }

                        if(j>l){
                            distance += (j-l)
                        }
                        else if(j<l){
                            distance += (l-j)
                        }
                    }
                }
            }
        }
    }

    return distance

    // let misplaced = 0
    // let goal_state = [['1','2','3'],['4','5','6'],['7','8','0']]

    // for(let i=0; i<3; i++){
    //     for(let j=0; j<3; j++){
    //         if(state[i][j]!=goal_state[i][j]){
    //             misplaced++
    //         }
    //     }
    // }

    // return misplaced
}

function checkGoalState(state){
    let goal_state = [['1','2','3'],['4','5','6'],['7','8','0']]

    for(let i=0; i<3; i++){
        for(let j=0; j<3; j++){
            if(state[i][j]!=goal_state[i][j]){
                return false
            }
        }
    }

    return true
}

function get_initial_state(){
    let positions = [[0,0],[100,0],[200,0],[0,100],[100,100],[200,100],[0,200],[100,200],[200,200]]
    let state = [[],[],[]]

    positions.forEach((position,index)=>{
        let found = false
        document.querySelectorAll('.box').forEach((box)=>{
            if(box.style.marginLeft==`${positions[index][0]}px` && box.style.marginTop==`${positions[index][1]}px`){
                state[Math.trunc(index/3)].push(box.innerHTML)
                found = true
            }
        })
        
        if(!found){
            state[Math.trunc(index/3)].push("0")
        }
    })

    return state
}