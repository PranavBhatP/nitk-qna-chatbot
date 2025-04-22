import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { HuggingFaceInferenceEmbeddings } from 'langchain/embeddings/hf'
import { Pinecone } from '@pinecone-database/pinecone'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { loadQAStuffChain } from 'langchain/chains'
import { OpenRouterLLM } from './OpenRouterLLM'
import path from 'path'

let vectorStore: PineconeStore | null = null

const initializeVectorStore = async () => {
  if (vectorStore) return

  console.log("Initializing vector store...")

  // Initialize Pinecone
  const pinecone = new Pinecone({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  })

  const index = pinecone.Index(process.env.PINECONE_INDEX!)

  try {
    // Load PDF
    console.log("Loading PDF...")
    const loader = new PDFLoader(path.join(__dirname, '../../data/nitk_faq.pdf'))
    const docs = await loader.load()
    console.log(`Loaded ${docs.length} documents`)

    // Split text into chunks
    console.log("Splitting documents...")
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    })
    const splitDocs = await textSplitter.splitDocuments(docs)
    console.log(`Split into ${splitDocs.length} chunks`)

    // Create embeddings using HuggingFace Inference API
    console.log("Creating embeddings...")
    const embeddings = new HuggingFaceInferenceEmbeddings({
      apiKey: process.env.HUGGINGFACE_API_KEY,
    })

    // Store in Pinecone
    console.log("Storing in Pinecone...")
    vectorStore = await PineconeStore.fromDocuments(
      splitDocs,
      embeddings,
      {
        pineconeIndex: index as any,
        namespace: 'nitk-faq',
      }
    )
    console.log("Vector store initialized successfully")
  } catch (error) {
    console.error("Error initializing vector store:", error)
    throw error
  }
}

export const handleQuery = async (query: string) => {
  try {
    console.log("Handling query:", query)
    
    // Initialize vector store if not already done
    if (!vectorStore) {
      await initializeVectorStore()
    }
    
    if (!vectorStore) {
      throw new Error('Vector store initialization failed')
    }

    // Search for relevant documents
    console.log("Searching for relevant documents...")
    const docs = await vectorStore.similaritySearch(query, 3)
    console.log(`Found ${docs.length} relevant documents`)

    // Create context from documents
    const context = docs.map(doc => doc.pageContent).join('\n\n')
    
    // Create prompt with context
    const prompt = `
    Use the following context to answer the question. If the answer cannot be found in the context, say "I don't have enough information to answer that question."
    
    Context:
    ${context}
    
    Question: ${query}
    
    Answer:`

    // Use the LLM to generate answer
    console.log("Generating answer...")
    const model = new OpenRouterLLM(
      process.env.OPENROUTER_API_KEY!,
      process.env.SITE_URL,
      process.env.SITE_NAME
    )

    const response = await model._call(prompt)
    console.log("Generated response")
    
    return response

  } catch (error) {
    console.error('Error in handleQuery:', error)
    throw new Error('Failed to process query')
  }
} 