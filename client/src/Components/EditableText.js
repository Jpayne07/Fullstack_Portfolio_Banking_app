import React, { useState } from "react";

function EditableText({ initialText, transactionId, keyName, API_URL, transactions}) {
    const [isEditing, setIsEditing] = useState(false); // Track if editing mode is active
    const [text, setText] = useState(initialText); // Store the text value
  const handleTextClick = () => {
    setIsEditing(true); // Switch to editing mode
  };

  const handleInputChange = (e) => {
    setText(e.target.value); // Update the text state as the user types
  };

  const handleInputBlur = async () => {
    setIsEditing(false); // Exit editing mode when the input loses focus
    await saveTextToDatabase();
  };

  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      setIsEditing(false); // Exit editing mode when Enter is pressed
      await saveTextToDatabase();
    }
  };

  const saveTextToDatabase = async () => {
      await fetch(`${API_URL}/api/bank/transaction/${transactionId}`, {
        method: "PATCH",
        credentials:"include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [keyName]: text }),
      })
      .then((r) => {
      if (!r.ok) {
        r.json()
        .then((data)=>{
          console.log(data.error)
          
          return data.error
        })
        
      }

      else{
        r.json()
        .then((data)=>{
          const updatedTransaction = transactions.filter(transaction =>{
            return parseInt(transaction.id) === parseInt(transactionId)})
            updatedTransaction[0][keyName] = data[keyName]
            // setTransactions()
            console.log(updatedTransaction)
        return data
      })
      }
    
    })
      
  };

  return (
    <div>
      {isEditing ? (
        <input
          type="text"
          value={text}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyPress={handleKeyPress}
          autoFocus
        />
      ) : (
        <span onClick={handleTextClick} style={{ cursor: "pointer" }}>
          {text}
        </span>
      )}
    </div>
  );
}

export default EditableText;