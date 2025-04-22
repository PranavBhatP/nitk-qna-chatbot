"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleQuery = void 0;
const pinecone_1 = require("langchain/vectorstores/pinecone");
const hf_1 = require("langchain/embeddings/hf");
const pinecone_2 = require("@pinecone-database/pinecone");
const pdf_1 = require("langchain/document_loaders/fs/pdf");
const text_splitter_1 = require("langchain/text_splitter");
const OpenRouterLLM_1 = require("./OpenRouterLLM");
const path_1 = __importDefault(require("path"));
let vectorStore = null;
const initializeVectorStore = async () => {
    if (vectorStore)
        return;
    console.log("Initializing vector store...");
    // Initialize Pinecone
    const pinecone = new pinecone_2.Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    });
    const index = pinecone.Index(process.env.PINECONE_INDEX);
    try {
        // Load PDF
        console.log("Loading PDF...");
        const loader = new pdf_1.PDFLoader(path_1.default.join(__dirname, '../../data/nitk_faq.pdf'));
        const docs = await loader.load();
        console.log(`Loaded ${docs.length} documents`);
        // Split text into chunks
        console.log("Splitting documents...");
        const textSplitter = new text_splitter_1.RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const splitDocs = await textSplitter.splitDocuments(docs);
        console.log(`Split into ${splitDocs.length} chunks`);
        // Create embeddings using HuggingFace Inference API
        console.log("Creating embeddings...");
        const embeddings = new hf_1.HuggingFaceInferenceEmbeddings({
            apiKey: process.env.HUGGINGFACE_API_KEY,
        });
        // Store in Pinecone
        console.log("Storing in Pinecone...");
        vectorStore = await pinecone_1.PineconeStore.fromDocuments(splitDocs, embeddings, {
            pineconeIndex: index,
            namespace: 'nitk-faq',
        });
        console.log("Vector store initialized successfully");
    }
    catch (error) {
        console.error("Error initializing vector store:", error);
        throw error;
    }
};
const handleQuery = async (query) => {
    try {
        console.log("Handling query:", query);
        // Initialize vector store if not already done
        if (!vectorStore) {
            await initializeVectorStore();
        }
        if (!vectorStore) {
            throw new Error('Vector store initialization failed');
        }
        // Search for relevant documents
        console.log("Searching for relevant documents...");
        const docs = await vectorStore.similaritySearch(query, 3);
        console.log(`Found ${docs.length} relevant documents`);
        // Create context from documents
        const context = docs.map(doc => doc.pageContent).join('\n\n');
        // Create prompt with context
        const prompt = `
    Use the following context to answer the question. If the answer cannot be found in the context, say "I don't have enough information to answer that question."
    
    Context:
    ${context}
    
    Question: ${query}
    
    Answer:`;
        // Use the LLM to generate answer
        console.log("Generating answer...");
        const model = new OpenRouterLLM_1.OpenRouterLLM(process.env.OPENROUTER_API_KEY, process.env.SITE_URL, process.env.SITE_NAME);
        const response = await model._call(prompt);
        console.log("Generated response");
        return response;
    }
    catch (error) {
        console.error('Error in handleQuery:', error);
        throw new Error('Failed to process query');
    }
};
exports.handleQuery = handleQuery;
