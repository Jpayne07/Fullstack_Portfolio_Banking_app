import React, { useState } from "react";

function EditableText({ initialText, transactionId, keyName, API_URL}) {
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
      await fetch(`${API_URL}/api/transaction/${transactionId}`, {
        method: "PATCH",
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
          console.log("Changes saved:", data);
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