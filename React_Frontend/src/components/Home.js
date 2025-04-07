import { useEffect, useState } from 'react';
import '../App.css';
import NavBar from './NavBar.js'
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import PreviewIcon from '@mui/icons-material/Preview';
import Stack from '@mui/material/Stack';

function App() {
  var userData;
  const location = useLocation();
  const userProfile = location.state;

  const [trackerOn, setTrackerOn] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // Step 1: State variable for verification

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Make a request to the /profile endpoint
        const response = await axios.get('http://localhost:5000/profile', { withCredentials: true });

        // Set the user data in the state
        userData = response.data;

        // Check if user is verified
        setIsVerified(response.data.isVerified); // Assuming there's a field isVerified in response data
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  const handleButtonClick = async () => {
    if (!isVerified) {
      alert("You are not verified. Please verify yourself before starting the tracker.");
      return;
    }

    if (!trackerOn) {
      setTrackerOn(true);
      axios.get('http://127.0.0.1:8000/start')
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.error('Error starting tracker:', error);
        });
    } else {
      setTrackerOn(false);
      axios.get('http://127.0.0.1:8000/stop')
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.error('Error stopping tracker:', error);
        });
    }
  }

  const handleVerificationCheck = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/start_faceVerification');
      console.log(response);
      
      if (response.status === 200) {
        setIsVerified(true); // Update isVerified state if response status is 200
      } else {
        setIsVerified(false); // Update isVerified state if response status is not 200
      }
    } catch (error) {
      console.error('Error fetching verification data:', error);
      setIsVerified(false); // Update isVerified state if an error occurs
    }
  };

  return (
    <div className="home">
      <NavBar />
      <p className="text">Eye Tracker</p>
      <Stack direction="row" spacing={2}>
        <Button onClick={handleButtonClick} variant="outlined" size="small" startIcon={<PreviewIcon />}>
          {!trackerOn ? "Start Tracker" : "Stop Tracker"}
        </Button>
        {/* New button for verification check */}
        <Button onClick={handleVerificationCheck} variant="outlined" size="small">
          {isVerified ? "Verified" : "Check Verification"}
        </Button>
      </Stack>
    </div>
  );
}

export default App;
