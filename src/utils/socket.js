const {Server}= require('socket.io');


function connectSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:4200",
            methods: ["GET", "POST"]
        }
    });
    io.on('connection', (socket) => {
        
        socket.on("joinchat", (userId, recieverId) => {
            const roomId = [userId, recieverId].sort().join("_");
            console.log("room id : ",roomId)
            // socket.rooms
            socket.join(roomId);
        });

        socket.on("sendMessage",(userId, recieverId, text, name)=> {
            const roomId = [userId, recieverId].sort().join("_");
            console.log("receive message : ", text)
            console.log("rec room id : ",roomId)
            let a = "io"
            io.to(roomId).emit("receiveMessage",{userId,name,a})
            let b = "socket"
            socket.to(roomId).emit("receiveMessage",{userId,name,b})
            // socket.emit("receiveMessage",text)
        })

          socket.on("disconnecting", () => {
    console.log(socket.rooms); // the Set contains at least the socket ID
  });

  socket.on("disconnect", () => {
    // socket.rooms.size === 0
  });

    });
}

module.exports = { connectSocket }