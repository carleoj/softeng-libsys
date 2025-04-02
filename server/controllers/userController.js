const db = require('../config/db');

// Get all users
const getUsers = async (req, res) => {
    try {
        const [data] = await db.query('SELECT * FROM users');
        res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Database error' });
    }
};

// Get student by username
const getStudentByUsername = async (req, res) => {
    const { username } = req.query;

    try {
        const [result] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(result[0]);
    } catch (err) {
        console.error('Error fetching student:', err);
        res.status(500).json({ error: 'Database error' });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide both username and password' });
    }

    try {
        const [results] = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (results.length > 0) {
            const user = results[0];

            // Compare the entered password with the hashed password in the database
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                const role = user.role === 'faculty' ? 'faculty' : 'student';
                return res.status(200).json({ message: 'Login successful', user, role });
            } else {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


// Signup user
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of rounds to hash the password (higher = more secure, but slower)

// Signup user with encrypted password
const signupUser = async (req, res) => {
    const { studentId, name, course, phone, username, password } = req.body;

    if (!studentId || !name || !course || !phone || !username || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate that the phone number is numeric
    if (!/^\d+$/.test(phone)) {
        return res.status(400).json({ error: 'Phone number must contain only numeric characters' });
    }

    try {
        // Check if the user already exists
        const [existingUser] = await db.query(
            `SELECT * FROM users WHERE student_id = ? OR username = ?`,
            [studentId, username]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'User with the same student ID or username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert the user with the hashed password
        await db.query(
            `INSERT INTO users (student_id, name, course, phone_number, username, password)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [studentId, name, course, phone, username, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error saving user:', err);
        res.status(500).json({ error: 'Database error' });
    }
};


module.exports = {
    getUsers,
    loginUser,
    signupUser,
    getStudentByUsername,
};
