import { Mapbox } from '../index'

const mapbox = new Mapbox({
  container: "map",
  type: Mapbox.LAND,
  center: [122.106863, 30.016028],
  zoom: 13,
  accessToken: 'pk.eyJ1IjoiY2hlbnlpa2FpIiwiYSI6ImNrbTZiOTB1dzBtczMydnFzM2V5ZnR0YmcifQ.BPfABgNBi7FIcJBH3BeTwg'
})

console.log(mapbox, 'mapbox');
