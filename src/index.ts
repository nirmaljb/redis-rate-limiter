import Express from "express";
import Redis from "ioredis";

const app = Express();
const client = new Redis();

app.get('/', async (req, res) => {
    const ip = req.ip;
    const transaction = await client.multi();
    const counter: any = await transaction.incr(`${ip}`).expire(`${ip}`, 10).exec();
    
    if(counter) {
        if(counter[0][1] > 10) return res.json({ message: "You've been blocked!" });
    }
    res.json({ message: counter });
    // res.json({ message: "You can see this message" });
});

app.listen(3000);