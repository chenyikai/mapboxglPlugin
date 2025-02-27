import Plugin from "lib";
import Mapbox from 'lib/module/Map'
import Layer from 'lib/module/Layer/index'

import ShipManage from 'lib/module/ShipManage/index'
import BaseShip from './lib/module/Ship/plugins/BaseShip'
import AisShip from './lib/module/Ship/plugins/AisShip'

import Collision from "lib/core/Collision";
import CollisionItem from './lib/core/Collision/CollisionItem'
import Icon from 'lib/core/Icon'
import Label from './lib/core/Label'
import LabelItem from './lib/core/Label/LabelItem'

import Point from "./lib/module/Draw/module/Point";
import LineString from "./lib/module/Draw/module/LineString";

import Store from './lib/store'

import * as Utils from './lib/utils/util'

const version = '0.0.1'
export {
  version,
  Plugin,
  Mapbox,
  Layer,
  ShipManage,
  BaseShip,
  AisShip,
  Collision,
  CollisionItem as CollisionItem,
  Icon,
  Label,
  LabelItem,
  Point,
  LineString,
  Utils,
  Store
}
