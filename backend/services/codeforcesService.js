const axios = require("axios");

const getCodeforcesProfile = async (handle) => {
    try {
        const response = await axios.get(
            "https://codeforces.com/api/user.info",
            {
                params: {
                    handles: handle
                }
            }
        );

        if (
            response.data.status !== "OK" ||
            !response.data.result ||
            response.data.result.length === 0
        ) {
            throw new Error("Codeforces user not found");
        }

        const user = response.data.result[0];

        return {
            handle: user.handle,
            rating: user.rating || 0,
            maxRating: user.maxRating || 0,
            rank: user.rank || "unrated",
            maxRank: user.maxRank || "unrated"
        };

    } catch (error) {
        console.error(
            "Codeforces API error:",
            error.response?.data || error.message
        );

        throw new Error("Codeforces handle not found");
    }
};

module.exports = {
    getCodeforcesProfile
};