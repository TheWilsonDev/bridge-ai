export const testChats = [
  {
    id: "chat_1",
    agent: {
      name: "Essay Writer Pro",
      description: "Craft academic essays & papers with professional quality and originality",
      specialTag: "Undetectable",
      verifiedTag: "Bridge Verified",
    },
    category: "Content Writer",
    color: "#ED8936",
    messages: [],
    lastActive: Date.now() - 1000 * 60 * 5, // 5 minutes ago
    title: "Research Paper - History",
  },
  {
    id: "chat_2",
    agent: {
      name: "Essay Writer Pro", // Same agent, different chat
      description: "Craft academic essays & papers with professional quality and originality",
      specialTag: "Undetectable",
      verifiedTag: "Bridge Verified",
    },
    category: "Content Writer",
    color: "#ED8936",
    messages: [],
    lastActive: Date.now() - 1000 * 60 * 15, // 15 minutes ago
    title: "Literature Essay",
  },
  {
    id: "chat_3",
    agent: {
      name: "Full-Stack Web Developer",
      description: "Master modern web development with React, Node.js, and cloud services",
      verifiedTag: "Bridge Verified",
    },
    category: "Code Assistant",
    color: "#4299E1",
    messages: [],
    lastActive: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    title: "React Component Help",
  },
  {
    id: "chat_4",
    agent: {
      name: "Full-Stack Web Developer", // Same agent, different chat
      description: "Master modern web development with React, Node.js, and cloud services",
      verifiedTag: "Bridge Verified",
    },
    category: "Code Assistant",
    color: "#4299E1",
    messages: [],
    lastActive: Date.now() - 1000 * 60 * 45, // 45 minutes ago
    title: "API Integration Issue",
  },
  {
    id: "chat_5",
    agent: {
      name: "Data Science Specialist",
      description: "Advanced analytics with Python, R, and statistical modeling",
      verifiedTag: "Bridge Verified",
    },
    category: "Data Analyst",
    color: "#48BB78",
    messages: [],
    lastActive: Date.now() - 1000 * 60 * 60, // 1 hour ago
    title: "Data Visualization Project",
  },
];
