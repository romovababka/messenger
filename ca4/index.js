const express = require("express");
const socket = require("socket.io");

// App setup
const PORT = 3000;
const app = express();
const server = app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);

});

// Static files
app.use(express.static("public"));

// Socket setup
const io = socket(server);

//we use a set to store users, sets objects are for unique values of any type
const activeUsers = new Set();

io.on("connection", function (socket) {
    console.log("Made socket connection");


    socket.on("new user", function (data) {
        socket.userId = data;
        activeUsers.add(data);
        /*socket.broadcast.emit("user-connected")*/
        //... is the the spread operator, adds to the set while retaining what was in there already
        io.emit("new user", [...activeUsers]);
        //let who_join
        socket.broadcast.emit("user-connected", socket.userId);
    });



    socket.on("disconnect", function () {
        socket.broadcast.emit("user-disconnected", socket.userId);
        activeUsers.delete(socket.userId);
        io.emit("user disconnected", socket.userId);
        //socket.broadcast.emit("user-disconnected", socket.userId);
    });

    socket.on("chat message", function (data) {
        io.emit("chat message", data);
    });


    socket.on("typing", () => {
        socket.broadcast.emit("typing", socket.userId);
    });


});


/*let count = 0;

io.on('connection', function(socket) {
    count++;
    io.sockets.emit('message', { count: count });

    io.sockets.on('disconnect', function(){
        count--;
        io.sockets.emit('message', { count: count });
    })
});*/
