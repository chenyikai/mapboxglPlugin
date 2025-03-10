import {
  Mapbox,
  // Point,
  // LineString,
  // Icon,
  // Store,
  // ShipManage,
  AisShip,
  Ship,
  Tooltip
  // Label
} from '../index'
import { aimData, shipData, shipList, allData } from "./shipData";
import { Map, LngLat } from "mapbox-gl";
// @ts-ignore
import '../styles/index.scss'
import Icon from "../lib/core/Icon";
import { BaseShipOptions } from "../lib/types/module/Ship/plugins/BaseShip";

const mapbox = new Mapbox({
  container: "map",
  type: Mapbox.LAND,
  center: [122.09160659512042, 30.004767949301183],
  // center: [0, 0],
  // zoom: 5,
  zoom: 14,
})

let _ctx = null

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
  const dpr: number = window.devicePixelRatio || 1
  const canvas = document.createElement('canvas');
  canvas.id = 'tdstddas';
  canvas.style.position = "absolute";
  canvas.style.top = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = "1000";
  canvas.width = map._canvas.width / dpr;
  canvas.height = map._canvas.height / dpr;
  _ctx = canvas.getContext("2d")!;

  const container = map.getContainer()
  container.style.position = "relative";
  container.appendChild(canvas);


  // @ts-ignore
  window.map = map

  // const icon = new Icon(map)
  // icon.add({
  //   name: 'cat',
  //   url: 'https://docs.mapbox.com/mapbox-gl-js/assets/cat.png'
  // })
  // icon.load([
  //   {
  //     name: 'cat',
  //     url: 'https://docs.mapbox.com/mapbox-gl-js/assets/cat.png'
  //   },
  //   {
  //     name: 'fire',
  //     url: new URL('./fire.png', import.meta.url)['href']
  //   }
  // ])
  //
  // const store1 = Store.getInstance(map);
  // const store2 = Store.getInstance(map);
  // console.log(store1 === store2);

  // const point = new Point(map, {
  //   // coordinates: [122.106863, 30.016028],
  //   type: 'index',
  //   name: 1
  // })

  // new LineString(map, {
  //   type: 'circle',
  //   coordinates: [
  //     [
  //       122.09615562161065,
  //       30.028401432795306
  //     ],
  //     [
  //       122.0922932406288,
  //       30.019818224545006
  //     ],
  //     [
  //       122.08808753689334,
  //       30.011531565390726
  //     ],
  //     [
  //       122.10800025662076,
  //       30.00536257140034
  //     ],
  //     [
  //       122.12465141018447,
  //       30.009896447721985
  //     ],
  //     [
  //       122.12460849484052,
  //       30.02364546114633
  //     ],
  //     [
  //       122.11495254238713,
  //       30.027992725443468
  //     ]
  //   ],
  // })
  //
  // new Point(map, {
  //   type: 'circle',
  //   coordinates: [122.106863, 30.016028],
  // });


  // new Point(map, {
  //   type: 'circle',
  //   coordinates: [122.106863, 30.016028],
  // });

  // new Point(map, {
  //   type: 'circle',
  //   immediate: true,
  // })

  // new Point(map, {
  //   type: 'index',
  //   name: 1,
  //   coordinates: [2, 2],
  // })

  // new Point(map, {
  //   type: "icon",
  //   coordinates: [122.106863, 30.016028],
  //   iconStyle: {
  //     icon: 'fire',
  //     anchor: 'center',
  //     iconSize: 0.7,
  //     iconRotate: 90
  //   }
  // })



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

  // 这俩个可以切换 一个加载一艘船 一个加载所有 ==

  new Icon(map).add({
    name: 'ais',
    url: new URL('lib/module/Ship/plugins/images/AisShip/ship.png', import.meta.url).href
  })

  // const ship = addShip(map, aimData)


  const ship = new Ship(map, {
    plugins: [AisShip]
  })
  const list: Array<BaseShipOptions> = [aimData].map(item => {
    const [lat, lon] = item.location.split(',')

    return {
      dir: item.hdg || 0,
      height: item.length,
      id: item.mmsi,
      name: item.cnname || item.enname || item.mmsi,
      position: new LngLat(Number(lon), Number(lat)),
      speed: item.sog,
      hdg: item.hdg || 0,
      cog: item.cog,
      rot: item.rot,
      statusId: item.statusId,
      status: item.status,
      time: item.updateTime,
      type: AisShip.NAME,
      width: item.width,
      top: item.toBow,
      bottom: item.toStern,
      right: item.toStarboard,
      left: item.toPort,
      icon: "ais"
    }
  })

  ship.load(list)
  // ship.load(list).forEach(item => {
  //   const box = item.tooltip?.getBbox()
  //   if (box) {
  //     miaobian(box)
  //   }
  // })

  // for(const id in ship._collision.result) {
  //   const item = ship._collision.result[id];
  //   if (!item.visible) {
  //     miaobian(item.bbox)
  //   }
  // }
})


function addShip(map: Map, item: any) {
  const [lat, lon] = item.location.split(',')

  return new AisShip(map, {
    dir: item.hdg,
    height: item.length,
    id: item.mmsi,
    name: item.cnname || item.enname || item.mmsi,
    position: new LngLat(Number(lon), Number(lat)),
    speed: item.sog,
    hdg: item.hdg,
    cog: item.cog,
    rot: item.rot,
    statusId: item.statusId,
    status: item.status,
    time: item.updateTime,
    type: item.typeId,
    width: item.width,
    top: item.toBow,
    bottom: item.toStern,
    right: item.toStarboard,
    left: item.toPort,
    immediate: true,
    tooltip: true,
    icon: "ais"
  })
}

function addShips(map: Map): Array<AisShip> {
  return allData.map(item => addShip(map, item))
}

function changeAnchor(map) {

  let index = 0
  const dirs = [
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
    'center',
    'top',
    'bottom',
    'left',
    'right',
  ]
  const aisShip = addShip(map, aimData)
  map.on('click', () => {
    const dir = dirs[index]
    aisShip.tooltip.setAnchor(dir)
    aisShip.render()
    index++;
  })
}

function miaobian(bbox) {
  drawLine(_ctx, bbox)
}

function drawLine(ctx, bbox) {
  const paths = [
    {
      x: bbox.minX,
      y: bbox.minY,
    },
    {
      x: bbox.maxX,
      y: bbox.minY
    },
    {
      x: bbox.maxX,
      y: bbox.maxY
    },
    {
      x: bbox.minX,
      y: bbox.maxY
    },
    {
      x: bbox.minX,
      y: bbox.minY,
    },
  ]

  ctx.beginPath()
  paths.forEach((path, index) => {
    if (index === 0) {
      ctx.moveTo(path.x, path.y)
    } else {
      ctx.lineTo(path.x, path.y)
    }
  })

  ctx.lineWidth = 2
  ctx.strokeStyle = '#f00'
  ctx.stroke()
}
