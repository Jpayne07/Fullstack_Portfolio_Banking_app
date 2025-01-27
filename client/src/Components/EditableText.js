import React, { useState } from "react";

function EditableText({ initialText, transactionId, keyName}) {
    const [isEditing, setIsEditing] = useState(false); // Track if editing mode is active
    const [text, setText] = useState(initialText); // Store the text value
    const [loading, setLoading] = useState(false); // Track loading state
    const [error, setError] = useState(null); // Track error state

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
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/transaction/${transactionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [keyName]: text }),
      });

      if (!response.ok) {
        throw new Error("Failed to save changes. Please try again.");
      }

      const data = await response.json();
      console.log("Changes saved:", data);
    } catch (err) {
      console.error(err);
      setError("Failed to save changes.");
    } finally {
      setLoading(false);
    }
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