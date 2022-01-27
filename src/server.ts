

import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const server = createServer(app)
const corsOptions = {
    origin: true,
    credentials: true
}

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','http://localhost:3000')
    res.setHeader('Access-Control-Allow-Methods','GET,PUT,PATCH,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Header','XMLHttpRequest,X-Requested-With,Content-Type,token')
    res.setHeader('Access-Control-Allow-Credentials','true')
    next()
})

const io = new Server(server,{
    cors: {
        origin: 'http://localhost:3000'
    }
})

io.on('connection', (socket) => {
    console.log('connected')

    // socket.on('login', (name) => {
    //     socket.broadcast.emit('login', name)
    // })



    // socket.on('sent-to', (params) => {
    //     console.log(`sent-to ${params}`)
    //     socket.to(params.recipient).emit('private-message', { 
    //         message: params.message,
    //         sender: socket.id
    //      })
    // })
    socket.on('send-to', (params) => {
        socket.to(params.recipient).emit('private-message', { 
                    message: params.message,
                    sender: socket.id
                 });
    });
    socket.on('join-room', (params) => {
        console.log('joining room')
        socket.join(params.room)
        io.to(socket.id).emit('joined-room')
        io.to(params.room).emit('public-message',`New user ${socket.id}`)
    });
})

server.listen(1337, () => {
    console.log(`SERVER: LOCALHOST:1337`)
})