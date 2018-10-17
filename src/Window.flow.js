/* eslint-disable no-use-before-define */
//@flow
import * as React from 'react'
import { Window } from './Window'


export type MouseBechavior = number

export type SizeFactor = number
export type Side = number

export type Bound = {
  left: number,
  top: number,
  width: number,
  height: number,
}

export type AddonBound = {
  right?: ?number,
  bottom?: ?number,
}

export type MaybeBound = {
  left?: number,
  top?: number,
  width?: number,
  height?: number,
}

export type Size = {
  width: number,
  height: number
}

export type LeftMutationArgs = {
  overflow: boolean,
  startX: number,
  minWidth: number,
  maxWidth: number,
  width: number,
  startRight: number,
  startWidth: number,
  sx: number,
  sticky: boolean,
  offsetX: number,
}

export type RightMutationArgs = {
  overflow: boolean,
  startX: number,
  minWidth: number,
  maxWidth: number,
  width: number,
  x: number,
  left: number,
  resizeSnap: number,
  offsetW: number,
}

export type TopMutationArgs = {
  overflow: boolean,
  startY: number,
  minHeight: number,
  maxHeight: number,
  height: number,
  startBottom: number,
  startHeight: number,
  sy: number,
  offsetY: number,
}

export type BottomMutationArgs = {
  overflow: boolean,
  minHeight: number,
  maxHeight: number,
  height: number,
  y: number,
  top: number,
  resizeSnap: number,
  startY: number,
  offsetH: number,
}

export type StartBound = {
  startLeft: number,
  startTop: number,
  startWidth: number,
  startHeight: number,
  startRight?: number,
  startBottom?: number,
}

export type SectionsMetrics = {
  clientHeight: number,
  clientWidth: number,
  bodyTop: number,
  bodyWidth: number,
  bodyHeight: number,
  headerHeight: number,
  footerHeight: number,
}

export type MouseMetrics = {
  startX: number,
  startY: number,
  offsetX: number,
  offsetY: number,
  offsetW: number,
  offsetH: number,
}

export type State = {
  // from props
  left: number,
  top: number,
  width: number,
  height: number,
  right?: ?number,
  bottom?: ?number,
  borderWidth: number,
  sizeFactor: SizeFactor,
  opacity: number,

  // computed
  modKeys: number,
  dragging: boolean,
  resizing: boolean,
  resizeSide: number,
  mouseIn: boolean,
  highestZIndex: number,
  ...StartBound, // computed
  ...SectionsMetrics, // computed
  ...MouseMetrics // computed
}

export type WindowType = Window
export type OverlayParams = {| props: Props, state: State, context: WindowType |}
export type Overlay = (OverlayParams) => React.Node
export type Overlays = {| [number]: Overlay |}

export type Props = MaybeBound & AddonBound & {
  modal?: boolean,
  showModalMask?: boolean,
  modalMaskClass?: string,
  modalMaskStyle?: CSSStyleDeclaration,
  modalMaskClosable?: boolean,

  opacity: number,
  opaqueness: boolean,

  // move & resize
  resizable: boolean,
  draggable: boolean,
  throttle: number,
  sizeFactor: SizeFactor,
  bringToFront: boolean,
  overflow: boolean,
  draggableHeader: boolean,
  draggableFooter: boolean,
  draggableAlt: boolean,
  maximizable: boolean,
  minimizable: boolean,
  position: number,
  binding: number,
  sticky: boolean,

  // animation
  transition: boolean,
  transitionStyle: string,

  // move/resize assist overlay grid
  snapMask: boolean,
  snapMaskStyle: ?CSSStyleDeclaration,
  snapMaskClass: string,
  snapGridWidth: number,
  snapGridColor: string,

  overlays: (Overlays) => Overlays,
  overlayGridStyle: ?CSSStyleDeclaration,
  overlayGridClass: string,

  // snap
  minMoveSnap: number,
  minResizeSnap: number,
  moveSnap: number,
  resizeSnap: number,

  // aria
  ariaRole: string,
  ariaLabelledby: string,
  ariaDescribedby: string,
  ariaModal: string,

  // border
  bordered: boolean | number,
  borderless: boolean | number,
  borderColor: string,
  borderDividerColor: string,
  borderWidth: number,
  borderBlink: boolean,
  borderRadius: number,
  cornerBorderColor: string,
  cornerBorderWidth: number,

  // shadow
  shadow: boolean,
  shadowOffsetX: number,
  shadowOffsetY: number,
  shadowWidth: number,
  shadowColor: string,

  // default window params
  minWidth: number,
  minHeight: number,
  maxWidth: number,
  maxHeight: number,

  style?: CSSStyleDeclaration,
  windowStyle?: CSSStyleDeclaration,
  headerStyle?: CSSStyleDeclaration,
  footerStyle?: CSSStyleDeclaration,
  bodyStyle?: CSSStyleDeclaration,
  clientStyle?: CSSStyleDeclaration,
  header: ?React.Node,
  footer: ?React.Node,

  // events
  onClose?: ?Function,

  children?: React.Node
}
