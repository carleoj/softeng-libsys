const db = require('../config/db')

const fetchAllRows = async (req, res) => {

    try{
        const [rows] = await db.query(`
                SELECT * FROM users
            `)
        
        res.status(200).json(rows)
    }catch(err){
        console.log("Database error: ",err)
        res.status(500).json(err)
    }
}

module.exports = {fetchAllRows};