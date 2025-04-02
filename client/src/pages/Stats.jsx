import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './styles/Stats.css';

const Stats = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [printRequests, setPrintRequests] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);

  const fetchPrintRequests = async (date) => {
    if (!date) return;

    try {
      const response = await fetch(`http://localhost:8081/api/prints-by-date?selectedDate=${date}`);
      if (response.ok) {
        const data = await response.json();
        setPrintRequests(data);
      } else {
        console.error('Failed to fetch data');
        setPrintRequests([]);
      }
    } catch (error) {
      console.error('Error fetching print requests by date:', error);
      setPrintRequests([]);
    }
  };

  const fetchTotalRevenueAndIncome = async (date) => {
    if (!date) return;

    try {
      const response = await fetch(`http://localhost:8081/api/revenue-income-by-date?selectedDate=${date}`);
      if (response.ok) {
        const data = await response.json();
        setTotalRevenue(data.totalRevenue);
        setTotalRequests(data.totalRequests);
      } else {
        console.error('Failed to fetch revenue and requests');
        setTotalRevenue(0);
        setTotalRequests(0);
      }
    } catch (error) {
      console.error('Error fetching total revenue and requests:', error);
      setTotalRevenue(0);
      setTotalRequests(0);
    }
  };

  const handleDateChange = (event) => {
    const rawDate = event.target.value;
    setSelectedDate(rawDate);
    fetchPrintRequests(rawDate);
    fetchTotalRevenueAndIncome(rawDate);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
  
    // Title
    doc.setFontSize(16);
    const title = "SPAC Library Printing Services System";
    
    const pageWidth = doc.internal.pageSize.getWidth(); // Get page width
    const titleWidth = doc.getTextWidth(title); // Calculate title width
    const titleX = (pageWidth - titleWidth) / 2; // Calculate x-coordinate for centering
    doc.text(title, titleX, 10); // Add centered title at y = 10

    // Add subtitle (Daily Sales Report) centered below the title
    const subtitle = "Daily Sales Report";
    const subtitleWidth = doc.getTextWidth(subtitle); // Calculate subtitle width
    const subtitleX = (pageWidth - subtitleWidth) / 2; // Calculate x-coordinate for centering
    doc.setFontSize(14); // Slightly smaller font for the subtitle
    doc.text(subtitle, subtitleX, 20); // Add centered subtitle at y = 20

    // Add selected date two spaces below the subtitle
    if (selectedDate) {
      doc.setFontSize(12); // Set smaller font for details
      doc.text(`Date: ${selectedDate}`, 14, 30); // Add date left-aligned at y = 30
    }

    // Add total revenue and transactions below the date
    doc.text(`Total Revenue: ${totalRevenue} pesos`, 14, 40); // Left-aligned at y = 40
    doc.text(`Total Transactions: ${totalRequests}`, 14, 50);

  
    // Add table
    const tableTopMargin = 3; // Add an extra 20 units of space above the table
    const tableStartY = 60 + tableTopMargin;
    const tableColumn = ['Student ID', 'Name', 'Course', 'Status', 'Price'];
    const tableRows = [];
  
    printRequests.forEach((request) => {
      const requestData = [
        request.student_id,
        request.name,
        request.course,
        request.status,
        request.price,
      ];
      tableRows.push(requestData);
    });
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: tableStartY, // Start table with margin included
      headStyles: {
        fillColor: [76, 175, 80], // Set the header background color to green (RGB)
        textColor: [255, 255, 255], // Set the header text color to white
        fontSize: 10, // Adjust font size for the header
      },
    });
  
    // Save the PDF
    doc.save(`spac-lib-daily-sales_${selectedDate || 'report'}.pdf`);
  };
  

  useEffect(() => {
    if (selectedDate) {
      fetchPrintRequests(selectedDate);
      fetchTotalRevenueAndIncome(selectedDate);
    }
  }, [selectedDate]);

  return (
    <div className="stats">
      <h2>DATA OVERVIEW</h2>
      <div className="stats-container">
        <div className="dropdown-container">
          <label htmlFor="date-picker">Search by Date: </label>
          <input
            type="date"
            id="date-picker"
            value={selectedDate}
            onChange={handleDateChange}
          />
          <button className="download-pdf" onClick={downloadPDF}>
            Export to PDF
          </button>

        </div>
        <div className="stats-table">
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Course</th>
                <th>Status</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {printRequests.length === 0 ? (
                <tr>
                  <td colSpan="5">No records found for this date.</td>
                </tr>
              ) : (
                printRequests.map((request) => (
                  <tr key={request.print_id}>
                    <td>{request.student_id}</td>
                    <td>{request.name}</td>
                    <td>{request.course}</td>
                    <td>{request.status}</td>
                    <td>{request.price}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="stats-footer">
          <div className="footer-left">
            Total Daily Revenue: <span>&#8369;{totalRevenue}</span>
          </div>
          <div className="footer-right">
            Total # of Transactions: <span>{totalRequests}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
