# SPAC Library Printing Services System
## Project Description
*Note: SPAC stands for South Philippine Adventist College*

### The Problem

*SPAC stands for South Philippine Adventist College.*

Before the system was developed, students had to submit printing requests manually through the library. This process could result in inefficient communication, difficulty tracking request statuses, and additional workload for library staff who needed to manage requests manually.

### The Solution

To address these challenges, I developed the SPAC Library Printing Services System, a full-stack web application that digitizes the printing request workflow.

Students can submit print requests online and monitor their request status, while library staff and administrators can review submissions, approve requests, assign printing costs, and manage the entire printing process through an administrative dashboard.

### Key Features

* Online print request submission
* Request status tracking
* Admin approval workflow
* Print cost management
* User and request management
* Dashboard for library staff

## Setup

### Prerequisites

* Node.js
* npm
* MySQL

### Installation

1. Clone the repository.

```bash
git clone <repository-url>
```

2. Install dependencies for the client and server.

```bash
cd client
npm install

cd ../server
npm install
```

3. Configure the environment variables.

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=library_printing_system
```

4. Start the development servers.

```bash
# Server
npm run dev

# Client
npm run dev
```

5. Open the application in your browser.

```text
http://localhost:5173
```
