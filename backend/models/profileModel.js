const mongoose = require('mongoose');

const platformSchema = new mongoose.Schema({
    usernames: {
        codechefUser: { 
            type: String, 
            sparse: true 
        },
        codeforcesUser:  { 
            type: String, 
            sparse: true 
        },
        leetcodeUser: { 
            type: String, 
            sparse: true 
        },
    },
    globalRank: {
        codechefRank:  { 
            type: String, 
            sparse: true 
        },
        codeforcesRank:  { 
            type: String, 
            sparse: true 
        },
        leetcodeRank:  { 
            type: String, 
            sparse: true 
        },
    },
    collegeRank: {
        codechefRank:  { 
            type: String, 
            sparse: true 
        },
        codeforcesRank:  { 
            type: String, 
            sparse: true 
        },
        leetcodeRank:  { 
            type: String, 
            sparse: true 
        },
    },
    collegeUser: {
        totalcodechef:  { 
            type: String, 
            sparse: true 
        },
        totalcodeforces:  { 
            type: String, 
            sparse: true 
        },
        totalleetcode:  { 
            type: String, 
            sparse: true 
        },
    },
    departmentRank: {
        codechefRank:  { 
            type: String, 
            sparse: true 
        },
        codeforcesRank:  { 
            type: String, 
            sparse: true 
        },
        leetcodeRank: { 
            type: String, 
            sparse: true 
        },

    },
    departmentUser: {
        totalcodechef:  { 
            type: String, 
            sparse: true 
        },
        totalcodeforces:  { 
            type: String, 
            sparse: true 
        },
        totalleetcode:  { 
            type: String, 
            sparse: true 
        },
    },
    question:{
        leetcode:{
            hard:{
                type: String, 
                sparse: true 
            },
            medium:{
                type: String, 
                sparse: true 
            },
            easy:{
                type: String, 
                sparse: true 
            },
            total:{
                type: String, 
                sparse: true 
            }
        },
        codechef:{
            type: String, 
            sparse: true 
        },
        codeforces :{
            type: String, 
            sparse: true 
        }
    },
    
});

const platform = mongoose.model('Platform', platformSchema);
module.exports = platform;
