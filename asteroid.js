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
      let maxDist = 0;
      let minDist = this.canvas.height / 3;
      let radius = this.canvas.height / 4;
      let mX = 4 * minDist;
      let ax = 0;
      // If no asteroid to visualize, moon is at the end
      if (this.visList.length > 0) {
        // Asteroid with max index is furthest away
        let indexMax = Math.max(...this.visList);
        maxDist = this.asteroidList[indexMax].distance

        // We need this many pixels to fit everything in:
        let canvasW = mX * maxDist / distanceToMoon
        // And a bit more so names fit for sure in canvas
        canvasW += 100
        this.canvas.width = canvasW;
        this.canvas.scrollWidth = canvasW;
      }


      this.ctx.font = (minDist / 2).toString() + "px Georgia";
      this.ctx.clearRect(0, 0, this.canvas.width, 100);


      for (index in this.visList) {
        let xPos = minDist + mX * this.asteroidList[this.visList[index]].distance / distanceToMoon
        this.ctx.beginPath();
        this.ctx.arc(xPos, minDist, radius, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = '#947676';
        this.ctx.fill();
        this.ctx.fillText(this.asteroidList[this.visList[index]].name, xPos-radius, 3*radius);
      }

      this.ctx.beginPath();
      this.ctx.arc(minDist, minDist, radius, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = '#6f8e79';
      this.ctx.fill();
      this.ctx.fillText("Earth", minDist-radius, 3*radius);

      this.ctx.beginPath();
      this.ctx.arc(mX, minDist, radius, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = '#c5c7b3';
      this.ctx.fill();
      this.ctx.fillText("Moon", mX-radius, 3*radius);

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
  const url = 'https://ssd-api.jpl.nasa.gov/cad.api?dist-max=10LD&date-min=now&sort=dist'
  fetch(url)
  .then((response) => {
    return response.json();
  })
  .then((jsonData) => {
    displayData(jsonData);
  });

}
function displayData(data) {
  // ToDo: Check that api version is same
  if (data.count <= 0) {
    asteroid.message = "No asteroids are coming close to Earth in the next 60 days. Or something went wrong fetching data."
    return
  }
  let astDist = [];

  for (a in data.data) {
    astDist.push({name: data.data[a][0],
      distance: Math.round(data.data[a][4] * 149597871),
      speed: parseFloat(data.data[a][7]).toFixed(2),
      date: new Date(data.data[a][3]).toISOString().slice(0,10)
    });
  }

  asteroid.asteroidList = astDist;
  // Visualize all asteroids by default
  for (let i = 0; i < astDist.length; i++) {
    asteroid.toggleVisualization(i);
  }
  // If Earth got hit by asteroid, nobody probably would read this anymore
  asteroid.message = `We missed destruction by mere ${astDist[0].distance.toLocaleString()} kilometers today!`
}
