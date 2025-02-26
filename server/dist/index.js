"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const queryHandler_1 = require("./utils/queryHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post('/api/query', async (req, res) => {
    try {
        const { query } = req.body;
        const response = await (0, queryHandler_1.handleQuery)(query);
        res.json({ response });
    }
    catch (error) {
        console.error('Query error:', error);
        res.status(500).json({ error: 'Failed to process query' });
    }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
