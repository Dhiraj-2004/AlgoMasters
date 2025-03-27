const express = require("express");

const {
    loginUser,
    signUser,
    getAllUsers,
    getMyUserName,
    checkUsername,
} = require("../controllers/userController");

const{
    insertUsernames,
    updateUsernames,
    saveUserRank,
    getUserRank,
    getUserName,
    getUserData,
    getExcelData
}=require("../controllers/userDataController")

const {
    verifyOTPAndChangePassword,
    resetPassword,
    forgotPassword,
}=require("../controllers/userPassword");

const{leetCode}=require("../controllers/leetCodeQraphQl");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signUser);
router.post("/insertuser", protect, insertUsernames);
router.post("/forgotPass", forgotPassword);
router.post("/changePassword", verifyOTPAndChangePassword);

router.put("/resetPass", resetPassword);
router.put("/rank",protect,saveUserRank);
router.put('/updateUser', protect, updateUsernames);

router.get('/check-username/:username', checkUsername);
router.get("/profile",protect,getUserName);
router.get("/me", protect, getMyUserName);
router.get('/',getAllUsers);
router.get('/leetcode/:username',leetCode);
router.get('/userdata/:username',getUserData);
router.get("/college-rank/:username",getUserRank);
router.get("/excel/",getExcelData)

module.exports = router;
