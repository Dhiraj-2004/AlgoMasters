const axios = require('axios');
const Platform = require("../models/profileModel");
const User = require("../models/userModel");
const cron = require("node-cron");

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql/';
const HEADERS = {
    'x-csrftoken': process.env.LEETCODE_CSRF_TOKEN,
    'cookie': process.env.LEETCODE_COOKIE,
    'content-type': 'application/json',
};

// updating rank
const updateUserData = async (platformUser, username) => {
    const apiEndpoint = getPlatformApiEndpoint(platformUser);

    try {
        let rank, userData, questionData;

        if (platformUser === "leetcodeUser") {
            userData = await fetchLeetCodeData(username);
            rank = Math.floor(userData?.data?.userContestRanking?.rating || 0)
            questionData = await fetchLeetCodeQuestionData(username);
            
        } else {
            const response = await axios.get(`${apiEndpoint}/${username}`);
            rank = Math.floor(getRank(response.data, platformUser) || 0);
            questionData = await getQuestionData(username, platformUser);
        }
        console.log("UserName : ",username," Platfrom : ",platformUser," Questions : ",questionData)
        const rankFieldMap = {
            leetcodeUser: "globalRank.leetcodeRank",
            codechefUser: "globalRank.codechefRank",
            codeforcesUser: "globalRank.codeforcesRank",
        };
        const questionFieldMap = {
            leetcodeUser: "question.leetcode",
            codechefUser: "question.codechef",
            codeforcesUser: "question.codeforces",
        };
        const rankField = rankFieldMap[platformUser];
        const questionField = questionFieldMap[platformUser];

        await Platform.findOneAndUpdate(
            { [`usernames.${platformUser}`]: username },
            { 
                [rankField]: rank,
                [questionField]: questionData,
            },
            { new: true }
        );

    } catch (error) {
        console.error(`Error updating ${platformUser} data for ${username}:`, error.message);
    }
};

// Update department and college ranks
const updateDepartmentAndCollegeRanks = async () => {
    console.log("Updating department and college ranks...");

    const allUsers = await User.find()
        .populate("platform")
        .select("platform department")
        .exec();

    if (allUsers.length === 0) {
        console.log("No users found.");
        return;
    }

    // Group users by department
    const departmentGroups = {};
    allUsers.forEach(user => {
        if (!user.department || !user.platform) return;
        if (!departmentGroups[user.department]) departmentGroups[user.department] = [];
        departmentGroups[user.department].push(user);
    });

    const departmentUserCounts = {};
    Object.keys(departmentGroups).forEach(dept => {
        departmentUserCounts[dept] = {
            totalcodechef: departmentGroups[dept].filter(u => u.platform?.usernames?.codechefUser).length,
            totalcodeforces: departmentGroups[dept].filter(u => u.platform?.usernames?.codeforcesUser).length,
            totalleetcode: departmentGroups[dept].filter(u => u.platform?.usernames?.leetcodeUser).length,
        };
    });

    const totalCollegeUsers = {
        totalcodechef: allUsers.filter(u => u.platform?.usernames?.codechefUser).length,
        totalcodeforces: allUsers.filter(u => u.platform?.usernames?.codeforcesUser).length,
        totalleetcode: allUsers.filter(u => u.platform?.usernames?.leetcodeUser).length,
    };

    // calculate ranks
    const calculateRank = (users, key) => {
        const sortedRanks = users
            .map(u => ({
                userId: u._id,
                rank: parseInt(u.platform?.globalRank?.[key], 10), 
                hasRank: !!(parseInt(u.platform?.globalRank?.[key], 10)),
            }))
            .sort((a, b) => {
                if (!a.hasRank && !b.hasRank) return 0;
                if (!a.hasRank) return 1;
                if (!b.hasRank) return -1;
                return b.rank-a.rank;
            });
    
        return sortedRanks.reduce((acc, entry, index) => {
            acc[entry.userId] = index + 1;
            return acc;
        }, {});
    };
    

    const collegeRanks = {
        codechefRank: calculateRank(allUsers, "codechefRank"),
        codeforcesRank: calculateRank(allUsers, "codeforcesRank"),
        leetcodeRank: calculateRank(allUsers, "leetcodeRank"),
    };

    const departmentRanks = {};
    for (const dept in departmentGroups) {
        departmentRanks[dept] = {
            codechefRank: calculateRank(departmentGroups[dept], "codechefRank"),
            codeforcesRank: calculateRank(departmentGroups[dept], "codeforcesRank"),
            leetcodeRank: calculateRank(departmentGroups[dept], "leetcodeRank"),
        };
    }

    for (const user of allUsers) {
        if (!user.platform || !user.department) continue;

        const departmentUsers = departmentUserCounts[user.department] || {
            totalcodechef: "0",
            totalcodeforces: "0",
            totalleetcode: "0",
        };

        const departmentRankings = {
            codechefRank: departmentRanks[user.department]?.codechefRank[user._id] || null,
            codeforcesRank: departmentRanks[user.department]?.codeforcesRank[user._id] || null,
            leetcodeRank: departmentRanks[user.department]?.leetcodeRank[user._id] || null,
        };

        const collegeRankings = {
            codechefRank: collegeRanks.codechefRank[user._id] || null,
            codeforcesRank: collegeRanks.codeforcesRank[user._id] || null,
            leetcodeRank: collegeRanks.leetcodeRank[user._id] || null,
        };

        // Update Platform document
        await Platform.findByIdAndUpdate(user.platform._id, {
            departmentRank: departmentRankings,
            collegeRank: collegeRankings,
            departmentUser: {
                totalcodechef: departmentUsers.totalcodechef.toString(),
                totalcodeforces: departmentUsers.totalcodeforces.toString(),
                totalleetcode: departmentUsers.totalleetcode.toString(),
            },
            collegeUser: {
                totalcodechef: totalCollegeUsers.totalcodechef.toString(),
                totalcodeforces: totalCollegeUsers.totalcodeforces.toString(),
                totalleetcode: totalCollegeUsers.totalleetcode.toString(),
            },
        });
    }
};

module.exports = updateDepartmentAndCollegeRanks;


// api for update rank
const getPlatformApiEndpoint = (platformUser) => {
    switch (platformUser) {
        case "leetcodeUser":
            return null;
        case "codechefUser":
            return process.env.CODECHEF;
        case "codeforcesUser":
            return process.env.CODEFORCES;
        default:
            throw new Error("Unknown platform");
    }
};

// leetcode rank get
const fetchLeetCodeData = async (username) => {
    const query = `
    query getUserProfile($username: String!) {
        userContestRanking(username: $username) {
            rating
        }
    }
  `;
    const variables = { username };

    try {
        const response = await axios.post(
            LEETCODE_GRAPHQL_URL,
            { query, variables },
            { headers: HEADERS }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching data from LeetCode:', error.message);
        throw new Error('Failed to fetch data from LeetCode');
    }
};

// leetcode question
const fetchLeetCodeQuestionData = async (username) => {
    const query = `
    query userProfileQuestions($username: String!) {
        matchedUser(username: $username) {
            submitStats {
                acSubmissionNum {
                    difficulty
                    count
                }
            }
        }
    }`;

    const variables = { username };

    try {
        const response = await axios.post(
            LEETCODE_GRAPHQL_URL,
            { query, variables },
            { headers: HEADERS }
        );

        const submissions = response.data?.data?.matchedUser?.submitStats?.acSubmissionNum || [];

        const solvedProblems = {
            hard: submissions.find(q => q.difficulty === "Hard")?.count?.toString() || "0",
            medium: submissions.find(q => q.difficulty === "Medium")?.count?.toString() || "0",
            easy: submissions.find(q => q.difficulty === "Easy")?.count?.toString() || "0",
            total: submissions.find(q => q.difficulty === "All")?.count?.toString() || "0",
        };

        return solvedProblems;
    } catch (error) {
        console.error("Error fetching LeetCode questions:", error.message);
        return { hard: "0", medium: "0", easy: "0", total: "0" };
    }
};


// featch codeforces question
const fetchCodeForcesQuestionData = async (username) => {
    try {
        let solvedProblems = new Set();
        let from = 1;
        let count = 100; 
        let remaining = 1500;

        while (remaining > 0) {
            const url = `https://codeforces.com/api/user.status?handle=${username}&from=${from}&count=${count}`;
            const response = await axios.get(url);

            if (response.data.status === "OK") {
                const submissions = response.data.result;
                
                submissions.forEach(submission => {
                    if (submission.verdict === "OK") {
                        const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
                        solvedProblems.add(problemId);
                    }
                });

                if (submissions.length < count) {
                    break;
                }

                from += count;
                remaining -= submissions.length;
            } else {
                console.error("Unexpected API response status:", response.data.status);
                break;
            }
        }

        return solvedProblems.size;
    } catch (error) {
        console.error("Error fetching Codeforces data:", error.message);
        return 0;
    }
};



// get rank from api
const getRank = (userData, platformUser) => {
    switch (platformUser) {
        case "codechefUser":
            const latestRating = userData?.currentRating;
            return latestRating ? Math.round(latestRating) : Math.round(userData?.currentRating);
        case "codeforcesUser":
                const codeforcesRating = userData?.result?.[0]?.rating;
                return codeforcesRating ? Math.round(codeforcesRating) : 0;
        default:
            return 0;
    }
};

// get question solved
const getQuestionData = async (username, platformUser) => {
    switch (platformUser) {
        case "leetcodeUser":
            return await fetchLeetCodeQuestionData(username);
        case "codechefUser":
            return "0";
        case "codeforcesUser":
            return await fetchCodeForcesQuestionData(username);
        default:
            return "0";
    }
};


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// schedule data update every saturday
cron.schedule("0 0 * * 6", async () => {   
    console.log(`Cron job started at ${new Date().toISOString()}`);

    const users = await Platform.find().select("usernames").lean();

    for (const user of users) {
        const { usernames } = user;

        if (usernames.leetcodeUser) {
            await updateUserData("leetcodeUser", usernames.leetcodeUser);
            await delay(2000);
        }
        if (usernames.codechefUser) {
            await updateUserData("codechefUser", usernames.codechefUser);
            await delay(2000);
        }
        if (usernames.codeforcesUser) {
            await updateUserData("codeforcesUser", usernames.codeforcesUser);
            await delay(2000);
        }
    }
    console.log(`Rank update completed. Now updating department and college ranks...`);
    await updateDepartmentAndCollegeRanks();

    console.log(`Cron job completed at ${new Date().toISOString()}`);
});
