import {
  Mapbox,
  Point,
  LineString,
  Icon,
  Store
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
  // center: [0, 0],
  // zoom: 5,
  zoom: 14,
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
  icon.load([
    {
      name: 'cat',
      url: 'https://docs.mapbox.com/mapbox-gl-js/assets/cat.png'
    },
    {
      name: 'fire',
      url: new URL('./fire.png', import.meta.url)['href']
    }
  ])

  const store1 = Store.getInstance(map);
  const store2 = Store.getInstance(map);
  // console.log(store1 === store2);

  // const point = new Point(map, {
  //   // coordinates: [122.106863, 30.016028],
  //   type: 'index',
  //   name: 1
  // })

  const circlePoint = new Point(map, {
    type: 'circle',
    coordinates: [122.106863, 30.016028],
  });


  // new Point(map, {
  //   type: 'index',
  //   name: 1,
  //   coordinates: [2, 2],
  // })

  new Point(map, {
    type: "icon",
    coordinates: [122.106863, 30.016028],
    iconStyle: {
      icon: 'fire',
      anchor: 'center',
      iconSize: 0.7
    }
  })



  // new Point(map, {
  //   type: "icon",
  //   coordinates: [122.106863, 30.016028],
  //   iconStyle: {
  //     icon: 'fire',
  //     anchor: 'center'
  //   }
  // })

  // @ts-ignore
  // const line = new LineString(map, {
  //   coordinates: [[0, 0], [1, 1], [2, 2]]
  // })

  // new LineString(map, {
  //   coordinates: [[2, 1], [0, 1], [0, 2]]
  // })

  // point.start()

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
