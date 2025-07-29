import Express from "express";
import Redis from "ioredis";

const app = Express();
const client = new Redis();

const RATE_LIMIT_COUNT = 10
const TIME_LIMIT_WINDOW= 60
app.get('/', async (req, res) => {
    const ip = req.ip;
    const key = `rate-limit-${ip}`
    const transaction = client.multi();
    const counter: any = await transaction.incr(key).expire(key, TIME_LIMIT_WINDOW).exec();

    const currentCounter = counter[0][1];

    res.setHeader('X-RateLimit-Limit', RATE_LIMIT_COUNT);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT_COUNT - currentCounter));
    
    if(currentCounter > RATE_LIMIT_COUNT) return res.status(429).json({ message: "You've been blocked!" });
    res.json({ message: "You can see this message" });
});

app.listen(3000);