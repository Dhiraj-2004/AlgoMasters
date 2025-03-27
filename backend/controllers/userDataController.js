const User = require("../models/userModel");
const Platform = require("../models/profileModel");
const Amcat = require("../models/amcatModel")
const ExcelJS = require("exceljs");

// Save usernames in both User and Platform schema
exports.insertUsernames = async (req, res) => {
    const { leetcodeUser, codechefUser, codeforcesUser, amcatkey } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const existingPlatform = await User.findOne({_id: req.user.id,platform: { $exists: true, $ne: null }});
        if (existingPlatform) {
            return res.status(403).json({
                message: "User has already submitted platform data. Please Login!.",
            });
        }

        const platform = new Platform({
            userId: req.user.id,
            usernames: { leetcodeUser, codechefUser, codeforcesUser },
        });

        await platform.save();

        user.platform = platform._id;
        if (amcatkey) user.amcatkey = amcatkey;
        await user.save();

        res.status(201).json({
            message: "Usernames inserted successfully",
            platform
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Update user profile and usernames
exports.updateUsernames = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        const { leetcodeUser, codechefUser, codeforcesUser, year, roll, amcatkey, department } = req.body;
        const updateFields = {};
        const platformUpdateFields = {};

        if (leetcodeUser) {
            updateFields["usernames.leetcodeUser"] = leetcodeUser;
            platformUpdateFields["usernames.leetcodeUser"] = leetcodeUser;
        }
        if (codechefUser) {
            updateFields["usernames.codechefUser"] = codechefUser;
            platformUpdateFields["usernames.codechefUser"] = codechefUser;
        }
        if (codeforcesUser) {
            updateFields["usernames.codeforcesUser"] = codeforcesUser;
            platformUpdateFields["usernames.codeforcesUser"] = codeforcesUser;
        }
        if (year) updateFields["year"] = year;
        if (roll) updateFields["roll"] = roll;
        if (department) updateFields["department"] = department;
        if (amcatkey) updateFields["amcatkey"] = amcatkey;

        if (Object.keys(updateFields).length === 0 && Object.keys(platformUpdateFields).length === 0) {
            return res.status(400).json({
                message: "No valid fields provided for update"
            });
        }

        const user = await User.findByIdAndUpdate(req.user.id, { $set: updateFields }, { new: true });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        let platform = null;
        if (Object.keys(platformUpdateFields).length > 0) {
            platform = await Platform.findOneAndUpdate(
                { _id: user.platform },
                { $set: platformUpdateFields },
                { new: true, runValidators: true }
            );
            if (!platform) {
                return res.status(404).json({
                    message: "Platform data not found for user"
                });
            }
        }

        res.json({
            message: "User profile updated successfully",
            user, platform
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Save user rank and problem
exports.saveUserRank = async (req, res) => {
    const { rank, hard, medium, easy, total, platformUser, username } = req.body;

    try {
        const platform = await Platform.findOne({ [`usernames.${platformUser}`]: username });
        if (!platform) {
            return res.status(404).json({
                msg: "User or platform username not found"
            });
        }

        const rankFieldMap = {
            leetcodeUser: {
                rank: "globalRank.leetcodeRank",
                question: "question.leetcode"
            },
            codechefUser: {
                rank: "globalRank.codechefRank",
                question: "question.codechef"
            },
            codeforcesUser: {
                rank: "globalRank.codeforcesRank",
                question: "question.codeforces"
            }
        };

        const platformFields = rankFieldMap[platformUser];
        if (!platformFields) {
            return res.status(400).json({
                msg: "Invalid platform specified"
            });
        }

        const updateData = { $set: { [platformFields.rank]: rank } };

        if (platformUser === "leetcodeUser") {
            updateData.$set[`${platformFields.question}.hard`] = hard;
            updateData.$set[`${platformFields.question}.medium`] = medium;
            updateData.$set[`${platformFields.question}.easy`] = easy;
            updateData.$set[`${platformFields.question}.total`] = hard + medium + easy;
        } else {
            updateData.$set[platformFields.question] = total;
        }

        const updatedPlatform = await Platform.findByIdAndUpdate(platform._id, updateData, { new: true });

        if (!updatedPlatform) {
            return res.status(500).json({
                msg: "Failed to update rank and questions"
            });
        }

        res.status(200).json({
            msg: "Rank and questions updated successfully",
            updatedPlatform
        });
    } catch (error) {
        res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
};


// Get user rank
exports.getUserRank = async (req, res) => {
    const { username } = req.params;

    try {
        // Find the user in Platform model based on usernames
        const platformUser = await Platform.findOne({
            $or: [
                { "usernames.codechefUser": username },
                { "usernames.codeforcesUser": username },
                { "usernames.leetcodeUser": username }
            ]
        });

        if (!platformUser) {
            return res.status(404).json({ msg: "User not found" });
        }

        const user = await User.findOne({ platform: platformUser._id }).select("department platform");

        if (!user) {
            return res.status(404).json({ msg: "User data not found" });
        }
        const allUsers = await User.find().select("platform department");

        const allPlatformIds = allUsers.map((u) => u.platform).filter((id) => id);
        const allPlatforms = await Platform.find({ _id: { $in: allPlatformIds } });

        const totalCollegeUsers = allPlatforms.length;

        const departmentUsers = allUsers.filter(u => u.department === user.department);
        const departmentPlatformIds = departmentUsers.map((u) => u.platform).filter((id) => id);
        const departmentPlatforms = await Platform.find({ _id: { $in: departmentPlatformIds } });

        const totalDepartmentUsers = departmentPlatforms.length;

        const calculateRank = (users, key) => {
            const sortedRanks = users
                .map((u) => parseInt(u.globalRank?.[key], 10))
                .filter((rank) => !isNaN(rank))
                .sort((a, b) => b - a);

            return sortedRanks.indexOf(parseInt(platformUser.globalRank?.[key], 10)) + 1 || null;
        };

        const overallRanks = {
            codeforces: calculateRank(allPlatforms, "codeforcesRank"),
            codechef: calculateRank(allPlatforms, "codechefRank"),
            leetcode: calculateRank(allPlatforms, "leetcodeRank"),
        };

        const departmentRanks = {
            codeforces: calculateRank(departmentPlatforms, "codeforcesRank"),
            codechef: calculateRank(departmentPlatforms, "codechefRank"),
            leetcode: calculateRank(departmentPlatforms, "leetcodeRank"),
        };

        let isUpdated = false;

        if (
            platformUser.collegeRank?.codeforcesRank !== overallRanks.codeforces ||
            platformUser.collegeRank?.codechefRank !== overallRanks.codechef ||
            platformUser.collegeRank?.leetcodeRank !== overallRanks.leetcode
        ) {
            platformUser.collegeRank = {
                codeforcesRank: overallRanks.codeforces?.toString(),
                codechefRank: overallRanks.codechef?.toString(),
                leetcodeRank: overallRanks.leetcode?.toString(),
            };
            isUpdated = true;
        }

        if (
            platformUser.collegeUser?.totalcodeforces !== totalCollegeUsers.toString() ||
            platformUser.collegeUser?.totalcodechef !== totalCollegeUsers.toString() ||
            platformUser.collegeUser?.totalleetcode !== totalCollegeUsers.toString()
        ) {
            platformUser.collegeUser = {
                totalcodeforces: totalCollegeUsers.toString(),
                totalcodechef: totalCollegeUsers.toString(),
                totalleetcode: totalCollegeUsers.toString(),
            };
            isUpdated = true;
        }

        if (
            platformUser.departmentRank?.codeforcesRank !== departmentRanks.codeforces ||
            platformUser.departmentRank?.codechefRank !== departmentRanks.codechef ||
            platformUser.departmentRank?.leetcodeRank !== departmentRanks.leetcode
        ) {
            platformUser.departmentRank = {
                codeforcesRank: departmentRanks.codeforces?.toString(),
                codechefRank: departmentRanks.codechef?.toString(),
                leetcodeRank: departmentRanks.leetcode?.toString(),
            };
            isUpdated = true;
        }

        if (
            platformUser.departmentUser?.totalcodeforces !== totalDepartmentUsers.toString() ||
            platformUser.departmentUser?.totalcodechef !== totalDepartmentUsers.toString() ||
            platformUser.departmentUser?.totalleetcode !== totalDepartmentUsers.toString()
        ) {
            platformUser.departmentUser = {
                totalcodeforces: totalDepartmentUsers.toString(),
                totalcodechef: totalDepartmentUsers.toString(),
                totalleetcode: totalDepartmentUsers.toString(),
            };
            isUpdated = true;
        }

        if (isUpdated) {
            await platformUser.save();
        }

        return res.status(200).json({
            msg: "Rank data fetched successfully",
            userRank: {
                overall: overallRanks,
                department: departmentRanks,
            },
            totalUsers: {
                college: totalCollegeUsers,
                department: totalDepartmentUsers,
            },
        });

    } catch (error) {
        res.status(500).json({ msg: "Server error", error });
    }
};



// get username
exports.getUserName = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ msg: "Unauthorized" });
        }

        const user = await User.findById(req.user.id).populate('platform', 'usernames');

        if (!user) {
            return res.status(404).json({
                msg: "User not found"
            });
        }

        if (!user.platform) {
            return res.status(404).json({
                msg: "User platform data not found"
            });
        }

        res.json({
            name: user.name,
            email: user.email,
            department: user.department,
            platform: user.platform,
        });

    } catch (error) {
        console.error("Error fetching platform usernames:", error);
        res.status(500).json({ msg: "Server error" });
    }
};


// userdata
exports.getUserData = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({ msg: "Username is required" });
        }

        const user = await User.findOne({ username }).populate('platform');
        if (!user) {
            return res.status(404).json({
                msg: "User not found"
            });
        }

        const amcatData = await Amcat.findOne({ amcatID: user.amcatkey }) || "No Amcat data found";

        res.json({
            userData: {
                username: user.username,
                name: user.name,
                email: user.email,
                department: user.department,
                year: user.year,
                roll: user.roll,
                registeredID: user.registeredID,
                amcatKey: user.amcatkey || "NA"
            },
            platform: user.platform,
            amcatData
        });

    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ msg: "Server error" });
    }
};



exports.getExcelData = async (req, res) => {
    try {
        const { year, department } = req.query;

        if (!year) return res.status(400).json({ error: "Year is required" });

        const query = { year };
        if (department) query.department = { $regex: new RegExp(department, 'i') };

        const users = await User.find(query).populate({
            path: 'platform',
            select: 'globalRank collegeRank departmentRank question'
        });

        if (users.length === 0) {
            return res.status(404).json({
                error: `No users found for year: ${year}${department ? ` and department: ${department}` : ''}`
            });
        }

        let departmentGroups;
        if (department) {
            const deptKey = department.trim().toLowerCase();
            departmentGroups = {
                [deptKey]: users
            };
        } else {
            departmentGroups = users.reduce((acc, user) => {
                const dept = (user.department || 'Unknown').trim().toLowerCase();
                if (!acc[dept]) acc[dept] = [];
                acc[dept].push(user);
                return acc;
            }, {});
        }


        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'System';
        workbook.created = new Date();

        const usedNames = new Set();

        Object.keys(departmentGroups).forEach((deptKey) => {
            let worksheetName = deptKey
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            worksheetName = worksheetName.length > 31 ? worksheetName.substring(0, 31) : worksheetName;

            worksheetName = worksheetName.replace(/[\[\]*?:\/\\]/g, '');

            let finalName = worksheetName;
            let suffix = 0;
            while (usedNames.has(finalName)) {
                suffix++;
                finalName = `${worksheetName.slice(0, 31 - String(suffix).length)}${suffix}`;
            }
            usedNames.add(finalName);


            const worksheet = workbook.addWorksheet(finalName);

            worksheet.columns = [
                { header: "Roll No", key: "roll", width: 15 },
                { header: "Name", key: "name", width: 25 },
                { header: "Registered ID", key: "registeredID", width: 20 },
                { header: "CodeChef Global Rank", key: "codechefGlobalRank", width: 15 },
                { header: "CodeForces Global Rank", key: "codeforcesGlobalRank", width: 15 },
                { header: "LeetCode Global Rank", key: "leetcodeGlobalRank", width: 15 },
                { header: "CodeChef College Rank", key: "codechefCollegeRank", width: 15 },
                { header: "CodeForces College Rank", key: "codeforcesCollegeRank", width: 15 },
                { header: "LeetCode College Rank", key: "leetcodeCollegeRank", width: 15 },
                { header: "CodeChef Dept Rank", key: "codechefDeptRank", width: 15 },
                { header: "CodeForces Dept Rank", key: "codeforcesDeptRank", width: 15 },
                { header: "LeetCode Dept Rank", key: "leetcodeDeptRank", width: 15 },
                { header: "LeetCode Total", key: "leetcodeTotal", width: 15 },
                { header: "CodeForces Total", key: "codeforcesTotal", width: 15 }
            ];

            worksheet.getRow(1).font = { bold: true };
            worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

            departmentGroups[deptKey].forEach(user => {
                worksheet.addRow({
                    roll: user.roll,
                    name: user.name,
                    registeredID: user.registeredID || "N/A",
                    codechefGlobalRank: user.platform?.globalRank?.codechefRank || "N/A",
                    codeforcesGlobalRank: user.platform?.globalRank?.codeforcesRank || "N/A",
                    leetcodeGlobalRank: user.platform?.globalRank?.leetcodeRank || "N/A",
                    codechefCollegeRank: user.platform?.collegeRank?.codechefRank || "N/A",
                    codeforcesCollegeRank: user.platform?.collegeRank?.codeforcesRank || "N/A",
                    leetcodeCollegeRank: user.platform?.collegeRank?.leetcodeRank || "N/A",
                    codechefDeptRank: user.platform?.departmentRank?.codechefRank || "N/A",
                    codeforcesDeptRank: user.platform?.departmentRank?.codeforcesRank || "N/A",
                    leetcodeDeptRank: user.platform?.departmentRank?.leetcodeRank || "N/A",
                    leetcodeTotal: user.platform?.question?.leetcode?.total || "N/A",
                    codeforcesTotal: user.platform?.question?.codeforces || "N/A"
                });
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        const safeYear = year.replace(/\s+/g, '_');
        const filename = department ? `Student_Rankings_${safeYear}_${department.replace(/\s+/g, '_')}.xlsx` : `Student_Rankings_${safeYear}.xlsx`;
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

        const buffer = await workbook.xlsx.writeBuffer();
        res.send(buffer);

    } catch (error) {
        console.error('Error generating Excel:', error);
        res.status(500).json({
            error: "Internal server error",
            message: error.message
        });
    }
};