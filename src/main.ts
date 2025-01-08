import {
  Mapbox,
  Point,
  Icon
  // ShipManage,
  // NormalShip,
  // Label
} from '../index'
// import { shipData } from 'lib/module/ShipManage/data'
// import { LngLat } from "mapbox-gl";

const mapbox = new Mapbox({
  container: "map",
  type: Mapbox.LAND,
  center: [122.106863, 30.016028],
  zoom: 13,
})

// let label = null

// function addLabel() {
//   // const labelItem = label!.add({
//   //   info: '定港机3013',
//   //   position: new LngLat(122.102920, 30.008070)
//   // })
//   //
//   // setTimeout(() => {
//   //   labelItem.setDir(LabelItem.TOP_LEFT)
//   // }, 1000)
//   //
//   // setTimeout(() => {
//   //   labelItem.setDir(LabelItem.BOTTOM_RIGHT)
//   // }, 2000)
//   //
//   // setTimeout(() => {
//   //   labelItem.setDir(LabelItem.TOP_RIGHT)
//   // }, 3000)
//   const item = label!.load(shipData.map(item => {
//     const [ lat, lon ] = item.location.split(',')
//     return {
//       info: item.cnname || item.enname || item.mmsi,
//       position: new LngLat(Number(lon), Number(lat)),
//     }
//   }))
//
//   console.log(item.map(ele => ele.bbox));
// }


mapbox.on('loaded', (map) => {

  // @ts-ignore
  window.map = map

  const icon = new Icon(map)
  icon.add({
    name: 'cat',
    url: 'https://docs.mapbox.com/mapbox-gl-js/assets/cat.png'
  })

  const point = new Point(map, {
    // coordinates: [122.106863, 30.016028],
    type: 'index',
    name: 1
  })

  point.start()

  // const shipManage = new ShipManage(map, {
  //   plugins: [NormalShip]
  // })
  //
  // label = new Label({
  //   map,
  //   id: 'shipLabelBoard',
  // })
  //
  // addLabel()
})
