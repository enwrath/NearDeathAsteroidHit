function init() {
  // Might not give right day if timezones and stuff, but whatever
  const date = new Date().toISOString().slice(0,10);
  // Supersecret apikey, pls no steal ;______;
  const apikey = '0nvq8nAqwKq9EtUBqyS7lL5dHv3A3O2YKhIaS86V'

  url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${apikey}`

  fetch(url)
  .then((response) => {
    return response.json();
  })
  .then((jsonData) => {
    displayData(jsonData, date);
  });

}

function displayData(data, date) {
  const listElement = document.getElementById("asteroidList");
  let asteroids = data.near_earth_objects[date];

  for (a in asteroids) {
    let node = document.createElement("LI");
    let textnode = document.createTextNode(`${asteroids[a].name} is potentially hazardous: ${asteroids[a].is_potentially_hazardous_asteroid}`);
    node.appendChild(textnode);
    listElement.appendChild(node);
  }

}
