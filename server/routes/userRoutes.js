const express = require('express');
const { getUsers, loginUser, signupUser, getStudentByUsername } = require('../controllers/userController');

const router = express.Router();

router.get('/users', getUsers);
router.post('/login', loginUser);
router.post('/signup', signupUser);
router.get('/getUser', getStudentByUsername);

module.exports = router;
