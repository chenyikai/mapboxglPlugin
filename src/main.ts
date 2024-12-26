import { Mapbox, Layer } from '../index'

const mapbox = new Mapbox({
  container: "map",
  type: Mapbox.LAND,
  center: [122.106863, 30.016028],
  zoom: 13,
})

mapbox.on('loaded', () => {
  const layer = new Layer(mapbox.getMap(), {
    icons: [{
      name: 'ceshi',
      url: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Black_and_White_Boxed_%28bordered%29.png'
    }]
  })
  console.log(layer,Layer.SOURCE, 'layer');
})
