function init() {
  // Might not give right day if timezones and stuff, but whatever
  const date = new Date().toISOString().slice(0,10);
  // Supersecret apikey, pls no steal ;______;
  const apikey = '0nvq8nAqwKq9EtUBqyS7lL5dHv3A3O2YKhIaS86V'

  url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${apikey}`
  document.getElementById("deathMiss").textContent = 'Loading NASA data...'
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
  const pElement = document.getElementById("deathMiss");
  let asteroids = data.near_earth_objects[date];
  let astDist = [];

  for (a in asteroids) {
    astDist.push({name:asteroids[a].name, distance:Math.round(asteroids[a].close_approach_data[0].miss_distance.kilometers), link:asteroids[a].nasa_jpl_url});
  }

  astDist.sort((n1,n2) => n1.distance - n2.distance);

  for (a in astDist) {
    // Create list of type
    // [url](name) is x km away
    let node = document.createElement("LI");
    let span = document.createElement('span')
    let link = document.createElement('a');
    let linktext = document.createTextNode(`${astDist[a].name}`);
    let textnode = document.createTextNode(` is only ${astDist[a].distance.toLocaleString()} km from colliding with Earth!`);
    link.appendChild(linktext);
    link.title = astDist[a].name;
    link.href = astDist[a].link;
    span.appendChild(link);
    span.appendChild(textnode);
    node.appendChild(span);
    listElement.appendChild(node);
  }

  if (astDist.length > 0) {
    // If Earth got hit by asteroid, nobody probably would read this anymore
    pElement.textContent = `We missed destruction by mere ${astDist[0].distance.toLocaleString()} kilometers today!`
  } else {
    pElement.textContent = 'No asteroids reached their closest-to-earth point today. Or something went wrong.'
  }
}
