const waitingPlayers = [];

const setupArenaSocket = (io) => {

    io.on("connection", (socket) => {

        console.log(
            `CodeArena user connected: ${socket.id}`
        );


        /* FIND MATCH */

        socket.on("find_match", () => {

            console.log(
                `Player ${socket.id} is looking for a match`
            );


            const alreadyWaiting =
                waitingPlayers.includes(socket.id);


            if (alreadyWaiting) {
                return;
            }


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


        /* CANCEL MATCHMAKING */

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


        /* JOIN ARENA ROOM */

        socket.on("join_arena", (roomId) => {

            socket.join(roomId);


            const room =
                io.sockets.adapter.rooms.get(roomId);


            const playerCount =
                room ? room.size : 0;


            io.to(roomId).emit(
                "arena_players",
                {
                    count: playerCount
                }
            );


            if (playerCount >= 2) {

                io.to(roomId).emit(
                    "opponent_connected"
                );

            }


            console.log(
                `${socket.id} joined arena ${roomId}`
            );

        });


        /* PLAYER STATUS */

        socket.on(
            "player_submitted",
            (roomId) => {

                socket.to(roomId).emit(
                    "opponent_submitted"
                );

            }
        );


        /* DISCONNECT */

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