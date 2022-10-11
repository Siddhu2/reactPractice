import React from 'react'
import Axios from 'axios'
import './style.css'
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {font} from './myfont'
pdfMake.vfs = pdfFonts.pdfMake.vfs;
window.pdfMake.vfs["TamilFont.ttf"] = font

function App() {
  const [item,setItem]=React.useState([{iname:"",quantity:"",amount:"0.00",total:0}])
  const [customer,setCustomer] = React.useState('');
  //Creating state for billing total amount
  const[billTotal,setBillTotal]=React.useState(0)
  const[billNumber,setBillNumber] = React.useState('')
  const[submitButton,setSubmitButton] = React.useState(true)
  const[itemNames,setItemNames] = React.useState([])
  const[itemMatch,setItemMatch] = React.useState([])

  React.useEffect(() =>{
    //Storing list of months in an array
    let months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]
    Axios.get('http://192.168.1.36:3001/api/get/billNumber').then((response) =>{
    let prevBillNumber = response.data.length === 0 ? "" : response.data[0].bill_number;
    let today = new Date();
    // let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth()).padStart(2, '0'); //January is 0!
    // let yyyy = today.getFullYear();
    // let date = dd+mm+yyyy
    let billMonth = prevBillNumber.slice(0,3)
    let month = months[Number(mm)]
    if(billMonth === month)
    {
      let billNum = prevBillNumber.slice(-3)
      let newBillNumber = ('000'+(Number(billNum)+1)).slice(-3)
      setBillNumber(month+newBillNumber)
    }
    else
    {
      setBillNumber(month+"001")
    }
    })

    Axios.get('http://192.168.1.36:3001/api/get/items').then((response) =>{
      let data = response.data
      let finalArray = []
      // }
      finalArray = data.map(function(obj){
        return obj.item_name
      })
      console.log(finalArray)
      setItemNames([...finalArray])
      
    })
  },[])

  React.useEffect(()=>{
    //Setting total bill amount
    setBillTotal(()=>{
      //Getting copy of all item with its corresponding total
      let data = [...item];
      //Initializing temporary variable
      let temp=0;
      //Parsing through each item to calculate bill total based on each item total amount
      for(let i=0;i<data.length;i++)
      {
        temp= parseFloat(data[i].total) + temp;
      }
      return temp.toFixed(2)
    })
  },[item])

  function handleCustomerName(event)
  {
    setCustomer(event.target.value)
  }

  function handleChange(index,event)
  {
    if(event.target.name === "iname" && event.target.value !== "")
    {
      let match = itemNames.filter((i) =>{
        const regex = new RegExp(`${event.target.value}`,"gi")
        return i.match(regex)
      })
      setItemMatch(match)
    }
    //Storing currect item value in a array object 
    let data = [...item]
    //Getting the changed input box name and their corresponding value
    data[index][event.target.name] = event.target.value
    //Calculating the total value accordingly 
    data[index]['total']=(data[index]['quantity']*data[index]['amount']).toFixed(2)
    //Setting the new value accordingly
    setItem(data)
  }

  function removeEntry(index)
  {
    //Storing old items value in a variable
    let data=[...item]
    //Removing the array object with index value form the stored variable
    data.splice(index,1)
    //Storing it into the state
    setItem(data)
  }


  function addItem()
  {
    //Creating new object 
    const newItem={iname:"",quantity:"",amount:"0.00",total:0}
    setItem((oldValue) => {
      const newArray=[]
      //Trying to get old value and push it to new empty array
      for(let i=0;i<oldValue.length;i++)
      {
        newArray.push(oldValue[i])
      }
      //After pushing all old array, adding newly created empty object
      newArray.push(newItem)
      return newArray
    })
  }
  function todayDate()
  {
     let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    return today
  }

  function handleSubmit(event)
  {
    event.preventDefault();
    
    const billingItems = item.map(obj => ({
      ...obj,
      customerName : customer,
      billNumber : billNumber,
      totalPaid : billTotal,
      date : todayDate()
    }))
    Axios.post("http://192.168.1.36:3001/api/insert",{itemList:billingItems}).then(response =>{
      alert(response.data)
      setSubmitButton(false)
    }).catch(function (error) {
    alert(error)
  })
   
  }

  function generateBill(event)
  {
     //Preventing the input field to get erased
    event.preventDefault();
     let newArray = []  
    //Converting array object into array to make PDF conversion easy
    newArray.push(['எண்','பொருள் பெயர்','விலை','எண்ணிக்கை','மொத்தம்'])
    for(let i=0;i<item.length;i++)
    {
      newArray.push([i+1,item[i].iname,item[i].amount,item[i].quantity,item[i].total])
    }
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;
    pdfMake.fonts={
      TamilFont: {
          normal: 'TamilFont.ttf',
bold: 'TamilFont.ttf',
italics: 'TamilFont.ttf',
bolditalics: 'TamilFont.ttf'
      }
  }
  var docDefinition = {
      pageSize: {
          width: 226.8,
          height: 'auto',
         },
      content: [
        {
          text: 'நி.ஆ.காசிராஜா நாடார் பாத்திரக்கடை',
          style: 'header',
          alignment: 'center',
          fontSize: 10
        },
        {
          text: 'முகவூர்',
          style: 'header',
          alignment: 'center',
          fontSize: 10
        },
        {
          text: 'வாடிக்கையாளர் பெயர்: '+customer,
          fontSize: 6, bold: false,
          margin: [-30, 0, 0, 0],
        },
        {
          text: 'தேதி: '+today,
          fontSize: 6, bold: false,
          margin: [-30, 0, 0, 0],
        },
        {
          text: "சீட்டு எண்: "+billNumber,
          fontSize: 6, bold: false,
          margin: [-30, 0, 0, 0],
        },
        {
          style: 'tableExample',
          fontSize: 6,
          margin: [-30, 0, 0, 0],
          alignment: 'right',
          table: {
              // widths: [30, '*', 100, 100,'*'],
              body: newArray
          }
        },
        {
          text: "மொத்தம் செலுத்த வேண்டிய தொகை:"+billTotal ,
          fontSize: 6, bold: false,
          margin: [-15, 3, 0, 0],
        }

      ],
      defaultStyle: {
          font: 'TamilFont'
        }
    };
    
  // alert("Print!")
  pdfMake.createPdf(docDefinition).download();
  }

  return (
    <form onSubmit={handleSubmit} className = "form-container">
      <span>Bill number: {billNumber}</span>
      <input name="customerName" placeholder='customer name' value={customer} onChange={event => handleCustomerName(event)} required></input>
      <span>Date: {todayDate()}</span><br></br>
      <span>Item name</span>
      <span>Quantity</span>
      <span>Rate</span>
      <span>Amount</span>
    <div className="App">
    {item.map((input,index) =>(
       <div key={index}>
       <input name="iname" placeholder='item name' list='itemSuggestion' value={input.iname} onChange={event => handleChange(index,event)} required/>
       <datalist id="itemSuggestion">
       {itemMatch.map((i,index) =>{
        return (<option key={index} value={i}>{i}</option>)
       })}
       </datalist>
       
       <input name="quantity" type="number" pattern="[0-9]*" step=".001" min=".000" max="999.999"
        placeholder='quantity' value={input.quantity} 
       onChange={event => handleChange(index,event)} required></input>
       <input name="amount" type="number" pattern="[0-9]*" step=".01" min=".01" max="99999.99" 
       placeholder='amount' value={input.amount} 
       onChange={event => handleChange(index,event)} required></input>
       <input name="total" placeholder='total' value={input.total} readOnly></input>
       <button key={index} onClick={() => removeEntry(index)}>Remove</button>
     </div>
    ))}
     
     <button type='button' onClick={addItem}>Add+</button>
     <h3>Total amount: {billTotal ? billTotal : 0}</h3>
     {submitButton && <button type='submit'>submit</button>}
     <button type="button" onClick={generateBill}>Print</button>
    </div>
    </form>
  );
}

export default App;
