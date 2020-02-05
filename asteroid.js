const distanceToMoon = 384400; // average distance from Earth

var asteroid = new Vue({
  el: '#asteroid',
  data: {
    asteroidList: [],
    visList: [],
    message: "Loading NASA asteroid data...",
    toMoon: 0,
    drawCanvas: null,
    canvasWidth: 0
  },
  mounted: function() {
    loadData();
    let c = document.getElementById("aCanvas");
    this.canvasWidth = c.width;
    let ctx = c.getContext("2d");
    this.drawCanvas = ctx;
  },
  methods: {
    canvasRepaint() {
      // Asteroid should always be more far away, so put it at the very end of canvas
      let aX = this.canvasWidth - 50;

      let mX = aX * this.toMoon;

      this.drawCanvas.font = "12px Georgia";

      this.drawCanvas.fillStyle = 'gray';
      this.drawCanvas.fillRect(0, 0, this.canvasWidth, 100);

      this.drawCanvas.beginPath();
      this.drawCanvas.arc(25, 25, 20, 0, 2 * Math.PI, false);
      this.drawCanvas.fillStyle = 'green';
      this.drawCanvas.fill();
      this.drawCanvas.fillText("Earth", 10, 55);

      this.drawCanvas.beginPath();
      this.drawCanvas.arc(mX, 25, 20, 0, 2 * Math.PI, false);
      this.drawCanvas.fillStyle = 'white';
      this.drawCanvas.fill();
      this.drawCanvas.fillText("Moon", mX-15, 55);

      this.drawCanvas.beginPath();
      this.drawCanvas.arc(aX, 25, 20, 0, 2 * Math.PI, false);
      this.drawCanvas.fillStyle = 'black';
      this.drawCanvas.fill();
      this.drawCanvas.fillText("Asteroid", aX-20, 55);
    },
    // Toggle visualization of asteroid[index]'s distance
    toggleVisualization(index) {
      let i = this.visList.indexOf(index);
      if (i == -1) {
        this.visList.push(index);
      }
      else {
        this.visList.splice(i, 1);
      }
    }
  },
  watch: {
    toMoon: function() {
      this.canvasRepaint();
    }
  }
})

function loadData() {
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
  let asteroids = data.near_earth_objects[date];
  let astDist = [];

  for (a in asteroids) {
    astDist.push({name:asteroids[a].name, distance:Math.round(asteroids[a].close_approach_data[0].miss_distance.kilometers), link:asteroids[a].nasa_jpl_url});
  }

  astDist.sort((n1,n2) => n1.distance - n2.distance);

  asteroid.asteroidList = astDist;
  if (astDist.length > 0) {
    // distances for visualization
    asteroid.toMoon = distanceToMoon / astDist[0].distance;
    asteroid.canvasRepaint();
    // If Earth got hit by asteroid, nobody probably would read this anymore
    asteroid.message = `We missed destruction by mere ${astDist[0].distance.toLocaleString()} kilometers today!`
  } else {
    asteroid.message = 'No asteroids reached their closest-to-earth point today. Or something went wrong.'
  }
}
