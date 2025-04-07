import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { useEffect, useState } from 'react';
import '../App.css';
import NavBar from './NavBar.js'
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function Profile() {
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState([])
  
  const fetchProfileData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/profile', { withCredentials: true});
      setUserData(response.data)

      const calibrationResponse = await axios.get('http://localhost:5000/calibrationData', { withCredentials: true}) 
      console.log(data.data) 
      setData(calibrationResponse.data)

    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
    setIsLoading(false);
  };
  
  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <div className="home">
        <NavBar></NavBar>
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <div>
                      <h1>User Profile</h1>
                      <p>Email: {userData?.user.username}</p>
                      <p>Password Hashed: {userData?.user.password}</p>
                      <p>ID: {userData?.user._id}</p>
                    </div>
                    <div className = "center">
                      <h1 className = "calibrationData">Calibration Data</h1>
                      <TableContainer component={Paper} sx={{textAlign: "centre" }}>
                        <Table sx={{ minWidth: 150 }} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Calibration Point Number</TableCell>
                              <TableCell>Target_X</TableCell>
                              <TableCell>Target_Y</TableCell>
                              <TableCell>F_X</TableCell>
                              <TableCell>F_Y</TableCell>
                              <TableCell>Distance</TableCell>
                              <TableCell>Error Percentage</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {data.map((row) => (
                              <TableRow
                                key={row._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell>{row.calibrate_idx}</TableCell>
                                <TableCell>{row.target_x}</TableCell>
                                <TableCell>{row.target_y}</TableCell>
                                <TableCell>{row.f_x}</TableCell>
                                <TableCell>{row.f_y}</TableCell>
                                <TableCell>{row.distance}</TableCell>
                                <TableCell>{row.error_percentage}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                    </TableContainer>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}

export default Profile;
