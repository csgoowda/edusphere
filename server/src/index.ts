
import fs from 'fs';
try { fs.writeFileSync('debug_startup.log', 'Starting server...\n'); } catch (e) { }

import express from 'express';
fs.appendFileSync('debug_startup.log', 'Imported express\n');
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import prisma from './config/db';
fs.appendFileSync('debug_startup.log', 'Imported prisma\n');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

fs.appendFileSync('debug_startup.log', 'Middleware setup\n');

// Routes
import authRoutes from './routes/auth.routes';
fs.appendFileSync('debug_startup.log', 'Imported authRoutes\n');
import collegeRoutes from './routes/college.routes';
fs.appendFileSync('debug_startup.log', 'Imported collegeRoutes\n');
import uploadRoutes from './routes/upload.routes';
fs.appendFileSync('debug_startup.log', 'Imported uploadRoutes\n');
import govRoutes from './routes/gov.routes';
fs.appendFileSync('debug_startup.log', 'Imported govRoutes\n');
import studentRoutes from './routes/student.routes';
fs.appendFileSync('debug_startup.log', 'Routes imported\n');
import publicRoutes from './routes/public.routes';

app.use('/api/auth', authRoutes);
app.use('/api/college', collegeRoutes);
app.use('/api/gov', govRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/upload', uploadRoutes);
fs.appendFileSync('debug_startup.log', 'Routes registered\n');


app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});


const startServer = async () => {
    try {
        fs.appendFileSync('debug_startup.log', 'Connecting to DB...\n');
        // Test DB Connection
        await prisma.$connect();
        fs.appendFileSync('debug_startup.log', '✅ Database connected successfully\n');
        console.log('✅ Database connected successfully');

        app.listen(PORT, () => {
            fs.appendFileSync('debug_startup.log', `🚀 Server running on port ${PORT}\n`);
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        fs.appendFileSync('debug_startup.log', `❌ Failed to connect to database: ${error}\n`);
        console.error('❌ Failed to connect to database', error);
        process.exit(1);
    }
};

startServer().catch(e => {
    fs.appendFileSync('debug_startup.log', `❌ Fatal Error: ${e}\n`);
});

