"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleQuery = void 0;
const pinecone_1 = require("langchain/vectorstores/pinecone");
const hf_transformers_1 = require("langchain/embeddings/hf_transformers");
const pinecone_2 = require("@pinecone-database/pinecone");
const pdf_1 = require("langchain/document_loaders/fs/pdf");
const text_splitter_1 = require("langchain/text_splitter");
const chains_1 = require("langchain/chains");
const OpenRouterLLM_1 = require("./OpenRouterLLM");
const path_1 = __importDefault(require("path"));
let vectorStore = null;
const initializeVectorStore = async () => {
    if (vectorStore)
        return;
    // Initialize Pinecone
    const pinecone = new pinecone_2.Pinecone({
        environment: process.env.PINECONE_ENVIRONMENT,
        apiKey: process.env.PINECONE_API_KEY,
    });
    const index = pinecone.Index(process.env.PINECONE_INDEX);
    // Load PDF
    const loader = new pdf_1.PDFLoader(path_1.default.join(__dirname, '../../data/nitk_faq.pdf'));
    const docs = await loader.load();
    // Split text into chunks
    const textSplitter = new text_splitter_1.RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const splitDocs = await textSplitter.splitDocuments(docs);
    // Use HuggingFace embeddings instead of OpenAI
    const embeddings = new hf_transformers_1.HuggingFaceTransformersEmbeddings({
        modelName: "sentence-transformers/all-MiniLM-L6-v2"
    });
    vectorStore = await pinecone_1.PineconeStore.fromDocuments(splitDocs, embeddings, {
        pineconeIndex: index,
        namespace: 'nitk-faq',
    });
};
const handleQuery = async (query) => {
    await initializeVectorStore();
    if (!vectorStore)
        throw new Error('Vector store not initialized');
    // Search for relevant documents
    const docs = await vectorStore.similaritySearch(query, 3);
    // Use the custom OpenRouter LLM
    const model = new OpenRouterLLM_1.OpenRouterLLM(process.env.OPENROUTER_API_KEY, process.env.SITE_URL, process.env.SITE_NAME);
    // Create and call chain
    const chain = (0, chains_1.loadQAStuffChain)(model);
    const response = await chain.call({
        input_documents: docs,
        question: query,
    });
    return response.text;
};
exports.handleQuery = handleQuery;
