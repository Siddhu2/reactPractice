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
        temp= parseInt(data[i].total) + temp;
      }
      return temp
    })
  },[item])

  function handleChange(index,event)
  {
    let data = [...item]
    data[index][event.target.name] = event.target.value
    data[index]['total']=data[index]['quantity']*data[index]['amount']
    setItem(data)
  }

  function removeEntry(index)
  {
    let data=[...item]
    
    data.splice(index,1)
    setItem(data)
  }

  const inputTags= item.map((input,index) =>{
    return(
      <div key={index}>
        <input name="iname" placeholder='item name' value={input.iname} onChange={event => handleChange(index,event)}></input>
        <input name="quantity" placeholder='quantity' value={input.quantity} onChange={event => handleChange(index,event)}></input>
        <input name="amount" placeholder='amount' value={input.amount} onChange={event => handleChange(index,event)}></input>
        <input name="total" placeholder='total' value={input.total} readOnly></input>
        <button key={index} onClick={() => removeEntry(index)}>Remove</button>
      </div>
    )
  })
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
  return (
    <div className="App">
     {inputTags}
     <button onClick={addItem}>Add+</button>
     <h3>Total amount: {billTotal ? billTotal : 0}</h3>
    </div>
  );
}

export default App;
