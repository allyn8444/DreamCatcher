// function hello() {


//     console.log("HELLO PUTANGINAAA")


// }

// console.log(localStorage.getItem("temp_val"))

socket.on('data', (data) => {
    if (data.includes("Temperature")) {
        window.temp_val = Math.ceil(parseInt(data.slice(13, data.length - 5)));
        console.log("Sending temp_val via WebSocket:", window.temp_val);
        socket.emit('temperature', window.temp_val);
    }

    if (data.includes("Motion detected!")) {

        console.log("Sending motion_count via WebSocket:", window.motion_count);
        // Emit motion count to server
        socket.emit('motion', window.motion_count); // Emit motion count to server

    }
});

