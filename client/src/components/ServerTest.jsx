import React, { useState, useEffect } from 'react'

const ServerTest = () => {
    const [data, setData] = useState([])

  useEffect(() => {
    fetch('http://localhost:8081/api/users')
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.log(err))
  }, [])

  return (
    <div>
        <table>
              <thead>
                <tr>
                    <th>Name</th>
                    <th>Course</th>
                    <th>Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d,i) => (
                  <tr key={i}>
                    <td>{d.name}</td>
                    <td>{d.course}</td>
                    <td>{d.phone_number}</td>
                  </tr>
                ))}
              </tbody>
        </table>
    </div>
  )
}

export default ServerTest