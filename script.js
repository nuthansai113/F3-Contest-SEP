const btn = document.getElementById('btn');

btn.addEventListener('click',() => {
    document.getElementById("main").style.display = 'none'
    document.getElementById('head').style.display = 'block'
    const scrolled = document.getElementById('scroll')
    if(scrolled.id === 'scroll'){
      scrolled.id = 'notScrolled'
    }
    fetch('https://api.ipify.org/?format=json').then((resp) => {
        return resp.json();
    }).then((data) => {
        let ipAddress = data.ip

        // fetching geoLocation

        fetch(` https://ipinfo.io/${ipAddress}?token=3353d861eb7cd5`).then((resp) => {
            return resp.json();
        }).then((data) => {
            console.log(data)
            const ip = data.ip;
            const lat = data.loc.split(',')[0];
            const long = data.loc.split(',')[1];
            const timezone = data.timezone;
            const pincode = data.postal;

            showIpDetails(ip,lat,long,data);
            showTimezone(timezone, pincode);
            getPostOffices(pincode);
        }).catch((err) => {
            console.log(err)
        })
    }).catch((err) => {
        console.log(err)
    })
}).catch((err) => {
    console.log(err)
})

function showIpDetails(ip,lat, long, data){
    // displaying IP address
 const add = document.getElementById('add');
 add.textContent = ` ${ip}`;
 add.style.textDecoration = "underline"

 // displaying user details
 const ipDetails = document.getElementById('ipDetails');
 ipDetails.innerHTML = `<div><span id="lat">Lat: ${lat}</span></div>
 <div><span id="city">City: ${data.city}</span></div>
 <div><span id="org">Organisation: Undefined</span></div>
 <div><span id="long">Long: ${long}</span></div>
 <div><span id="reg">Region: ${data.region}</span></div>
 <div><span id="host">Hostname: ${data.timezone}</span></div>`

 // displaying the location of user on map
 const map = document.getElementById('map')
  map.innerHTML = ` <h1>Your Location</h1><iframe src="https://maps.google.com/maps?q= ${lat}, ${long}&z=15&output=embed" width="100%" height="100%" frameborder="5" style="border:1"></iframe>`
  map.style.display = "Block"
}

// displaying time zone
 function showTimezone(timeZone, pincode){
    var pinCount = 0;
    fetch(` https://api.postalpincode.in/pincode/${pincode}`).then((resp) => {
        return resp.json();
    }).then((data) => {
        pinCount = data[0].PostOffice.length
        
    
    let currentTime = new Date().toLocaleString("en-US", {
        timeZone: timeZone,
      });

    const timZone = document.getElementById('timeZone')
    timZone.innerHTML =`<h1>More Information About You</h1><div><span id="time">Time Zone: ${timeZone}</span></div>
    <div><span id="date">Date and Time: ${currentTime}</span></div>
    <div><span id="pin">Pincode: ${pincode}</span></div>
    <div><span id="pincount">Message: Number of pincode(s) found:  ${pinCount}</span></div>`

   });
 }

 // displaying the postOffice of the user areas

 function getPostOffices(pincode) {
    fetch(`https://api.postalpincode.in/pincode/${pincode}`)
      .then((response) => response.json())
      .then((data) => {
        const postOffices = data[0].PostOffice;
        //   console.log(postOffices);
  
        const postOfficeList = document.getElementById("postOfficeList");
        postOffices.forEach((postOffice) => {
          postOfficeList.innerHTML += `
          <ul>
              <li>Name: ${postOffice.Name}</li>
              <li>Branch Type: ${postOffice.BranchType}</li>
              <li>Delivery Status: ${postOffice.DeliveryStatus}</li>
              <li>District: ${postOffice.District}</li>
              <li>Division: ${postOffice.Division}</li>
          </ul>
          `;
        });
  
        const searchBar = document.getElementById("searchBoxed");
        searchBar.innerHTML += `
              <h1>Post Office Near You</h1>
              <input
              type="text"
              id="searchBox"
              placeholder="Filter"
              oninput="filterPostOffices()"
              />
          `;
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }

  function filterPostOffices() {
    const searchBox = document.getElementById("searchBox");
  
    const filter = searchBox.value.toUpperCase();
    // console.log(filter)
    const postOfficeList = document.getElementById("postOfficeList");
  
    // const listItems = postOfficeList.getElementsByTagName("li");
    const listItems = postOfficeList.getElementsByTagName("ul");
  
    for (let i = 0; i < listItems.length; i++) {
      const listItem = listItems[i];
      console.log(listItem);
      const text = listItem.textContent || listItem.innerText;
      if (text.toUpperCase().indexOf(filter) > -1) {
        listItem.style.display = "";
      } else {
        listItem.style.display = "none";
      }
    }
  }