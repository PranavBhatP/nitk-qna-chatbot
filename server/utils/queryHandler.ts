import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { HuggingFaceTransformersEmbeddings } from 'langchain/embeddings/hf_transformers'
import { Pinecone } from '@pinecone-database/pinecone'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { loadQAStuffChain } from 'langchain/chains'
import { OpenRouterLLM } from './OpenRouterLLM'
import path from 'path'

let vectorStore: PineconeStore | null = null

const initializeVectorStore = async () => {
  if (vectorStore) return

  // Initialize Pinecone
  const pinecone = new Pinecone({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  })

  const index = pinecone.Index(process.env.PINECONE_INDEX!)

  // Load PDF
  const loader = new PDFLoader(path.join(__dirname, '../../data/nitk_faq.pdf'))
  const docs = await loader.load()

  // Split text into chunks
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })
  const splitDocs = await textSplitter.splitDocuments(docs)

  // Use HuggingFace embeddings instead of OpenAI
  const embeddings = new HuggingFaceTransformersEmbeddings({
    modelName: "sentence-transformers/all-MiniLM-L6-v2"
  })

  vectorStore = await PineconeStore.fromDocuments(
    splitDocs,
    embeddings,
    {
      pineconeIndex: index as any,
      namespace: 'nitk-faq',
    }
  )
}

export const handleQuery = async (query: string) => {
  await initializeVectorStore()
  if (!vectorStore) throw new Error('Vector store not initialized')

  // Search for relevant documents
  const docs = await vectorStore.similaritySearch(query, 3)

  // Use the custom OpenRouter LLM
  const model = new OpenRouterLLM(
    process.env.OPENROUTER_API_KEY!,
    process.env.SITE_URL,
    process.env.SITE_NAME
  )

  // Create and call chain
  const chain = loadQAStuffChain(model)
  const response = await chain.call({
    input_documents: docs,
    question: query,
  })

  return response.text
} 