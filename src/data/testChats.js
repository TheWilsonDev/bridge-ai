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
    messages: [
      { text: "Hi, I need help writing a research paper about World War II's impact on global economics.", sender: "user", timestamp: Date.now() - 1000 * 60 * 30 },
      { text: "I'll help you craft a comprehensive research paper on this topic. Could you specify which aspects of global economics you'd like to focus on? For example, we could explore industrial transformation, trade patterns, or monetary policies.", sender: "agent", timestamp: Date.now() - 1000 * 60 * 29 },
      { text: "Let's focus on how it affected international trade relationships and the rise of the US economy.", sender: "user", timestamp: Date.now() - 1000 * 60 * 28 },
      { text: "Excellent choice. I'll help you structure this paper around three main points:\n1. Pre-war international trade dynamics\n2. Disruption of traditional trade routes and partnerships\n3. Post-war emergence of US economic dominance\n\nShall we start with an outline?", sender: "agent", timestamp: Date.now() - 1000 * 60 * 27 },
    ],
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
    messages: [
      { text: "I need to analyze the themes in The Great Gatsby for my literature class.", sender: "user", timestamp: Date.now() - 1000 * 60 * 60 },
      { text: "The Great Gatsby is rich with themes. Let's focus on the major ones: the American Dream, social and moral decay, and the superficiality of wealth. Which aspect interests you most?", sender: "agent", timestamp: Date.now() - 1000 * 60 * 59 },
      { text: "The American Dream theme would be perfect. Can you help me analyze that?", sender: "user", timestamp: Date.now() - 1000 * 60 * 58 },
      { text: "Absolutely. Through Gatsby's journey, Fitzgerald presents a critique of the American Dream. We can analyze this through:\n1. Gatsby's pursuit of wealth and Daisy\n2. The contrast between old and new money\n3. The corruption of the dream through materialism\n\nWould you like me to elaborate on any of these points?", sender: "agent", timestamp: Date.now() - 1000 * 60 * 57 },
    ],
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
    messages: [
      { text: "How do I implement a custom hook for handling form state in React?", sender: "user", timestamp: Date.now() - 1000 * 60 * 45 },
      { text: "I'll help you create a custom useForm hook. Here's a basic implementation:\n\n```javascript\nconst useForm = (initialState = {}) => {\n  const [values, setValues] = useState(initialState);\n\n  const handleChange = (e) => {\n    const { name, value } = e.target;\n    setValues(prev => ({ ...prev, [name]: value }));\n  };\n\n  const reset = () => setValues(initialState);\n\n  return { values, handleChange, reset };\n};\n```\n\nWould you like me to explain how to use it?", sender: "agent", timestamp: Date.now() - 1000 * 60 * 44 },
      { text: "Yes, please show me an example!", sender: "user", timestamp: Date.now() - 1000 * 60 * 43 },
    ],
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
    messages: [
      { text: "I'm getting a CORS error when trying to call my backend API from React", sender: "user", timestamp: Date.now() - 1000 * 60 * 90 },
      { text: "CORS errors are common in development. Let's fix this. Are you using Express for your backend?", sender: "agent", timestamp: Date.now() - 1000 * 60 * 89 },
      { text: "Yes, I'm using Express", sender: "user", timestamp: Date.now() - 1000 * 60 * 88 },
      { text: "Great, you'll need to add the cors middleware to your Express server:\n\n```javascript\nconst cors = require('cors');\napp.use(cors());\n```\n\nInstall it first with:\n```bash\nnpm install cors\n```\n\nThis will allow all origins in development. For production, you should configure it with specific origins.", sender: "agent", timestamp: Date.now() - 1000 * 60 * 87 },
    ],
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
    messages: [
      { text: "I need help creating a visualization for my company's sales data trends", sender: "user", timestamp: Date.now() - 1000 * 60 * 120 },
      { text: "I can help you create effective visualizations. What type of sales data do you have (time series, categorical, etc.), and what insights are you trying to highlight?", sender: "agent", timestamp: Date.now() - 1000 * 60 * 119 },
      { text: "It's monthly sales data for different product categories over the last 2 years", sender: "user", timestamp: Date.now() - 1000 * 60 * 118 },
      { text: "For that type of data, I recommend a combination of:\n1. A line plot showing overall sales trends over time\n2. A stacked area chart to show the contribution of each category\n3. A heatmap for seasonal patterns\n\nWould you like to see how to create any of these using Python with Seaborn or Plotly?", sender: "agent", timestamp: Date.now() - 1000 * 60 * 117 },
    ],
    lastActive: Date.now() - 1000 * 60 * 60, // 1 hour ago
    title: "Data Visualization Project",
  },
  {
    id: "chat_6",
    agent: {
      name: "Python Expert",
      description: "Advanced Python programming and automation specialist",
      verifiedTag: "Bridge Verified",
    },
    category: "Code Assistant",
    color: "#805AD5",
    messages: [
      { text: "How can I optimize my Python script that processes large CSV files?", sender: "user", timestamp: Date.now() - 1000 * 60 * 150 },
      { text: "For large CSV files, let's use pandas with chunking. Here's an efficient approach:\n\n```python\nimport pandas as pd\n\nchunksize = 10000\nfor chunk in pd.read_csv('large_file.csv', chunksize=chunksize):\n    # Process each chunk here\n    processed_data = chunk.process()\n    processed_data.to_csv('output.csv', mode='a')\n```\n\nWould you like me to explain how this works?", sender: "agent", timestamp: Date.now() - 1000 * 60 * 149 },
    ],
    lastActive: Date.now() - 1000 * 60 * 75,
    title: "Python Optimization",
  },
  {
    id: "chat_7",
    agent: {
      name: "UI/UX Designer",
      description: "Create beautiful and intuitive user interfaces",
      specialTag: "Design Pro",
      verifiedTag: "Bridge Verified",
    },
    category: "Design",
    color: "#F56565",
    messages: [
      { text: "I need help designing a mobile-first navigation menu", sender: "user", timestamp: Date.now() - 1000 * 60 * 180 },
      { text: "Let's create a hamburger menu that transforms into a full-screen navigation on mobile. We'll focus on smooth transitions and clear hierarchy. Would you like to see some wireframes?", sender: "agent", timestamp: Date.now() - 1000 * 60 * 179 },
    ],
    lastActive: Date.now() - 1000 * 60 * 90,
    title: "Mobile Nav Design",
  },
  {
    id: "chat_8",
    agent: {
      name: "DevOps Engineer",
      description: "Expert in CI/CD, Docker, and cloud infrastructure",
      verifiedTag: "Bridge Verified",
    },
    category: "Infrastructure",
    color: "#38B2AC",
    messages: [
      { text: "Need help setting up a CI/CD pipeline with GitHub Actions", sender: "user", timestamp: Date.now() - 1000 * 60 * 210 },
      { text: "I'll help you create a workflow file. What kind of project are we deploying?", sender: "agent", timestamp: Date.now() - 1000 * 60 * 209 },
    ],
    lastActive: Date.now() - 1000 * 60 * 100,
    title: "GitHub Actions Setup",
  },
  {
    id: "chat_9",
    agent: {
      name: "Marketing Strategist",
      description: "Digital marketing and growth strategy expert",
      specialTag: "Growth Expert",
      verifiedTag: "Bridge Verified",
    },
    category: "Marketing",
    color: "#9F7AEA",
    messages: [
      { text: "Help me create a social media content calendar", sender: "user", timestamp: Date.now() - 1000 * 60 * 240 },
      { text: "I'll help you develop a strategic content calendar. What platforms are you focusing on, and what's your target audience?", sender: "agent", timestamp: Date.now() - 1000 * 60 * 239 },
    ],
    lastActive: Date.now() - 1000 * 60 * 120,
    title: "Content Calendar",
  },
  {
    id: "chat_10",
    agent: {
      name: "SEO Specialist",
      description: "Search engine optimization and content strategy",
      specialTag: "SEO Pro",
      verifiedTag: "Bridge Verified",
    },
    category: "Marketing",
    color: "#D53F8C",
    messages: [
      { text: "How can I improve my website's SEO ranking?", sender: "user", timestamp: Date.now() - 1000 * 60 * 270 },
      { text: "Let's start with a comprehensive SEO audit. We'll look at:\n1. Technical SEO\n2. Content quality\n3. Backlink profile\n4. User experience\n\nWhich area would you like to focus on first?", sender: "agent", timestamp: Date.now() - 1000 * 60 * 269 },
    ],
    lastActive: Date.now() - 1000 * 60 * 150,
    title: "SEO Improvement",
  },
  {
    id: "chat_11",
    agent: {
      name: "Machine Learning Engineer",
      description: "AI and ML model development specialist",
      specialTag: "AI Expert",
      verifiedTag: "Bridge Verified",
    },
    category: "Data Analyst",
    color: "#319795",
    messages: [
      { text: "Need help implementing a recommendation system", sender: "user", timestamp: Date.now() - 1000 * 60 * 300 },
      { text: "I can help you build a collaborative filtering system. Are you looking for user-based or item-based recommendations?", sender: "agent", timestamp: Date.now() - 1000 * 60 * 299 },
    ],
    lastActive: Date.now() - 1000 * 60 * 180,
    title: "ML Recommendation System",
  },
  {
    id: "chat_12",
    agent: {
      name: "Database Administrator",
      description: "Expert in database design and optimization",
      verifiedTag: "Bridge Verified",
    },
    category: "Infrastructure",
    color: "#DD6B20",
    messages: [
      { text: "How can I optimize my PostgreSQL queries?", sender: "user", timestamp: Date.now() - 1000 * 60 * 330 },
      { text: "Let's analyze your query performance. Can you share the slow query and its EXPLAIN ANALYZE output?", sender: "agent", timestamp: Date.now() - 1000 * 60 * 329 },
    ],
    lastActive: Date.now() - 1000 * 60 * 200,
    title: "Database Optimization",
  },
  {
    id: "chat_13",
    agent: {
      name: "Security Expert",
      description: "Cybersecurity and penetration testing specialist",
      specialTag: "Security Pro",
      verifiedTag: "Bridge Verified",
    },
    category: "Infrastructure",
    color: "#E53E3E",
    messages: [
      { text: "Need to implement OAuth2 authentication in my app", sender: "user", timestamp: Date.now() - 1000 * 60 * 360 },
      { text: "I'll guide you through OAuth2 implementation. Which providers do you want to support (Google, GitHub, etc.)?", sender: "agent", timestamp: Date.now() - 1000 * 60 * 359 },
    ],
    lastActive: Date.now() - 1000 * 60 * 220,
    title: "OAuth Implementation",
  },
  {
    id: "chat_14",
    agent: {
      name: "Mobile Developer",
      description: "iOS and Android app development expert",
      specialTag: "Mobile Pro",
      verifiedTag: "Bridge Verified",
    },
    category: "Code Assistant",
    color: "#3182CE",
    messages: [
      { text: "How do I implement push notifications in React Native?", sender: "user", timestamp: Date.now() - 1000 * 60 * 390 },
      { text: "I'll help you set up push notifications using Firebase Cloud Messaging. First, let's configure your project.", sender: "agent", timestamp: Date.now() - 1000 * 60 * 389 },
    ],
    lastActive: Date.now() - 1000 * 60 * 240,
    title: "Push Notifications Setup",
  },
  {
    id: "chat_15",
    agent: {
      name: "Technical Writer",
      description: "API documentation and technical content specialist",
      verifiedTag: "Bridge Verified",
    },
    category: "Content Writer",
    color: "#718096",
    messages: [
      { text: "Need help writing API documentation", sender: "user", timestamp: Date.now() - 1000 * 60 * 420 },
      { text: "I'll help you create clear and comprehensive API docs. Are you using OpenAPI/Swagger specification?", sender: "agent", timestamp: Date.now() - 1000 * 60 * 419 },
    ],
    lastActive: Date.now() - 1000 * 60 * 260,
    title: "API Documentation",
  },
];
