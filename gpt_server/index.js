import cors from 'cors';
import express from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';
import {LlamaModel, LlamaContext, LlamaChatSession} from "node-llama-cpp";
import path from "node:path";
import {fileURLToPath} from 'url';


const _dirname = path.dirname(fileURLToPath(import.meta.url));
const model = new LlamaModel({
    modelPath: path.join(_dirname, 'models', 'notus-7b-v1.Q3_K_M.gguf')
});
const context = new LlamaContext({model});
const session = new LlamaChatSession({context});

const app = express();
const server = createServer(app);

app.use(
    cors({
        origin: "*"
    })
)

const io = new Server(server, {
    cors:{
        origin: "*"
    }
});

io.on("connection", (soc) => {
    console.log("New connection");
    soc.on("message" , async (msg) => {
        const botReply = await session.prompt(msg);
        soc.emit("response", botReply);
    })
})

const PORT = process.env.PORT || 8080;

app.get('/test' , (req , res) => {
    res.send('For test');
})

server.listen(PORT, () => {
    console.log("GO to server on Port", PORT);
})
