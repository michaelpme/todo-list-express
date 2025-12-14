const deleteBtn = document.querySelectorAll('.fa-trash') //assigns the element in our document with the class fa-trash to deleteBtn variable. querySelectorAll returns a node list
const item = document.querySelectorAll('.item span') // assigns the span element with the class item and the  to the item variable. querySelectorAll returns a node list
const itemCompleted = document.querySelectorAll('.item span.completed') // assigns the  element with the class completed that has a span with class item, querySelectorAll returns a node list

Array.from(deleteBtn).forEach((element)=>{ // since it deleteBtn is a nodeList we must use the Array method to make use of it. each element of the array is iterated over and has an event listner added to it
    element.addEventListener('click', deleteItem) // adding an event listner to each element of the array
})

Array.from(item).forEach((element)=>{ // since it item is a nodeList we must use the Array method to make use of it as a normal array. each element of the array is iterated over and has an event listner added to it
    element.addEventListener('click', markComplete)// adding an event listner to each element of the array
})

Array.from(itemCompleted).forEach((element)=>{  // since it itemCompleted is a nodeList we must use the Array method to make use of it as a normal array. each element of the array is iterated over and has an event listner added to it
    element.addEventListener('click', markUnComplete)// adding an event listner to each element of the array
})

async function deleteItem(){ // start of an async function 
    const itemText = this.parentNode.childNodes[1].innerText // it takes the item from the DOM that triggered the function, goes to it's parent node and retieves the first child's inner text
    try{
        const response = await fetch('deleteItem', { //selecting the route where request goes to 
            method: 'delete', // the type action to be performed 
            headers: {'Content-Type': 'application/json'}, // the kind of data we will be sending
            body: JSON.stringify({//turnining the object into a json formart
              'itemFromJS': itemText // information pulled from the DOM (variable set on line 18) and put into an object
            })
          })
        const data = await response.json() // once the fetch await is complete we set the data variable with a json response
        console.log(data) // console log the data variable
        location.reload() // and finally reload the page

    }catch(err){
        console.log(err) // catching any errors that may occur
    }
}

async function markComplete(){ //start of an async function that will be triggered when the items are marked as complete
    const itemText = this.parentNode.childNodes[1].innerText // it takes the item from the DOM that triggered the function, goes to it's parent node and retieves the first child's inner text
    try{
        const response = await fetch('markComplete', {//selecting the route where request goes to 
            method: 'put',// the type action to be performed 
            headers: {'Content-Type': 'application/json'},// the kind of data we will be sending
            body: JSON.stringify({//turnining the object into a json formart
                'itemFromJS': itemText// information pulled from the DOM (variable set on line 18) and put into an object
            })
          })
        const data = await response.json()// once the fetch await is complete we set the data variable with a json response
        console.log(data)// console log the data variable
        location.reload()// and finally reload the page

    }catch(err){
        console.log(err)// catching any errors that may occur
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // it takes the item from the DOM that triggered the function, goes to it's parent node and retieves the first child's inner text
    try{
        const response = await fetch('markUnComplete', {//selecting the route where request goes to 
            method: 'put',// the type action to be performed 
            headers: {'Content-Type': 'application/json'},// the kind of data we will be sending
            body: JSON.stringify({//turnining the object into a json formart
                'itemFromJS': itemText// information pulled from the DOM (variable set on line 18) and put into an object
            })
          })
        const data = await response.json()// once the fetch await is complete we set the data variable with a json response
        console.log(data)// console log the data variable
        location.reload()// and finally reload the page

    }catch(err){
        console.log(err)// catching any errors that may occur
    }
} 