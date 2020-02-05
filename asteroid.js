const distanceToMoon = 384400; // average distance from Earth

var asteroid = new Vue({
  el: '#asteroid',
  data: {
    asteroidList: [],
    visList: [],
    message: "Loading NASA asteroid data...",
    drawCanvas: null,
    canvasWidth: 0
  },
  mounted: function() {
    loadData();
    let c = document.getElementById("aCanvas");
    this.canvasWidth = c.scrollWidth;
    c.width = this.canvasWidth;
    c.height = c.scrollHeight;
    let ctx = c.getContext("2d");
    this.drawCanvas = ctx;
  },
  methods: {
    canvasRepaint() {
      let mX = this.canvasWidth - 50;
      let maxDist = 0;
      let minDist = 25;
      let ax = 0;
      // If no asteroid to visualize, moon is at the end
      if (this.visList.length > 0) {
        // Asteroid with max index is furthest away
        let indexMax = Math.max(...this.visList);
        // put it the end point of canvas
        aX = this.canvasWidth - 50;
        maxDist = this.asteroidList[indexMax].distance

        mX = aX * distanceToMoon / maxDist;
      }


      this.drawCanvas.font = "12px Georgia";
      this.drawCanvas.fillStyle = 'gray';
      this.drawCanvas.fillRect(0, 0, this.canvasWidth, 100);


      for (index in this.visList) {
        let xPos = aX * this.asteroidList[this.visList[index]].distance / maxDist
        this.drawCanvas.beginPath();
        this.drawCanvas.arc(xPos, 25, 20, 0, 2 * Math.PI, false);
        this.drawCanvas.fillStyle = 'black';
        this.drawCanvas.fill();
        this.drawCanvas.fillText(this.asteroidList[this.visList[index]].name, xPos-15, 55);
      }

      this.drawCanvas.beginPath();
      this.drawCanvas.arc(minDist, 25, 20, 0, 2 * Math.PI, false);
      this.drawCanvas.fillStyle = 'green';
      this.drawCanvas.fill();
      this.drawCanvas.fillText("Earth", minDist-15, 55);

      this.drawCanvas.beginPath();
      this.drawCanvas.arc(mX, 25, 20, 0, 2 * Math.PI, false);
      this.drawCanvas.fillStyle = 'white';
      this.drawCanvas.fill();
      this.drawCanvas.fillText("Moon", mX-15, 55);

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
    // Visualize closest asteroid by default
    asteroid.toggleVisualization(0);
    // If Earth got hit by asteroid, nobody probably would read this anymore
    asteroid.message = `We missed destruction by mere ${astDist[0].distance.toLocaleString()} kilometers today!`
  } else {
    asteroid.message = 'No asteroids reached their closest-to-earth point today. Or something went wrong.'
  }
}
