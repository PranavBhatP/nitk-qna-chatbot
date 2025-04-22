// Add this function to test Pinecone connection
const testPineconeConnection = async () => {
  const pinecone = new Pinecone({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  })

  try {
    const indexes = await pinecone.listIndexes()
    console.log("Connected to Pinecone successfully")
    console.log("Available indexes:", indexes)
  } catch (error) {
    console.error("Pinecone connection error:", error)
    throw error
  }
}

// Add this at the start of initializeVectorStore
await testPineconeConnection() 