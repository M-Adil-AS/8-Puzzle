let solution = false
shuffle_board()

function shuffle_board(){
    let positions = [[0,0],[100,0],[200,0],[0,100],[100,100],[200,100],[0,200],[100,200],[200,200]]
    shuffle_array(positions)

    document.querySelectorAll('.box').forEach((box,index)=>{
        box.style.marginLeft = `${positions[index][0]}px`
        box.style.marginTop = `${positions[index][1]}px`
    })
}

function shuffle_array(array) {
    for(let i=array.length-1; i>0; i--){
        let j = Math.floor(Math.random() * (i+1))
        let temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
}

document.addEventListener('click', async()=>{
    if(!solution){
        solution = true
        await new Promise(resolve => setTimeout(resolve,300))  
        solve()
    }
})

async function animate(actionsArray){
    let initial_state = get_initial_state()
    let row
    let col

    for(let i=0; i<3; i++){
        for(let j=0; j<3; j++){
            if(initial_state[i][j]=='0'){
                row = i
                col = j
                break
            }
        }
    }

    let emptyPosition = {x: col*100, y:row*100}

    for(let i=0; i<actionsArray.length; i++){
        let found = false
        if(actionsArray[i]=='left'){
            document.querySelectorAll('.box').forEach((box,index)=>{
                if(box.style.marginLeft==`${emptyPosition.x+100}px` && box.style.marginTop==`${emptyPosition.y}px` && !found){
                    found = true
                    box.style.marginLeft = `${emptyPosition.x}px`
                    emptyPosition.x += 100              
                }
            })
        }
        else if(actionsArray[i]=='right'){
            document.querySelectorAll('.box').forEach((box,index)=>{
                if(box.style.marginLeft==`${emptyPosition.x-100}px` && box.style.marginTop==`${emptyPosition.y}px` && !found){
                    found = true
                    box.style.marginLeft = `${emptyPosition.x}px`
                    emptyPosition.x -= 100              
                }
            })
        }
        else if(actionsArray[i]=='up'){
            document.querySelectorAll('.box').forEach((box,index)=>{
                if(box.style.marginLeft==`${emptyPosition.x}px` && box.style.marginTop==`${emptyPosition.y+100}px` && !found){
                    found = true
                    box.style.marginTop = `${emptyPosition.y}px`
                    emptyPosition.y += 100              
                }
            })
        }
        else if(actionsArray[i]=='down'){
            document.querySelectorAll('.box').forEach((box,index)=>{
                if(box.style.marginLeft==`${emptyPosition.x}px` && box.style.marginTop==`${emptyPosition.y-100}px` && !found){
                    found = true
                    box.style.marginTop = `${emptyPosition.y}px`
                    emptyPosition.y -= 100              
                }
            })
        }
        new Audio('move.mp3').play()
        await new Promise(resolve => setTimeout(resolve,300))
    }
}