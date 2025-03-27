const Amcat = require('../models/amcatModel');


//Getting user rank...

exports.getUserRankByScores = async (req, res) => {
    const { amcatID } = req.params;

    try {
        const user = await Amcat.findOne({ amcatID });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const allUsers = await Amcat.find().select("name rollNo amcatID cppScore elqScore quant english logical automata");

        const sortedByElqScore = [...allUsers].sort((a, b) => 
            Number(b.elqScore) - Number(a.elqScore)
        );
        const sortedByAutomataScore = [...allUsers].sort((a, b) => 
            Number(b.automata) - Number(a.automata)
        );
        const elqRank = sortedByElqScore.findIndex(u => u.amcatID === user.amcatID) + 1;
        const automataRank = sortedByAutomataScore.findIndex(u => u.amcatID === user.amcatID) + 1;

        return res.status(200).json({
            msg: "Rank data fetched successfully",
            userInfo: {
                name: user.name,
                rollNo: user.rollNo,
                amcatID: user.amcatID,
                cppScore: user.cppScore,
                quant: user.quant,
                english: user.english,
                logical: user.logical,
                elqScore: user.elqScore,
                automata: user.automata
            },
            ranks: {
                elqRank,
                automataRank
            },
            totalUsers: allUsers.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Server error",
            error,
        });
    }
};
