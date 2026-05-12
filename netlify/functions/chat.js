exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  
  if (!process.env.GROQ_API_KEY) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: { message: "Server is missing GROQ_API_KEY environment variable. Please add it in the Netlify site settings." }}) 
    };
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: event.body
    });
    
    const data = await response.text();
    
    return {
      statusCode: response.status,
      headers: { "Content-Type": "application/json" },
      body: data
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: { message: error.message }}) 
    };
  }
};