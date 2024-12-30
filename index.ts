import Plugin from "lib";
import Mapbox from 'lib/module/Map'
import Layer from 'lib/module/Layer/index'

import ShipManage from 'lib/module/ShipManage/index'
import Ship from './lib/module/ShipManage/shipTypes/ship'
import NormalShip from './lib/module/ShipManage/shipTypes/normalShip'

import Collision from "lib/core/Collision";
import Item from 'lib/core/Collision/item'
import Icon from 'lib/core/Icon'
import Label from './lib/core/Label'
import LabelItem from './lib/core/Label/Item'

const version = '0.0.1'
export {
  version,
  Plugin,
  Mapbox,
  Layer,
  ShipManage,
  Ship,
  NormalShip,
  Collision,
  Item as CollisionItem,
  Icon,
  Label,
  LabelItem
}
