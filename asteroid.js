const distanceToMoon = 384400; // average distance from Earth

var asteroid = new Vue({
  el: '#asteroid',
  data: {
    asteroidList: [],
    visList: [],
    message: "Loading NASA asteroid data...",
    canvas: null,
    ctx: null,
  },
  mounted: function() {
    loadData();
    let c = document.getElementById("aCanvas");
    c.width = c.scrollWidth;
    c.height = c.scrollHeight;
    let ctx = c.getContext("2d");
    this.ctx = ctx;
    this.canvas = c;
  },
  methods: {
    canvasRepaint() {
      let mX = 125;
      let maxDist = 0;
      let minDist = 25;
      let ax = 0;
      // If no asteroid to visualize, moon is at the end
      if (this.visList.length > 0) {
        // Asteroid with max index is furthest away
        let indexMax = Math.max(...this.visList);
        maxDist = this.asteroidList[indexMax].distance

        // We need this many pixels to fit everything in:
        // Moon is 25px from earth, asteroid distance based on that
        let canvasW = 100 * maxDist / distanceToMoon
        // And another 50 pixels for padding, so names fit in canvas
        canvasW += 100
        this.canvas.width = canvasW;
        this.canvas.scrollWidth = canvasW;
      }


      this.ctx.font = "12px Georgia";
      this.ctx.clearRect(0, 0, this.canvas.width, 100);


      for (index in this.visList) {
        let xPos = 25 + 100 * this.asteroidList[this.visList[index]].distance / distanceToMoon
        this.ctx.beginPath();
        this.ctx.arc(xPos, 25, 20, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = '#947676';
        this.ctx.fill();
        this.ctx.fillText(this.asteroidList[this.visList[index]].name, xPos-15, 55);
      }

      this.ctx.beginPath();
      this.ctx.arc(minDist, 25, 20, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = '#6f8e79';
      this.ctx.fill();
      this.ctx.fillText("Earth", minDist-15, 55);

      this.ctx.beginPath();
      this.ctx.arc(mX, 25, 20, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = '#c5c7b3';
      this.ctx.fill();
      this.ctx.fillText("Moon", mX-15, 55);

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
