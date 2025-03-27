const axios = require('axios');

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql/';
const HEADERS = {
    'x-csrftoken': process.env.LEETCODE_CSRF_TOKEN,
    'cookie': process.env.LEETCODE_COOKIE,
    'content-type': 'application/json',
};

exports.leetCode = async (req, res) => {
    const username = req.params.username;
    const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
        userCalendar {
          streak
          totalActiveDays
        }
      }
      userContestRanking(username: $username) {
        rating
        globalRanking
        totalParticipants
        topPercentage
      }
      allQuestionsCount {
        difficulty
        count
      }
      userContestRankingHistory(username: $username) {
        contest {
          title
          startTime
        }
        attended
        problemsSolved
        totalProblems
        finishTimeInSeconds
        rating
        ranking
        trendDirection
      }
      activeDailyCodingChallengeQuestion {
        date
        link
        question {
          title
          titleSlug
          difficulty
        }
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

        const data = response.data?.data;

        if (!data) {
            return res.status(500).json({ error: 'Invalid response from LeetCode', data: {} });
        }

        const matchedUser = data?.matchedUser || {
            username: 'Unknown',
            submitStats: { acSubmissionNum: [] },
            userCalendar: null
        };

        const userContestRanking = {
            rating: data?.userContestRanking?.rating ?? null,
            globalRanking: data?.userContestRanking?.globalRanking ?? null,
            totalParticipants: data?.userContestRanking?.totalParticipants ?? null,
            topPercentage: data?.userContestRanking?.topPercentage ?? null
        };

        const contestHistory = Array.isArray(data?.userContestRankingHistory)
            ? data?.userContestRankingHistory
            : [];

        const attendedContests = contestHistory
            .filter(contest => contest?.attended)
            .map(contest => ({
                contestTitle: contest?.contest?.title ?? 'Unknown',
                startTime: contest?.contest?.startTime ?? null,
                problemsSolved: contest?.problemsSolved ?? 0,
                totalProblems: contest?.totalProblems ?? 0,
                finishTimeInSeconds: contest?.finishTimeInSeconds ?? 0,
                rating: contest?.rating ?? null,
                ranking: contest?.ranking ?? null,
                trendDirection: contest?.trendDirection ?? 'UNKNOWN'
            }));

        const dailyChallenge = data?.activeDailyCodingChallengeQuestion || null;

        res.json({
            data: {
                matchedUser,
                userContestRanking: userContestRanking,
                allQuestionsCount: data?.allQuestionsCount || [],
                attendedContests,
                dailyChallenge
            }
        });
    } catch (error) {
        console.error('Error fetching data from LeetCode:', error.message);
        res.status(500).json({ error: 'Failed to fetch data from LeetCode', data: {} });
    }
};