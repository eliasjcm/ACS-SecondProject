import express from 'express'
import dotenv from 'dotenv'
import redis from 'redis'
import cors from 'cors'
import evaluationRoutes from './routes/evaluation.route.js'
import userRoutes from './routes/users.route.js'

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

dotenv.config();

const RedisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST)

app.use("/evaluation", evaluationRoutes);
app.use("/users", userRoutes)

// Routers
app.get('/', (req, res)=>{
    res.send("Hello World");
});

RedisClient.on('error', err => {
    console.log(err)
})

app.listen(port, ()=> {
    console.log(`Server running on port ${port}`);
});

export default RedisClient
