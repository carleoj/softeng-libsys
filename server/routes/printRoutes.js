const express = require('express');
const router = express.Router();

const { 
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
 } = require('../controllers/printController');


router.post('/upload', addUserPrintRequest);

router.get('/prints', getPrintRequestsByStudent);

router.get('/pending-requests', getPendingRequests);

router.put('/approveRequest/:id', approveRequest);

router.get('/approved-requests', getApprovedRequests); 

router.put('/print-request/:id', printRequest);

router.get('/printed-requests', getPrintedRequests);

router.put('/printed-requests/:print_id/clear', clearPrintRequest);

router.get('/cleared', getClearedRequests);

router.delete('/cleared/:print_id', deletePrintRequest);

router.put('/declineRequest/:id', declineRequest);

router.get('/active-requests/count', countActivePrintRequests);

router.get('/requests/count', countAllPrintRequests);

router.get('/get-total-income', countTotalIncome)

router.get('/prints-by-date', getPrintRequestsByDate);

router.get('/revenue-income-by-date', getTotalRevenueAndIncome);

router.post('/post-announcement', postAnnouncement);

router.get('/posts', getPosts);

module.exports = router;
