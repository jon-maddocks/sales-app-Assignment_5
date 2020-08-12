const listView = document.querySelector('#lstLocs')
const slcTitle = document.querySelector('#slcTitle')
const slcBody = document.querySelector('#slcBody') //description
const slcName = document.querySelector('#slcName')
const slcCategory = document.querySelector('#slcCategory')
const slcPrice = document.querySelector('#slcPrice')
const slcLocation = document.querySelector('#slcLocation')
const slcContact = document.querySelector('#slcContact')
const slcCard = document.querySelector('#slcCard')
const inputForm =document.querySelector('form')
const deleteForm = document.querySelector('#deleteForm')

const getAllEntries = ()=>{
   
    clearList(listView)
    
    fetch('/items').then((response) =>{
        response.json().then((data)=>{
            console.log(data)
            if (data.error){
                const tmpItem=document.createElement("button")
                tmpItem.innerHTML = "Error loading data. Please try again"
                tmpItem.classList.add("list-group-item")
                listView.appendChild(tmpItem) 
            }   
            else{
                console.log('Success: Now loading data');
                for (let i=0;i<data.length;i++){
                    const tmpItem=document.createElement("button")
                    tmpItem.innerHTML = '<button type=button class="list-group-item list-group-item-action">'+data[i].title+'</button>'
                    tmpItem.addEventListener('click',()=>{showEntry(data[i]._id)})
                    console.log(tmpItem.innerHTML)
                    tmpItem.classList.add("list-group-item")
                    listView.appendChild(tmpItem) 
                }
                
            }
                
        })
    })
    
}

const clearList=(listView)=>{
    while (listView.firstChild)
    listView.removeChild(listView.firstChild)
}

const showEntry=(id)=>{
    slcCard.classList.remove('d-none')
    console.log(id)
    fetch('/items/'+id).then((response) =>{
        response.json().then((data)=>{
            console.log(data)
            if (data.error){
                slcTitle.innerHTML = "Error loading data. Please try again"
            }   
            else{
                console.log('Success: Now loading data');   
                slcTitle.innerHTML= data.title
                slcBody.innerHTML='Description: ' + data.description
                slcName.innerHTML= 'Seller Name: ' + data.name
                slcCategory.innerHTML = 'Category: ' + data.category
                slcPrice.innerHTML = '$' + data.price
                slcLocation.innerHTML='Location : '+data.latitude+', '+data.longitude
                slcContact.innerHTML = 'Contact Info: ' + data.contact        
            }    
        })
    })
}

inputForm.addEventListener('submit',(e)=>{
    console.log('here')
    e.preventDefault()
    const title = document.querySelector('#title');
    const des = document.querySelector('#body');
    const name = document.querySelector('#name');
    const category = document.querySelector('#category')
    const price = document.querySelector('#price')
    const lat = document.querySelector('#lat');
    const lon = document.querySelector('#lon');
    const contact = document.querySelector('#contact');

    const post_request_object={
        "title": title.value,
        "description": des.value,
        "name": name.value,
        "category": category.value,
        "price": price.value,
        "latitude": lat.value, 
        "longitude":  lon.value,
        "contact": contact.value
    }


    fetch('/items/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify(post_request_object),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            //Probably not the best validation method, but if the user does not input enough info or if 
            //  the object is empty, this checks the length of the object and will output a small error
            //  message, otherwise, the listing will output
            if(Object.keys(data).length > 1){
                itemForSale()
            } else {
                document.getElementById("id_item").innerHTML = 
                'Error inserting item. Please try again!';
            }
            getAllEntries()
        })
        .catch((error) => {
            console.error('Error:', error);
        });

        
})


deleteForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const deleteID = document.getElementById('delete').value;
    console.log(deleteID);

    fetch('/items/' + deleteID, {
        method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            if(Object.keys(data).length > 1){
                document.getElementById("id_item").innerHTML = 
                'Item has been successfully deleted';
            } else {
                document.getElementById("id_item").innerHTML = 
                'Error: Invalid ID';
            }
            getAllEntries()
        })
        .catch((error) => {
            console.error('Error:', error);
        });
})
 


function itemForSale(){
    fetch('/items').then((response) =>{
        response.json().then((data)=>{
            for(let i =0; i < data.length; i++){
                if(i === (data.length - 1)){
                    document.getElementById("id_item").innerHTML = 
                    'Your item is up for sale! The ID of your listing is ' + data[i]._id;
                }
            }    
        })
    })
}

slcCard.classList.add('d-none')
getAllEntries()
