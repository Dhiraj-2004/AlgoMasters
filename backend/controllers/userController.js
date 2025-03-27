const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const zod = require("zod");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// login
const loginBody = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6)
});


exports.loginUser = async (req, res) => {
    try {
        const { success } = loginBody.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                msg: "Invalid input data",
            });
        }
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                msg: "User not Exist",
                email: email
            })
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                msg: "Invalid Password"
            });
        }
        const token = generateToken(user.id);
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token
        });
    }
    catch (error) {
        res.status(500).json({
            msg: "server error",
            error: error.message
        });
    }
};


// signup
const signupBody = zod.object({
    username: zod.string().nonempty(),
    name: zod.string(),
    roll: zod.string(),
    registeredID: zod.string(),
    department: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(6),
    year: zod.string().nonempty(),
});

exports.checkUsername = async (req, res) => {
    try {
        const { username } = req.params;
        if (!username) {
            return res.status(400).json({ msg: "Username is required" });
        }
        const user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ msg: "Username already taken" });
        }

        res.status(200).json({ msg: "Username is available" });
    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};


exports.signUser = async (req, res) => {
    try {
        const parsed = signupBody.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                msg: "Invalid input data",
                errors: parsed.error.issues,
            });
        }

        const { username, name, roll, registeredID, email, password, department, year } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ msg: "User with this email already exists" });
        }
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ msg: "Username already taken" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            name,
            roll,
            registeredID,
            email,
            department,
            year,
            password: hashedPassword,
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: "30d" });

        res.status(201).json({
            msg: "Account created",
            _id: newUser.id,
            username: newUser.username,
            name: newUser.name,
            roll: newUser.roll,
            registeredID: newUser.registeredID,
            department: newUser.department,
            email: newUser.email,
            year: newUser.year,
            token,
        });
    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};

const syncIndexes = async () => {
    try {
        await User.syncIndexes();
    } catch (error) {
        console.error("Error synchronizing indexes:", error);
    }
};
syncIndexes();


// all User
exports.getAllUsers = async (req, res) => {
    try {
        const { platform, department, searchBy, search, year } = req.query;
        
        if (!platform) {
            return res.status(400).json({ error: "Platform is required" });
        }

        const trimmedPlatform = platform.slice(0, -4);

        const matchQuery = {
            [`platformData.usernames.${platform}`]: { $exists: true, $ne: null }
        };

        if (department) {
            matchQuery.department = department;
        }

        if (year && year !== "Select year") {
            matchQuery.year = year;
        }

        if (searchBy && search) {
            const searchFieldMap = {
                "Roll No": "roll",
                "Name": "name",
                "UserName": `platformData.usernames.${platform}`,
                "Registered ID": "registeredID"
            };

            if (searchFieldMap[searchBy]) {
                matchQuery[searchFieldMap[searchBy]] = { $regex: search, $options: "i" };
            }
        }

        const users = await User.aggregate([
            {
                $lookup: {
                    from: "platforms",
                    localField: "platform",
                    foreignField: "_id",
                    as: "platformData"
                }
            },
            {
                $unwind: {
                    path: "$platformData",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: matchQuery
            },
            {
                $project: {
                    name: 1,
                    roll: 1,
                    year: 1,
                    registeredID: 1,
                    username: 1,
                    department: 1,
                    usernames: `$platformData.usernames.${platform}`,
                    ranks: {
                        globalRank: `$platformData.globalRank.${trimmedPlatform}Rank`,
                        collegeRank: `$platformData.collegeRank.${trimmedPlatform}Rank`,
                        departmentRank: `$platformData.departmentRank.${trimmedPlatform}Rank`
                    },
                    platformSpecificData: {
                        [trimmedPlatform]: `$platformData.question.${trimmedPlatform === 'leetcode' ? 'leetcode.total' : trimmedPlatform}`
                    }
                }
            }
        ]);

        if (!users.length) {
            let errorMessage = "No users found";
            if (searchBy && search) {
                errorMessage += ` with ${searchBy.toLowerCase()} '${search}'`;
            }
            if (department) {
                errorMessage += ` in department '${department}'`;
            }
            if (year && year !== "Select year") {
                errorMessage += ` for year '${year}'`;
            }
            errorMessage += ".";

            return res.status(404).json({
                error: errorMessage,
                success: false
            });
        }

        res.status(200).json({
            msg: "Data retrieved successfully",
            users
        });
    } catch (error) {
        res.status(500).json({ 
            error: "Failed to fetch user data" 
        });
    }
};

// get user name for platform id
exports.getMyUserName = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: No user found in request" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json({ 
            username: user.username,
            amcatID: user.amcatkey,
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};
