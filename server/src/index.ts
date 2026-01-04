import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import prisma from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
import authRoutes from './routes/auth.routes';
import collegeRoutes from './routes/college.routes';
import uploadRoutes from './routes/upload.routes';
import govRoutes from './routes/gov.routes';
import studentRoutes from './routes/student.routes';
import publicRoutes from './routes/public.routes';
import documentRoutes from './routes/document.routes';

app.use('/api/auth', authRoutes);
app.use('/api/college', collegeRoutes);
app.use('/api/gov', govRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/documents', documentRoutes);

// Root Health Check
app.get('/', (req, res) => {
    res.send('EduSphere Backend is Running 🚀');
});

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
        // Test DB Connection
        await prisma.$connect();
        console.log('✅ Database connected successfully');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to connect to database', error);
        process.exit(1);
    }
};

startServer().catch(e => {
    console.error('❌ Fatal Error:', e);
});

