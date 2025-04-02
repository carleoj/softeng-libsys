const db = require('../config/db');

const addUserPrintRequest = async (req, res) => {
    try {
        console.log('Incoming request data:', req.body);

        const { fileName, fileLink, message, student_id } = req.body;

        if (!fileName || !fileLink || !message || !student_id) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const result = await db.query(
            `INSERT INTO prints (student_id, file_name, file_link, message, requested_at) 
             VALUES (?, ?, ?, ?, NOW())`,
            [student_id, fileName, fileLink, message]
        );

        res.status(200).json({
            print_id: result.insertId,
            student_id,
            file_name: fileName,
            file_link: fileLink, 
            message,
            requested_at: new Date(),
            price: null,
            status: 'pending'
        });
    } catch (error) {
        console.error('Upload error:', error.message);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ error: 'Failed to process request' });
    }
};

const getPrintRequestsByStudent = async (req, res) => {
    const { student_id } = req.query; 

    try {
        const [data] = await db.query('SELECT * FROM prints WHERE student_id = ?', [student_id]);
        res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching print requests:', err);
        res.status(500).json({ error: 'Database error' });
    }
};

// Get pending print requests
const getPendingRequests = async (req, res) => {
    try {
        const query = `
            SELECT prints.*, users.name, users.course, users.phone_number
            FROM prints
            JOIN users ON prints.student_id = users.student_id
            WHERE prints.status = 'pending'
            ORDER BY prints.requested_at ASC
        `;
        const [data] = await db.query(query);
        res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching pending requests:', err);
        res.status(500).json({ error: 'Database error' });
    }
};

const approveRequest = async (req, res) => {
    const { id } = req.params; 
    const { price } = req.body; 

    try {
        const [result] = await db.query('UPDATE prints SET price = ?, status = "approved" WHERE print_id = ?', [price, id]);

        if (result.affectedRows === 0) {
            console.error(`No request found with print_id: ${id}`); 
            return res.status(404).json({ message: 'Request not found' });
        }

        res.status(200).json({ message: 'Request updated successfully' });
    } catch (error) {
        console.error('Error during the update:', error);
        res.status(500).json({ message: 'Error updating the request' });
    }
};

const getApprovedRequests = async (req, res) => {
    try {
        const query = `
            SELECT prints.*, users.name, users.course, users.phone_number
            FROM prints
            JOIN users ON prints.student_id = users.student_id
            WHERE prints.status = 'approved'
            ORDER BY prints.requested_at ASC
        `;
        const [data] = await db.query(query);
        res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching approved requests:', err);
        res.status(500).json({ error: 'Database error' });
    }
};

const printRequest = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('UPDATE prints SET status = "printed" WHERE print_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.status(200).json({ message: 'Request marked as printed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating the request status' });
    }
};

const getPrintedRequests = async (req, res) => {
    try {
      const query = `
        SELECT prints.print_id, prints.student_id, prints.file_name, prints.price, prints.requested_at, 
               users.name, users.course, users.phone_number
        FROM prints
        JOIN users ON prints.student_id = users.student_id
        WHERE prints.status = 'printed'
        ORDER BY prints.requested_at ASC
      `;
      const [data] = await db.query(query);
      console.log('Printed Requests:', data);  
      res.status(200).json(data);
    } catch (err) {
      console.error('Error fetching printed requests:', err);
      res.status(500).json({ error: 'Database error' });
    }
};

const clearPrintRequest = async (req, res) => {
    const { print_id } = req.params;
    const { price } = req.body;

    try {
        console.log("Received print_id:", print_id);
        console.log("Received price:", price);

        const query = `UPDATE prints SET status = 'cleared' WHERE print_id = ?`;
        const result = await db.query(query, [print_id]);
        console.log("Print request updated:", result);

        const query2 = `UPDATE stats SET total_income = total_income + ? WHERE id = 1`;
        const result2 = await db.query(query2, [price]);
        console.log("Stats updated:", result2);

        res.status(200).json({ message: 'Request cleared successfully' });
    } catch (err) {
        console.error('Error updating status:', err);
        res.status(500).json({ error: 'Database error', details: err });
    }
};

const getClearedRequests = async (req, res) => {
    try {
        const query = `
            SELECT prints.*, users.name, users.course, users.phone_number
            FROM prints
            JOIN users ON prints.student_id = users.student_id
            WHERE prints.status = 'cleared'
            ORDER BY prints.requested_at ASC
        `;
        const [data] = await db.query(query);
        res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching cleared requests:', err);
        res.status(500).json({ error: 'Database error' });
    }
};

const deletePrintRequest = async (req, res) => {
    const { print_id } = req.params;    

    try {
        const [result] = await db.query('DELETE FROM prints WHERE print_id = ?', [print_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.status(200).json({ message: 'Request deleted successfully' });
    } catch (error) {
        console.error('Error deleting the request:', error);
        res.status(500).json({ message: 'Error deleting the request' });
    }
};

const declineRequest = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('UPDATE prints SET status = "declined" WHERE print_id = ?', [id]);

        if (result.affectedRows === 0) {
            console.error(`No request found with print_id: ${id}`);
            return res.status(404).json({ message: 'Request not found' });
        }

        res.status(200).json({ message: 'Request declined successfully' });
    } catch (error) {
        console.error('Error during decline:', error);
        res.status(500).json({ message: 'Error declining the request' });
    }
};

const countActivePrintRequests = async (req, res) => {
    const { student_id } = req.query;

    try {
        const [data] = await db.query(
            `SELECT COUNT(*) AS activeRequestsCount 
             FROM prints 
             WHERE student_id = ? 
             AND status IN ('pending', 'approved', 'printed')`,
            [student_id]
        );
        
        res.status(200).json(data[0]);
    } catch (error) {
        console.error('Error counting active print requests:', error);
        res.status(500).json({ error: 'Database error' });
    }
};

const countAllPrintRequests = async (req, res) => {
    try {
        const [data] = await db.query(`
            SELECT 
                SUM(status = 'pending') AS pendingCount,
                SUM(status = 'approved') AS approvedCount,
                SUM(status = 'printed') AS printedCount,
                SUM(status = 'cleared') AS clearedCount
            FROM prints
        `);
        
        res.status(200).json(data[0]);
    } catch (error) {
        console.error('Error counting print requests:', error);
        res.status(500).json({ error: 'Database error' });
    }
};

const countTotalIncome = async (req, res) => {
    try {
        const [rows] = await db.query(`SELECT total_income FROM stats WHERE id = 1`);
        
        if (rows.length > 0) {
            res.status(200).json({ totalIncome: rows[0].total_income });
        } else {
            res.status(404).json({ totalIncome: 0 });
        }
    } catch (error) {
        console.error('Error counting total income:', error);
        res.status(500).json({ error: 'Database error' });
    }
};

const getPrintRequestsByDate = async (req, res) => {
    const { selectedDate } = req.query;  // Expecting the date in YYYY-MM-DD format

    if (!selectedDate) {
        return res.status(400).json({ error: 'Date is required' });
    }

    try {
        const query = `
            SELECT prints.print_id, prints.student_id, prints.file_name, prints.status, prints.price, prints.requested_at, 
                   users.name, users.course, users.phone_number
            FROM prints
            JOIN users ON prints.student_id = users.student_id
            WHERE DATE(prints.requested_at) = ?  -- Use the DATE() function to compare just the date part
            ORDER BY prints.requested_at ASC
        `;

        const [data] = await db.query(query, [selectedDate]);  // Query the database with selected date
        res.status(200).json(data);  // Return the data as JSON
    } catch (err) {
        console.error('Error fetching print requests by date:', err);
        res.status(500).json({ error: 'Database error' });
    }
};

const getTotalRevenueAndIncome = async (req, res) => {
    const { selectedDate } = req.query;
  
    if (!selectedDate) {
      return res.status(400).json({ error: 'Date is required' });
    }
  
    try {
      // Query to get the sum of prices (total revenue) and the count of requests for the selected date
      const query = `
        SELECT 
          SUM(price) AS total_revenue, 
          COUNT(*) AS total_requests
        FROM prints
        WHERE DATE(requested_at) = ?;
      `;
      
      const [results] = await db.query(query, [selectedDate]);
  
      // Check if we have results
      if (results.length === 0 || results[0].total_revenue === null) {
        return res.status(404).json({ error: 'No records found for this date' });
      }
  
      // Send the response back with total revenue and total requests
      res.status(200).json({
        totalRevenue: results[0].total_revenue,
        totalRequests: results[0].total_requests, // Send total requests
      });
    } catch (error) {
      console.error('Error fetching total revenue and requests:', error);
      res.status(500).json({ error: 'Database error' });
    }
  };
    
  const postAnnouncement = async (req, res) => {
    const { content, target_id } = req.body;

    if (!content || content.trim() === '') {
        return res.status(400).json({ success: false, message: 'Content is required' });
    }

    try {
        const query = `
            INSERT INTO posts (content, target_id, posted_at)
            VALUES (?, ?, NOW())
        `;
        const [result] = await db.execute(query, [content, target_id || null]);

        res.status(200).json({
            success: true,
            message: 'Announcement posted successfully!',
            postId: result.insertId,
        });
    } catch (error) {
        console.error('Error posting announcement:', error);
        res.status(500).json({ success: false, message: 'Failed to post announcement' });
    }
};

const getPosts = async (req, res) => {
    const { student_id } = req.query; // Retrieve student_id from query parameters

    try {
        const query = `
            SELECT * FROM posts
            WHERE target_id IS NULL OR target_id = ?
            ORDER BY posted_at DESC
        `;
        const [rows] = await db.execute(query, [student_id]);

        res.status(200).json(rows); // Return filtered posts
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch posts' });
    }
};


    
module.exports = {
    addUserPrintRequest, 
    getPrintRequestsByStudent,
    getPendingRequests,
    approveRequest,
    getApprovedRequests,
    printRequest,
    getPrintedRequests,
    clearPrintRequest,
    getClearedRequests,
    deletePrintRequest,
    declineRequest,
    countActivePrintRequests,
    countAllPrintRequests,
    countTotalIncome,
    getPrintRequestsByDate,
    getTotalRevenueAndIncome,
    postAnnouncement,
    getPosts
};
