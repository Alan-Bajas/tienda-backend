import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import { connectDB } from './config/db.js';

const { PORT = 8080, MONGO_URI } = process.env;

await connectDB(MONGO_URI);
app.listen(PORT, () => console.log(`🚀 Server http://localhost:${PORT}`));
