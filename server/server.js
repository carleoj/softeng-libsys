const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const app = express();
const testRoutes = require('./routes/testRoutes')
const userRoutes = require('./routes/userRoutes'); 
const printRoutes = require('./routes/printRoutes'); 

app.use(cors());
app.use(express.json());

app.use('/api', userRoutes); 
app.use('/api', printRoutes);
app.use('/api', testRoutes)

const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
