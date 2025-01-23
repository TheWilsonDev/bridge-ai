import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, arrayUnion, setDoc, getDoc } from "firebase/firestore";
import { db } from "./config";

// Get all chats
export const getChats = async () => {
  try {
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, orderBy("lastActive", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting chats:", error);
    throw error;
  }
};

// Add a new chat
export const addChat = async (chatData) => {
  try {
    const chatsRef = collection(db, "chats");
    // Only set title to "New Chat" if no title is provided
    const chatWithDefaultTitle = {
      ...chatData,
      title: chatData.title || "New Chat",
    };
    const docRef = await addDoc(chatsRef, chatWithDefaultTitle);
    return {
      id: docRef.id,
      ...chatWithDefaultTitle,
    };
  } catch (error) {
    console.error("Error adding chat:", error);
    throw error;
  }
};

// Update a chat
export const updateChat = async (chatId, updateData) => {
  try {
    console.log("Updating chat in Firebase:", {
      chatId,
      updateData,
    });

    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, updateData);

    // Verify the update
    const updatedDoc = await getDoc(chatRef);
    console.log("Chat updated in Firebase. New data:", updatedDoc.data());

    return updatedDoc.data();
  } catch (error) {
    console.error("Error updating chat:", error);
    throw error;
  }
};

// Delete a chat
export const deleteChat = async (chatId) => {
  try {
    const chatRef = doc(db, "chats", chatId);
    await deleteDoc(chatRef);
    return true;
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw error;
  }
};

// Add a message to a chat
export const addMessage = async (chatId, message) => {
  try {
    const chatRef = doc(db, "chats", chatId);
    const chatDoc = await getDoc(chatRef);
    const currentMessages = chatDoc.data().messages || [];

    await updateDoc(chatRef, {
      messages: [...currentMessages, message],
      lastActive: Date.now(),
    });
    return message;
  } catch (error) {
    console.error("Error adding message:", error);
    throw error;
  }
};

// Get agent response using OpenAI API
export const addAgentResponse = async (chatId, userMessage) => {
  try {
    // Get the chat history
    const chatRef = doc(db, "chats", chatId);
    const chatDoc = await getDoc(chatRef);
    const chatData = chatDoc.data();
    const messages = chatData.messages || [];

    // Prepare the conversation history for OpenAI
    const conversationHistory = messages.map((msg) => ({
      role: msg.role === "agent" ? "assistant" : "user",
      content: msg.content,
    }));

    // Add the latest user message
    conversationHistory.push({
      role: "user",
      content: userMessage.content,
    });

    // Make request to OpenAI API with retry logic
    let retries = 3;
    let delay = 1000; // Start with 1 second delay
    let lastError = null;

    while (retries > 0) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: conversationHistory,
            temperature: 0.7,
            max_tokens: 1000,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          if (response.status === 429) {
            throw new Error("Rate limit exceeded. Please wait a moment before sending another message.");
          } else if (response.status === 401) {
            throw new Error("Invalid API key. Please check your OpenAI API key configuration.");
          } else {
            throw new Error(errorData.error?.message || `OpenAI API error: ${response.statusText}`);
          }
        }

        const data = await response.json();
        const agentMessage = {
          role: "agent",
          content: data.choices[0].message.content,
          timestamp: Date.now(),
        };

        // Add the agent's response to Firebase
        await updateDoc(chatRef, {
          messages: [...messages, agentMessage],
          lastActive: Date.now(),
        });

        return agentMessage;
      } catch (error) {
        lastError = error;
        if (error.message.includes("Rate limit exceeded")) {
          console.log(`Rate limit hit, retrying in ${delay / 1000} seconds...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
          retries--;
        } else {
          // For other errors, don't retry
          throw error;
        }
      }
    }

    // If we've exhausted all retries
    throw lastError || new Error("Failed to get response from OpenAI after multiple attempts");
  } catch (error) {
    console.error("Error getting agent response:", error);
    // Rethrow with a user-friendly message
    throw new Error(error.message || "Failed to get AI response. Please try again later.");
  }
};
