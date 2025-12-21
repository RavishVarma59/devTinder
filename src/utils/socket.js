const {Server}= require('socket.io');
const ChatMessages = require('../models/chatMessage');
const mongoose = require('mongoose');


function connectSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
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

        socket.on("sendMessage", async (userId, recieverId, text, name)=> {
            try { 
                
                let chat = await ChatMessages.findOne({
                    peopleInChats: { $all: [userId,recieverId]}
                });
                if(!chat){
                     chat = new ChatMessages({
                        peopleInChats: [userId, recieverId],
                        messages: []
                    });
                    await chat.save();
                }

                console.log("chat found :", userId);

                const message = {
                    senderId: new mongoose.Types.ObjectId(userId),
                    text: text
                };
                chat.messages.push(message);
                await chat.save();

                const roomId = [userId, recieverId].sort().join("_");

                io.to(roomId).emit("receiveMessage",{userId,name,text});
            } catch (error){
                console.error("Error in sendMessage socket :", error);
            }
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