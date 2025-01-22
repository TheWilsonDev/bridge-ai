import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, arrayUnion, setDoc } from "firebase/firestore";
import { db } from "./config";

// Get all chats
export const getChats = async () => {
  try {
    const q = query(collection(db, "chats"), orderBy("lastActive", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching chats:", error);
    return [];
  }
};

// Add a new chat
export const addChat = async (chatData) => {
  try {
    // Create a new document in the chats collection
    const docRef = await addDoc(collection(db, "chats"), {
      ...chatData,
      lastActive: Date.now(),
      messages: [],
      createdAt: Date.now(),
    });

    // Return the created chat with its ID
    return {
      id: docRef.id,
      ...chatData,
      messages: [],
      lastActive: Date.now(),
      createdAt: Date.now(),
    };
  } catch (error) {
    console.error("Error adding chat:", error);
    throw error;
  }
};

// Update a chat
export const updateChat = async (chatId, updates) => {
  try {
    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
      ...updates,
      lastActive: Date.now(),
    });
    return true;
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
    await updateDoc(chatRef, {
      messages: arrayUnion(message),
      lastActive: Date.now(),
    });
    return true;
  } catch (error) {
    console.error("Error adding message:", error);
    throw error;
  }
};

// Add a simulated agent response
export const addAgentResponse = async (chatId, userMessage) => {
  try {
    const agentMessage = {
      role: "agent",
      content: `This is a simulated response to: "${userMessage.content}"`,
      timestamp: Date.now(),
    };

    await addMessage(chatId, agentMessage);
    return agentMessage;
  } catch (error) {
    console.error("Error adding agent response:", error);
    throw error;
  }
};
