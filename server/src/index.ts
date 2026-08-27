import Fastify from "fastify";
import cors from "@fastify/cors";
import { Server } from "socket.io";

const fastify = Fastify({
    logger: true,
})

await fastify.register(cors, {
  origin: "http://localhost:3000",
});


fastify.get("/health", async ()=>{
    return {
        status: "ok",
    }
})

const io = new Server(fastify.server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
    console.log("Socket Connected", socket.id);

    socket.on("draw:stroke", (stroke) => {
        socket.broadcast.emit("draw:stroke", stroke);
    });
    
    socket.on("disconnect", () => {
        console.log("Socket disonnected", socket.id); 
    })
})

await fastify.listen({
    port: 4000,
    host:"0.0.0.0"
})