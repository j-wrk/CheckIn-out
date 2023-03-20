function initMap() {}
// Define the location of the classroom
const classroomLat = 14.04088542936714;
const classroomLong = 100.61057761895061;
const classroomRadius = 50; // meters

// Define variables to track check-in/out status and timestamps
let checkedIn = false;
let checkedInTime = null;
let checkedOutTime = null;

// Function to calculate the distance between two GPS coordinates in meters
function calDistance(lat1, long1, lat2, long2) {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180; // Convert to radians
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((long2 - long1) * Math.PI) / 180;
    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) *
        Math.cos(phi2) *
        Math.sin(deltaLambda / 2) *
        Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    console.log("distance: "+d+" meters")
    return d;
}

function isWithinRadius(lat, long) {
    const distance = calDistance(lat, long, classroomLat, classroomLong);
    return distance <= classroomRadius;
  }

// Function to get the user's GPS location and call the appropriate check-in/out function
function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log("User lat,lon: "+lat,lon);
        console.log("Classroom lat,lon: "+classroomLat,classroomLong)
        const d = calDistance(lat, lon, classroomLat, classroomLong);
        if (d <= classroomRadius) {
          if (!checkedIn) {
            checkedIn = true;
            checkedInTime = new Date();
            const message = `Check in at ${checkedInTime.toLocaleTimeString()}!`;
            console.log(message);
            document.getElementById('output').textContent = message;
          } else {
            checkedIn = false;
            checkedOutTime = new Date();
            const message = `Check out at ${checkedOutTime.toLocaleTimeString()}!`;
            const elapsedTime = checkedOutTime.getTime() - checkedInTime.getTime();
            const messageElapsedTime = `Elapsed time: ${elapsedTime /1000} seconds`;
            console.log(messageElapsedTime);
            document.getElementById('inClassTime').textContent = messageElapsedTime;
            console.log(message); 
            document.getElementById('output').textContent = message;
          }
        } else {
          const message = 'You are not within the radius of the classroom!';
          console.log(position) 
          document.getElementById('output').textContent = message;
        }
      });
    } else {
      console.log('Error: Geolocation is not supported by this browser.');
      document.getElementById('output').textContent = 'Error: Geolocation is not supported by this browser.';
    }
  }


