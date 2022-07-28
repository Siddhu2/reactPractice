import React from 'react'

function App() {
  const [item,setItem]=React.useState([{iname:"",quantity:"",amount:"",total:0}])
  const[billTotal,setBillTotal]=React.useState(0)
  React.useEffect(()=>{
    setBillTotal(()=>{
      let data = [...item];
      let temp=0;
      for(let i=0;i<data.length;i++)
      {
        temp= parseFloat(data[i].total) + temp;
      }
      return temp
    })
  },[item])

  function handleChange(index,event)
  {
    let data = [...item]
    data[index][event.target.name] = event.target.value
    data[index]['total']=(data[index]['quantity']*data[index]['amount']).toFixed(2)
    setItem(data)
  }

  function removeEntry(index)
  {
    let data=[...item]
    
    data.splice(index,1)
    setItem(data)
  }

  // const inputTags= item.map((input,index) =>{
  //   return(
  //     <div key={index}>
  //       <input name="iname" placeholder='item name' value={input.iname} onChange={event => handleChange(index,event)}></input>
  //       <input name="quantity" type="number" pattern="^\d*(\.\d{0,2})?$" step=".01" placeholder='quantity' value={input.quantity} onChange={event => handleChange(index,event)}></input>
  //       <input name="amount" type="number" pattern="[0-9]*" step=".01" min=".01" max="99999.99" placeholder='amount' value={input.amount} onChange={event => handleChange(index,event)}></input>
  //       <input name="total" placeholder='total' value={input.total} readOnly></input>
  //       <button key={index} onClick={() => removeEntry(index)}>Remove</button>
  //     </div>
  //   )
  // })
  function addItem()
  {
    const newItem={quantity:"",amount:"",total:0}
    setItem((oldValue) => {
      const newArray=[]
      for(let i=0;i<oldValue.length;i++)
      {
        newArray.push(oldValue[i])
      }
      newArray.push(newItem)
      return newArray
    })
  }

  function handleSubmit(event)
  {
    event.preventDefault();
    alert(JSON.stringify(item));
  }

  return (
    <form onSubmit={handleSubmit}>
    <div className="App">
    {item.map((input,index) =>(
       <div key={index}>
       <input name="iname" placeholder='item name' value={input.iname} onChange={event => handleChange(index,event)}></input>
       <input name="quantity" type="number" pattern="[0-9]*" step=".001" min=".000" max="999.999" placeholder='quantity' value={input.quantity} onChange={event => handleChange(index,event)}></input>
       <input name="amount" type="number" pattern="[0-9]*" step=".01" min=".01" max="99999.99" placeholder='amount' value={input.amount} onChange={event => handleChange(index,event)}></input>
       <input name="total" placeholder='total' value={input.total} readOnly></input>
       <button key={index} onClick={() => removeEntry(index)}>Remove</button>
     </div>
    ))}
     
     <button type='button' onClick={addItem}>Add+</button>
     <h3>Total amount: {billTotal ? billTotal : 0}</h3>
     <button type='submit'>submit</button>
     
    </div>
    </form>
  );
}

export default App;
