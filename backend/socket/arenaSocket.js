const waitingPlayers = [];

const setupArenaSocket = (io) => {

    io.on("connection", (socket) => {

        console.log(
            `CodeArena user connected: ${socket.id}`
        );


        socket.on("find_match", () => {

            console.log(
                `Player ${socket.id} is looking for a match`
            );


            // Prevent duplicate queue entries
            const alreadyWaiting = waitingPlayers.includes(
                socket.id
            );

            if (alreadyWaiting) {
                return;
            }


            // If another player is waiting
            if (waitingPlayers.length > 0) {

                const opponentId =
                    waitingPlayers.shift();


                const roomId =
                    `arena_${Date.now()}`;


                socket.join(roomId);

                const opponentSocket =
                    io.sockets.sockets.get(opponentId);


                if (opponentSocket) {

                    opponentSocket.join(roomId);


                    io.to(roomId).emit(
                        "match_found",
                        {
                            roomId
                        }
                    );


                    console.log(
                        `Match created: ${roomId}`
                    );

                } else {

                    waitingPlayers.push(
                        socket.id
                    );

                }

            } else {

                waitingPlayers.push(
                    socket.id
                );


                socket.emit(
                    "waiting_for_opponent"
                );


                console.log(
                    `Player ${socket.id} added to queue`
                );

            }

        });


        socket.on("cancel_matchmaking", () => {

            const index =
                waitingPlayers.indexOf(socket.id);


            if (index !== -1) {

                waitingPlayers.splice(
                    index,
                    1
                );

            }


            socket.emit(
                "matchmaking_cancelled"
            );

        });


        socket.on("disconnect", () => {

            const index =
                waitingPlayers.indexOf(socket.id);


            if (index !== -1) {

                waitingPlayers.splice(
                    index,
                    1
                );

            }


            console.log(
                `CodeArena user disconnected: ${socket.id}`
            );

        });

    });

};


module.exports = setupArenaSocket;