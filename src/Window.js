//@flow
import * as React from 'react'
import cx from 'classnames'
import { align, clamp, clearEvent, findHighestZIndex, getScreenSize, nextConst } from './helpers'
import type {
  BottomMutationArgs,
  Bound,
  LeftMutationArgs,
  MaybeBound,
  MouseBechavior,
  Overlay,
  Overlays,
  Props,
  RightMutationArgs,
  Side,
  State,
  TopMutationArgs,
} from './Window.flow'


const DEFAULT_WIDTH = 600
const DEFAULT_HEIGHT = 400
const DEFAULT_LEFT = (width = DEFAULT_WIDTH) => (getScreenSize().width - width) / 2
const DEFAULT_TOP = (height = DEFAULT_HEIGHT) => (getScreenSize().height - height) / 2

// window position and resize direction constants
export const TOP = nextConst('TOP', 'side')
export const LEFT = nextConst('LEFT', 'side')
export const RIGHT = nextConst('RIGHT', 'side')
export const BOTTOM = nextConst('BOTTOM', 'side')
export const LEFT_TOP = nextConst('LEFT_TOP', 'side')
export const LEFT_BOTTOM = nextConst('LEFT_BOTTOM', 'side')
export const RIGHT_TOP = nextConst('RIGHT_TOP', 'side')
export const RIGHT_BOTTOM = nextConst('RIGHT_BOTTOM', 'side')
export const CENTER = nextConst('CENTER', 'side')
export const MIDDLE = nextConst('MIDDLE', 'side')

// window size factor
export const MIN = nextConst('MIN', 'size')
export const MAX = nextConst('MAX', 'size')
export const NORMAL = nextConst('NORMAL', 'size')

// windows status
export const ACTIVE = nextConst('ACTIVE', 'win_state')
export const NOT_ACTIVE = nextConst('NOT_ACTIVE', 'win_state')
export const ALWAYS = ACTIVE | NOT_ACTIVE

// modKeys
export const ALT = nextConst('ALT', 'key')
export const CTRL = nextConst('CTRL', 'key')
export const SHIFT = nextConst('SHIFT', 'key')

// mouse
export const MOUSE_ENTER = nextConst('MOUSE_ENTER', 'mouse')
export const MOUSE_LEAVE = nextConst('MOUSE_LEAVE', 'mouse')
export const MOUSE_MOVE = nextConst('MOUSE_MOVE', 'mouse')

const resetMargins = ({
  margin: 0,
  padding: 0,
  boxSizing: 'border-box',
})


export const renderResizeOverlay: Overlay = ({ props, state, context }) => {
  if (!state.mouseIn) return null

  const { resizable, draggable, overlayGridStyle, overlayGridClass, minWidth, minHeight } = props
  const quadY = Math.min(minHeight, minWidth)
  const quadX = Math.min(minHeight, minWidth)

  const resize = resizable ? [
    <div key="t" className={overlayGridClass}
         style={{
           position: 'absolute',
           top: 0,
           left: quadX + 1,
           right: quadX + 1,
           height: quadY,
           cursor: 'n-resize',
           ...overlayGridStyle,
         }}
         onMouseDown={context.handleResize(TOP)}
    />,
    <div key="b" className={overlayGridClass}
         style={{
           position: 'absolute',
           bottom: 0,
           left: quadX + 1,
           right: quadX + 1,
           height: quadY,
           cursor: 's-resize',
           ...overlayGridStyle,
         }}
         onMouseDown={context.handleResize(BOTTOM)}
    />,
    <div key="lt" className={overlayGridClass}
         style={{
           position: 'absolute',
           top: 0,
           left: 0,
           width: quadX,
           height: quadY,
           cursor: 'nw-resize',
           ...overlayGridStyle,
         }}
         onMouseDown={context.handleResize(LEFT_TOP)}
    />,
    <div key="l" className={overlayGridClass}
         style={{
           position: 'absolute',
           top: quadY + 1,
           left: 0,
           width: quadX,
           bottom: quadY + 1,
           cursor: 'w-resize',
           ...overlayGridStyle,
         }}
         onMouseDown={context.handleResize(LEFT)}
    />,
    <div key="lb" className={overlayGridClass}
         style={{
           position: 'absolute',
           bottom: 0,
           left: 0,
           width: quadX,
           height: quadY,
           cursor: 'sw-resize',
           ...overlayGridStyle,
         }}
         onMouseDown={context.handleResize(LEFT_BOTTOM)}
    />,
    <div key="rt" className={overlayGridClass}
         style={{
           position: 'absolute',
           top: 0,
           right: 0,
           width: quadX,
           height: quadY,
           cursor: 'ne-resize',
           ...overlayGridStyle,
         }}
         onMouseDown={context.handleResize(RIGHT_TOP)}
    />,
    <div key="r" className={overlayGridClass}
         style={{
           position: 'absolute',
           top: quadY + 1,
           right: 0,
           width: quadX,
           bottom: quadY + 1,
           cursor: 'e-resize',
           ...overlayGridStyle,
         }}
         onMouseDown={context.handleResize(RIGHT)}
    />,
    <div key="rb" className={overlayGridClass}
         style={{
           position: 'absolute',
           bottom: 0,
           right: 0,
           width: quadX,
           height: quadY,
           cursor: 'se-resize',
           ...overlayGridStyle,
         }}
         onMouseDown={context.handleResize(RIGHT_BOTTOM)}
    />,
  ] : []

  const move = draggable ? [
    <div key="center" className={overlayGridClass}
         style={{
           position: 'absolute',
           top: quadY + 1,
           left: quadX + 1,
           right: quadX + 1,
           bottom: quadY + 1,
           cursor: 'move',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           color: 'yellow',
           ...overlayGridStyle,
         }}
         onMouseDown={context.handleStartDrag}
    >
      Double-click to maximize/minimize window...
    </div>,
  ] : []

  return [...resize, ...move]
}

const defaultOverlays: Overlays = {
  [ALT]: renderResizeOverlay,
}

const WrapperLayer = ({ style, children, ...props }: {
  style?: Object,
  children?: React.Node,
  props?: {}
}) => (
  <div
    style={{
      ...resetMargins,
      boxSizing: 'border-box',
      width: '100%',
      height: '100%',
      position: 'relative',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
)

// default styles
const headerStyle = {
  ...resetMargins,
  fontSize: 18,
  userSelect: 'none',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  overflow: 'hidden',
  backgroundColor: 'transparent',
}
const footerStyle = {
  ...resetMargins,
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  overflow: 'hidden',
  backgroundColor: 'transparent',
}
const bodyStyle = {
  ...resetMargins,
  position: 'absolute',
  backgroundColor: 'transparent',
  overflow: 'auto',
}
const windowStyle = {
  ...resetMargins,
  backgroundColor: 'transparent',
  position: 'fixed',
}
const clientStyle = {
  ...resetMargins,
  position: 'absolute',
  backgroundColor: 'transparent',
  overflow: 'hidden',
}


const defaultProps = (): Props => ({
  modal: false,
  showModalMask: true,
  modalMaskClass: 'react-wm__modal-mask',
  modalMaskStyle: undefined,
  modalMaskClosable: false,

  opacity: 1,
  opaqueness: false,

  // move & resize
  resizable: true,
  draggable: true,
  throttle: 0,
  sizeFactor: NORMAL,
  bringToFront: false,
  overflow: true,
  draggableHeader: true,
  draggableFooter: false,
  draggableAlt: true,
  maximizable: true,
  minimizable: true,
  position: 0,
  binding: 0,
  sticky: false,

  // animation
  transition: false,
  transitionStyle: 'width .1s, height .1s, left .1s, top .1s',

  // move/resize assist overlay grid
  snapMask: true,
  snapMaskStyle: undefined,
  snapMaskClass: 'react-wm__snap-mask',
  snapGridWidth: 1,
  snapGridColor: 'rgba(0, 0, 0, .1)',

  overlays: (overlays) => overlays,

  overlayGridStyle: undefined,
  overlayGridClass: 'react-wm__overlay-grid',

  minMoveSnap: 10,
  minResizeSnap: 10,
  moveSnap: 1,
  resizeSnap: 1,

  // aria
  ariaRole: 'dialog',
  ariaLabelledby: 'dialog',
  ariaDescribedby: 'dialog',
  ariaModal: 'false',

  // border
  bordered: false,
  borderless: true,
  borderColor: '#ddd',
  borderDividerColor: '#aaa',
  borderWidth: 4,
  borderBlink: true,
  borderRadius: 0,
  cornerBorderColor: '#ddd',
  cornerBorderWidth: 16,

  // shadow
  shadow: true,
  shadowOffsetX: 6,
  shadowOffsetY: 6,
  shadowWidth: 24,
  shadowColor: '#555',

  // default window params
  minWidth: 100,
  minHeight: 100,
  maxWidth: 2 ** 52,
  maxHeight: 2 ** 52,

  header: null,
  footer: null,
})

const defaultState = (): State => {
  const {
    borderWidth,
    sizeFactor,
    opacity,
    left,
    top,
    width,
    height,
  } = defaultProps()

  return ({
    modKeys: 0,
    mouseIn: false,
    dragging: false,

    resizing: false,
    resizeSide: 0,

    offsetX: 0,
    offsetY: 0,
    offsetW: 0,
    offsetH: 0,

    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
    startRight: 0,
    startBottom: 0,
    startWidth: 0,
    startHeight: 0,

    headerHeight: 0,
    footerHeight: 0,
    clientHeight: 0,
    clientWidth: 0,

    bodyHeight: 0,
    highestZIndex: 1,
    bodyTop: 0,
    bodyWidth: 0,

    borderWidth,
    sizeFactor,
    opacity,
    left,
    top,
    width,
    height,
  })
}


export class Window extends React.Component<Props, State> {
  static defaultProps = defaultProps()

  // private vars
  root: ?HTMLDivElement
  client: ?HTMLDivElement
  header: ?HTMLDivElement = null
  footer: ?HTMLDivElement = null
  body: ?HTMLDivElement = null
  lastUpdate: number = 0

  // helpers
  checkTimeout = (): boolean => !this.props.throttle || Date.now() - this.lastUpdate > this.props.throttle
  isPositioning = (): boolean => {
    return typeof this.props.position === 'number' && this.props.position > 0
  }
  isSticky = (
    pos: number,
  ): boolean => this.props.sticky && this.isPositioning() && (this.props.position & pos) > 0
  isStickyY = (): boolean => this.isSticky(MIDDLE)
  isStickyX = (): boolean => this.isSticky(CENTER)

  getBound = (source: MaybeBound = this.state): Bound => {
    const { left, top, width, height } = source

    return ({
      left: (left ? left : 0),
      top: (top ? top : 0),
      width: (width ? width : 0),
      height: (height ? height : 0),
    })
  }

  // getMaybeBound = (): MaybeBound => {
  //   const { left, top, width, height } = this.state
  //   return { left, top, width, height }
  // }

  getMaximizeSize = (): Bound => {
    const { width, height } = getScreenSize()

    return {
      left: 0,
      top: 0,
      width,
      height,
    }
  }
  tryCloseModal = (e: SyntheticMouseEvent<>) => {
    !this.state.mouseIn && e.button === 0 && this.props.onClose && this.props.onClose()
  }

  // handlers
  handleMouseUp = (e: MouseEvent) => {
    if (this.state.dragging) {
      clearEvent(e)
      document.removeEventListener('mousemove', this.move)
      this.setState({ dragging: false })
    } else if (this.state.resizing) {
      clearEvent(e)
      document.removeEventListener('mousemove', this.resize)
      this.setState({ resizing: false })
    }
  }

  handleStartDrag = (e: SyntheticMouseEvent<>): void => {
    if (e.button !== 0 || !this.props.draggable || this.props.moveSnap <= 0 || this.state.sizeFactor === MAX) {
      return
    }

    clearEvent(e)
    const { pageX: x, pageY: y } = e
    document.addEventListener('mousemove', this.move)

    this.setState({
      dragging: true,
      offsetX: x - (this.state.left ? this.state.left : 0),
      offsetY: y - (this.state.top ? this.state.top : 0),
      startX: x,
      startY: y,
    })
  }

  lastBound = {}

  isBoundChanged = (b: Bound) => {
    const lp = this.lastBound
    return lp.left !== b.left || lp.top !== b.top || lp.width !== b.width || lp.height !== b.height
  }

  move = (e: MouseEvent) => {
    if (!this.state.dragging || !this.checkTimeout()) return
    clearEvent(e)

    const { moveSnap, overflow, sticky } = this.props
    const state = this.getBound()
    const sx = e.pageX - this.state.offsetX
    const sy = e.pageY - this.state.offsetY
    const { width, height } = getScreenSize()
    const top = align(sy, moveSnap)
    const left = align(sx, moveSnap)
    let result: {
      left?: number, top?: number, width?: number, height?: number, right?: number, bottom?: number
    } = {
      top: overflow ? top : clamp(top, 0, height - state.height),
      left: overflow ? left : clamp(left, 0, width - state.width),
      width: state.width,
      height: state.height,
    }

    result = sticky && this.isPositioning()
      ? this.alignWindowPosition(result)
      : result

    if (this.isBoundChanged(result)) {
      this.lastBound = result
      this.setState(result, () => this.lastUpdate = Date.now())
    }
  }

  handleResize = (side: Side) => (e: SyntheticMouseEvent<>) => {
    if (e.button !== 0 || !this.props.resizable || this.props.resizeSnap <= 0) return

    clearEvent(e)

    const { pageX: x, pageY: y } = e
    const { width, height, left, top } = this.getBound()

    document.addEventListener('mousemove', this.resize)

    this.setState({
      resizing: true,
      resizeSide: side,
      offsetW: width - x,
      offsetH: height - y,
      offsetX: x - left,
      offsetY: y - top,
      startX: x,
      startY: y,
      startLeft: left,
      startTop: top,
      startWidth: width,
      startHeight: height,
      startRight: left + width,
      startBottom: top + height,
    })
  }

  leftMutation = (
    { overflow, sx, offsetX, startRight, minWidth, startX, startWidth, maxWidth, width }: LeftMutationArgs,
    params: Bound = this.getBound(),
  ): Bound => {
    const sticky = this.isStickyY()

    return ({
      ...params,
      left: Math.round(
        overflow
          ? sx - offsetX
          : clamp({ value: sx - offsetX, min: 0, max: startRight - minWidth }),
      ),
      width: Math.round(clamp({
        value: startX - sx + startWidth - (sticky ? sx - startX : 0),
        min: minWidth,
        max: overflow ? maxWidth : sticky ? width : startRight,
      })),
    })
  }

  topMutation = (
    { overflow, sy, offsetY, startBottom, minHeight, startY, startHeight, maxHeight, height }: TopMutationArgs,
    params: Bound = this.getBound(),
  ): Bound => {
    const sticky = this.isStickyY()

    return ({
      ...params,
      top: Math.round(
        overflow
          ? sy - offsetY
          : clamp({ value: sy - offsetY, min: 0, max: startBottom - minHeight }),
      ),
      height: Math.round(clamp({
        value: startY - sy + startHeight - (sticky ? sy - startY : 0),
        min: minHeight,
        max: overflow ? maxHeight : sticky ? height : startBottom,
      })),
    })
  }

  rightMutation = (
    { x, offsetW, resizeSnap, minWidth, overflow, maxWidth, width, startX, left }: RightMutationArgs,
    params: Bound = this.getBound(),
  ): Bound => {
    const sticky = this.isStickyY()
    const sw = align(x + offsetW + (sticky ? x - startX : 0), resizeSnap)

    return {
      ...params,
      width: Math.round(clamp({
        value: sw,
        min: minWidth,
        max: overflow ? maxWidth : sticky ? width : width - left,
      })),
    }
  }

  bottomMutation = (
    { y, offsetH, resizeSnap, minHeight, overflow, maxHeight, height, top, startY }: BottomMutationArgs,
    params: Bound = this.getBound(),
  ): Bound => {
    const sticky = this.isStickyY()
    const sh = align(y + offsetH + (sticky ? y - startY : 0), resizeSnap)

    return {
      ...params,
      height: Math.round(clamp({
        value: sh,
        min: minHeight,
        max: overflow ? maxHeight : sticky ? height : height - top,
      })),
    }
  }

  mutations = {
    [RIGHT]: params => this.rightMutation(params),
    [LEFT]: params => this.leftMutation(params),
    [BOTTOM]: params => this.bottomMutation(params),
    [TOP]: params => this.topMutation(params),
    [RIGHT_BOTTOM]: params => this.bottomMutation(params, this.rightMutation(params)),
    [RIGHT_TOP]: params => this.topMutation(params, this.rightMutation(params)),
    [LEFT_TOP]: params => this.topMutation(params, this.leftMutation(params)),
    [LEFT_BOTTOM]: params => this.bottomMutation(params, this.leftMutation(params)),
  }

  resize = (e: MouseEvent) => {
    const { resizing, resizeSide } = this.state

    if (!resizing || !this.checkTimeout()) return

    e.stopPropagation()
    e.preventDefault()

    const {
      startRight, startBottom,
      offsetX, offsetY,
      startX, startY,
      startWidth, startHeight,
      offsetW, offsetH,
      left, top,
    } = this.state
    const { overflow, minHeight, maxHeight, minWidth, maxWidth, resizeSnap, sticky } = this.props
    const { pageX: x, pageY: y } = e
    const sx = align(x, resizeSnap)
    const sy = align(y, resizeSnap)
    const { width, height } = getScreenSize()

    const params = ({
      overflow, sticky, left, top,
      sx, offsetX, startRight, minWidth, startX, startWidth, maxWidth,
      sy, offsetY, startBottom, minHeight, startY, startHeight, maxHeight,
      x, offsetW, width,
      y, offsetH, resizeSnap, height,
    })

    if (resizeSide in this.mutations) {
      let result = {
        ...this.mutations[resizeSide](params),
        sizeFactor: NORMAL,
      }
      result = sticky && this.isPositioning()
        ? this.alignWindowPosition(result)
        : result

      if (this.isBoundChanged(result)) {
        this.lastBound = result
        // console.log('resize', result)
        // Ждем отрисовки основных секций окна, вычисляем размер body и перерисовываем еще раз
        this.setState(result, () => this.setState({ ...this.getSectionsMetrics() }))

        this.lastUpdate = Date.now()
      }
    }
  }

  lastScreenSize = {}
  cacheGrid = {}
  renderSnapGrid = (snap: number) => {
    const { width: w, height: h } = getScreenSize()

    if (snap in this.lastScreenSize && this.lastScreenSize[snap].w === w && this.lastScreenSize[snap].h === h) {
      return this.cacheGrid[snap]
    }

    this.lastScreenSize[snap] = { w, h }

    const grid = []
    const { snapGridWidth, snapGridColor, snapMaskClass, snapMaskStyle } = this.props

    // console.log(snap, snapGridWidth, snapGridColor, snapMaskGridStyle)

    for (let y = 0; y < h; y += snap) {
      grid.push(
        <div
          key={`y${y}`}
          style={{
            position: 'absolute',
            top: y - snapGridWidth / 2, left: 0, right: 0, height: snapGridWidth,
            border: 'none',
            backgroundColor: snapGridColor,
          }}
        />,
      )
    }

    for (let x = 0; x < w; x += snap) {
      grid.push(
        <div
          key={`x${x}`}
          style={{
            position: 'absolute',
            top: 0, left: x - snapGridWidth / 2, bottom: 0, width: snapGridWidth,
            border: 'none',
            backgroundColor: snapGridColor,
          }}
        />,
      )
    }

    this.cacheGrid[snap] = (
      <div className={snapMaskClass} style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        ...resetMargins,
        ...snapMaskStyle,
      }}
      >
        {grid}
      </div>
    )

    return grid
  }

  toggleSize = (e: SyntheticMouseEvent<>) => {
    const state = this.state
    const { maximizable } = this.props
    const { sizeFactor } = state

    if (maximizable) {
      clearEvent(e)

      if (sizeFactor === NORMAL) {
        this.prevWindowParams = {
          ...this.getBound(),
          // borderWidth: this.getBorderWidth(), //this.props.borderWidth,
          sizeFactor,
        }
        this.setState({
          sizeFactor: MAX,
          ...this.getMaximizeSize(),
        })
      } else {
        this.setState({
          sizeFactor: NORMAL,
          ...this.prevWindowParams,
        })
      }
    }
  }

  getBorderWidth = (): number => {
    const { borderless, bordered, borderWidth } = this.props
    const { sizeFactor, mouseIn } = this.state
    const isMaximized = sizeFactor === MAX

    if (isMaximized) return 0

    const currentState = (mouseIn ? ACTIVE : 0) | (!mouseIn ? NOT_ACTIVE : 0)

    if (typeof bordered === 'number' && !!(currentState & bordered)) {
      return borderWidth
    }
    if (typeof borderless === 'number' && !!(currentState & borderless)) {
      return 0
    }

    return (bordered === true || borderless === false) ? borderWidth : 0
  }

  permitModKeys = ({ altKey, ctrlKey, shiftKey }: { altKey: boolean, ctrlKey: boolean, shiftKey: boolean }): number => {
    const overlays = this.props.overlays(defaultOverlays)
    const pressedKeys: number = (altKey ? ALT : 0) | (ctrlKey ? CTRL : 0) | (shiftKey ? SHIFT : 0)
    const allowKeys: number = Object.keys(overlays).reduce((acc, key): number => acc | Number(key), 0) & pressedKeys
    return Object.keys(overlays).reduce((acc, strKey) => {
      const key = Number(strKey)
      return acc | ((allowKeys & key) === key ? key : 0)
    }, 0)
  }

  handleKeyEvents = (e: KeyboardEvent) => {
    const modKeys = this.permitModKeys(e)

    if (modKeys !== this.state.modKeys) {
      this.setState({ modKeys })
    }
  }

  handleKeyDown = this.handleKeyEvents
  handleKeyUp = this.handleKeyEvents

  setOpacity = (e: SyntheticWheelEvent<>) => {
    clearEvent(e)
    this.props.opaqueness && this.setState({
      opacity: clamp({ value: this.state.opacity - Math.sign(e.deltaY) / 100, min: 0.0, max: 1.0 }),
    })
  }

  handleRootMouseMove = (e: SyntheticMouseEvent<>, type: MouseBechavior) => {
    const { mouseIn } = this.state

    if ((type === MOUSE_MOVE || type === MOUSE_ENTER) && !mouseIn) {
      this.setState({ mouseIn: true })
    } else if (type === MOUSE_LEAVE && mouseIn) {
      this.setState({ mouseIn: false })
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return true
    const state = this.state
    const {
      left, top, width, height,
      dragging, resizing, opacity,
      headerHeight, footerHeight, clientHeight, clientWidth, bodyHeight, bodyTop, bodyWidth,
      borderWidth, sizeFactor, mouseIn, modKeys,
    } = nextState

    const result = (
      left !== state.left
      || top !== state.top
      || width !== state.width
      || height !== state.height
      || dragging !== state.dragging
      || resizing !== state.resizing
      || opacity !== state.opacity
      || headerHeight !== state.headerHeight
      || footerHeight !== state.footerHeight
      || clientHeight !== state.clientHeight
      || clientWidth !== state.clientWidth
      || bodyHeight !== state.bodyHeight
      || bodyTop !== state.bodyTop
      || bodyWidth !== state.bodyWidth
      || borderWidth !== state.borderWidth
      || sizeFactor !== state.sizeFactor
      || mouseIn !== state.mouseIn
      || modKeys !== state.modKeys
    )
    // console.log('SCU:', result)
    return result
  }

  renderOverlays = (): Array<React.Node> => {
    const overlays = this.getOverlays()
    const { state, props } = this
    const context = this

    return Object.keys(overlays).map(strKey => {
      const key = Number(strKey)
      if ((state.modKeys & key) === key && typeof overlays[key] === 'function') {
        return <React.Fragment key={strKey}>
          {overlays[key]({ props, state, context })}
        </React.Fragment>
      }
      return null
    })
  }

  getOverlays = (): Overlays => this.props.overlays(defaultOverlays)

  renderWindow = () => {
    const props = this.props
    const { style, borderDividerColor, cornerBorderWidth, borderColor, cornerBorderColor, borderBlink } = props
    const { draggableHeader, draggableFooter, draggableAlt, resizable, draggable } = props
    const { shadowOffsetX, shadowOffsetY, shadowWidth, shadowColor, shadow } = props
    const { top, left, width, height, sizeFactor } = this.state
    const { ariaLabelledby, ariaDescribedby, ariaModal, ariaRole } = props
    const { header, footer, overlays } = props
    const { transition, moveSnap, minMoveSnap, resizeSnap, minResizeSnap, transitionStyle } = props
    const maximized = sizeFactor === MAX
    const borderWidth = this.getBorderWidth()
    // const borderDivider = resizable ? borderDividerColor : borderColor
    const vBorderStyle = {
      backgroundColor: borderColor,
      position: 'absolute',
      cursor: resizable ? 'w-resize' : 'default',
      top: cornerBorderWidth - 1,
      width: borderWidth,
      bottom: cornerBorderWidth - 1,
    }
    const hBorderStyle = {
      backgroundColor: borderColor,
      position: 'absolute',
      cursor: resizable ? 's-resize' : 'default',
      left: cornerBorderWidth - 1,
      right: cornerBorderWidth - 1,
      height: borderWidth,
    }
    const swBorderStyle = {
      backgroundColor: cornerBorderColor,
      position: 'absolute',
      cursor: resizable ? 'sw-resize' : 'default',
      height: cornerBorderWidth,
      width: cornerBorderWidth,
    }
    const nwBorderStyle = {
      backgroundColor: cornerBorderColor,
      position: 'absolute',
      cursor: resizable ? 'nw-resize' : 'default',
      height: cornerBorderWidth,
      width: cornerBorderWidth,
    }
    const rootWindowStyle = {
      ...windowStyle,
      opacity: this.state.opacity,
      width,
      height,
      top,
      left,
      borderRadius: props.borderRadius,
      boxShadow: shadow ? `${shadowOffsetX}px ${shadowOffsetY}px ${shadowWidth}px ${shadowColor}` : 'none',
      border: borderWidth === 0 ? 'none' : `1px solid ${borderDividerColor}`,
      transition: transition && (moveSnap >= minMoveSnap || resizeSnap >= minResizeSnap)
        ? transitionStyle
        : '',
      ...this.props.windowStyle,
    }
    const borderClassName = cx({
      'react-wm__border': borderBlink && resizable,
      'react-wm__dragging-border': borderBlink && this.state.dragging,
    })
    const borderWidthDiff = cornerBorderWidth - borderWidth

    return (
      <div
        style={{ ...rootWindowStyle, ...style }}
        ref={node => this.root = node}
        role={ariaRole}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        aria-modal={String(ariaModal)}
        onWheel={e => e.altKey && this.setOpacity(e)}
        onDoubleClick={e => e.altKey && draggableAlt && this.toggleSize(e)}
        onMouseMove={e => e.altKey && draggableAlt && this.handleRootMouseMove(e, MOUSE_MOVE)}
        onMouseEnter={e => this.handleRootMouseMove(e, MOUSE_ENTER)}
        onMouseLeave={e => this.handleRootMouseMove(e, MOUSE_LEAVE)}
      >
        <div
          className={borderClassName}
          style={{ ...vBorderStyle, left: 0 }}
          onMouseDown={this.handleResize(LEFT)}
        />
        <div
          className={borderClassName}
          style={{ ...vBorderStyle, right: 0 }}
          onMouseDown={this.handleResize(RIGHT)}
        />
        <div
          className={borderClassName}
          style={{ ...hBorderStyle, top: 0 }}
          onMouseDown={this.handleResize(TOP)}
        />
        <div
          className={borderClassName}
          style={{ ...hBorderStyle, bottom: 0 }}
          onMouseDown={this.handleResize(BOTTOM)}
        />

        <div
          className={borderClassName}
          style={{
            ...swBorderStyle, left: 0, bottom: 0,
            clipPath: `polygon(0 0, ${borderWidth}px 0, ${borderWidth}px ${borderWidthDiff}px, 100% ${borderWidthDiff}px, 100% 100%, 0 100%, 0 0)`,
          }}
          onMouseDown={this.handleResize(LEFT_BOTTOM)}
        />
        <div
          className={borderClassName}
          style={{
            ...swBorderStyle, top: 0, right: 0,
            clipPath: `polygon(0 0, 100% 0, 100% 100%, ${borderWidthDiff}px 100%, ${borderWidthDiff}px ${borderWidth}px, 0 ${borderWidth}px, 0 0)`,
          }}
          onMouseDown={this.handleResize(RIGHT_TOP)}
        />
        <div
          className={borderClassName}
          style={{
            ...nwBorderStyle, right: 0, bottom: 0,
            clipPath: `polygon(${borderWidthDiff}px 0, 100% 0, 100% 100%, 0 100%, 0 ${borderWidthDiff}px, ${borderWidthDiff}px ${borderWidthDiff}px, ${borderWidthDiff}px 0)`,
          }}
          onMouseDown={this.handleResize(RIGHT_BOTTOM)}
        />
        <div
          className={borderClassName}
          style={{
            ...nwBorderStyle, top: 0, left: 0,
            clipPath: `polygon(0 0, 100% 0, 100% ${borderWidth}px, ${borderWidth}px ${borderWidth}px, ${borderWidth}px 100%, 0 100%, 0 0)`,
          }}
          onMouseDown={this.handleResize(LEFT_TOP)}
        />

        <div
          style={{
            ...clientStyle,
            top: borderWidth,
            left: borderWidth,
            right: borderWidth,
            bottom: borderWidth,
            border: borderWidth === 0 ? 'none' : `1px solid ${borderDividerColor}`,
            ...this.props.clientStyle,
          }}
          ref={node => this.client = node}
        >
          {header && (
            <div
              style={{
                ...headerStyle,
                cursor: draggable && draggableHeader && !maximized ? '-webkit-grab' : 'default',
                ...this.props.headerStyle,
              }}
              onMouseDown={e => draggableHeader && this.handleStartDrag(e)}
              onDoubleClick={this.toggleSize}
              ref={node => this.header = node}
            >
              <WrapperLayer>
                {typeof header === 'function' ? header(this.state, props) : header}
              </WrapperLayer>
            </div>
          )}

          <div
            ref={node => this.body = node}
            style={{
              ...bodyStyle,
              left: 0,
              top: this.state.bodyTop,
              height: this.state.bodyHeight,
              width: this.state.bodyWidth,
              ...this.props.bodyStyle,
            }}
          >
            <WrapperLayer>
              {typeof props.children === 'function'
                ? props.children(this.state)
                : props.children
              }
            </WrapperLayer>
          </div>

          {footer && (
            <div
              style={{
                ...footerStyle,
                cursor: draggable && draggableFooter && !maximized ? '-webkit-grab' : 'default',
                ...this.props.footerStyle,
              }}
              ref={node => this.footer = node}
              onMouseDown={e => draggableFooter && this.handleStartDrag(e)}
            >
              <WrapperLayer>
                {typeof footer === 'function' ? footer(this.state, props) : footer}
              </WrapperLayer>
            </div>
          )}
        </div>

        {this.renderOverlays()}
      </div>
    )
  }

  savedWidth = null
  savedHeight = null

  alignWindowPosition = (source: {
    left?: number, top?: number, width?: number, height?: number, right?: number, bottom?: number
  }): Bound => {
    const { position, overflow, minWidth, minHeight, maxWidth, maxHeight } = this.props
    let { left, top, width, height, right, bottom } = source
    const { width: sw, height: sh } = getScreenSize()

    if (this.savedWidth !== null) {
      width = this.savedWidth
    }

    if (this.savedHeight !== null) {
      height = this.savedHeight
    }

    if (width === undefined) {
      // if (left === undefined || right === undefined) {
      //   width = DEFAULT_WIDTH
      // } else
      if (left !== undefined && right !== undefined) {
        width = sw - left - right
      } else {
        width = DEFAULT_WIDTH
      }
    }

    if (height === undefined) {
      // if (top === undefined || bottom === undefined) {
      //   height = DEFAULT_HEIGHT
      // } else
      if (top !== undefined && bottom !== undefined) {
        height = sh - bottom - top
      } else {
        height = DEFAULT_HEIGHT
      }
    }

    if (overflow) {
      width = clamp(width, minWidth, maxWidth)
      height = clamp(height, minHeight, maxHeight)

      if (left === undefined) {
        if (right === undefined) {
          left = DEFAULT_LEFT(width)
        } else {
          left = width - right
        }
      }

      if (top === undefined) {
        if (bottom === undefined) {
          top = DEFAULT_TOP(height)
        } else {
          top = height - bottom
        }
      }
    } else {
      const newWidth = clamp(width, minWidth, sw)
      const newHeight = clamp(height, minHeight, sh)

      if (newWidth < width && this.savedWidth === null) {
        this.savedWidth = width
        width = newWidth
      } else if (this.savedWidth !== null && sw >= this.savedWidth) {
        width = this.savedWidth
        this.savedWidth = null
      } else {
        width = newWidth
      }

      if (newHeight < height && this.savedHeight === null) {
        this.savedHeight = height
        height = newHeight
      } else if (this.savedHeight !== null && sh >= this.savedHeight) {
        height = this.savedHeight
        this.savedHeight = null
      } else {
        height = newHeight
      }

      if (left === undefined) {
        if (right === undefined) {
          left = DEFAULT_LEFT(width)
        } else {
          left = sw - width - right
        }
      }

      if (top === undefined) {
        if (bottom === undefined) {
          top = DEFAULT_TOP(height)
        } else {
          top = sh - height - bottom
        }
      }
    }

    const clampedTop = overflow ? sh - height : clamp(sh - height, 0, sh - minHeight)
    const clampedLeft = overflow ? sw - width : clamp(sw - width, 0, sw - minWidth)

    if (this.isPositioning()) {
      if (position & LEFT) left = 0
      if (position & RIGHT) left = clampedLeft
      if (position & TOP) top = 0
      if (position & BOTTOM) top = clampedTop
      if (position & CENTER) left = clampedLeft / 2
      if (position & MIDDLE) top = clampedTop / 2
    } else {
      // top = 0
      // left = 0
      // width = sw
      // height = sh
    }

    return { left, top, width, height }
  }

  resizeWindow = () => {
    if (this.props.sticky && this.isPositioning()) {
      // Ждем отрисовки основных секций окна, вычисляем размер body и перерисовываем еще раз
      this.setState(
        this.alignWindowPosition(this.state),
        () => this.setState(this.getSectionsMetrics()),
      )
    }
  }

  getSectionsMetrics = () => {
    const s = {
      headerHeight: this.header ? this.header.offsetHeight : 0,
      footerHeight: this.footer ? this.footer.offsetHeight : 0,
      clientHeight: this.client ? this.client.offsetHeight : 0,
      clientWidth: this.client ? this.client.offsetWidth : 0,
    }
    const borderWidth = this.getBorderWidth() // > 0 ? 2 : 0

    return ({
      ...s,
      bodyTop: s.headerHeight,
      bodyHeight: s.clientHeight - s.headerHeight - s.footerHeight - borderWidth,
      bodyWidth: s.clientWidth - borderWidth,
    })
  }

  prevWindowParams: ?{} = null

  constructor(props: Props) {
    super(props)

    let bound = this.alignWindowPosition(props)

    this.prevWindowParams = {
      ...bound,
      sizeFactor: NORMAL,
      borderWidth: props.borderWidth,
    }

    this.state = {
      ...defaultState(),
      ...bound,
      sizeFactor: props.sizeFactor,
      opacity: props.opacity,
    }

    if (props.sizeFactor === MAX) {
      Object.assign(this.state, {
        sizeFactor: MAX,
        borderWidth: 0,
        ...this.getMaximizeSize(),
      })
    }
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.handleMouseUp)
    document.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('keyup', this.handleKeyUp)
    window.addEventListener('resize', this.resizeWindow)

    let { highestZIndex } = this.state

    if (this.props.modal) {
      highestZIndex = findHighestZIndex()
    }

    if (this.root) {
      this.setState({
        highestZIndex,
        left: this.root.offsetLeft,
        top: this.root.offsetTop,
        width: this.root.offsetWidth,
        height: this.root.offsetHeight,
        ...this.getSectionsMetrics(),
      })
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { headerHeight, footerHeight, clientHeight } = this.getSectionsMetrics()

    if (headerHeight !== prevState.headerHeight || footerHeight !== prevState.footerHeight || clientHeight !== prevState.clientHeight) {
      this.setState(this.getSectionsMetrics())
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.handleMouseUp)
    document.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('keyup', this.handleKeyUp)
    window.removeEventListener('resize', this.resizeWindow)
  }

  render() {
    const props = this.props
    const { dragging, resizing, highestZIndex } = this.state
    const { modal, showModalMask, modalMaskStyle, modalMaskClass } = props
    const { snapMask, moveSnap, minMoveSnap, resizeSnap, minResizeSnap } = props
    const needGrid = snapMask && ((dragging && moveSnap >= minMoveSnap) || (resizing && resizeSnap >= minResizeSnap))
    const zIndex = (modal || needGrid) ? findHighestZIndex() + 1 : 1

    const wndBackgroundStyle = modal
      ? {
        position: 'fixed',
        zIndex: Math.max(zIndex, highestZIndex + 1),
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        ...resetMargins,
        ...showModalMask ? modalMaskStyle : undefined,
      }
      : {
        position: 'fixed',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        border: 'none',
        ...resetMargins,
      }

    return (
      <div
        className={modal && showModalMask ? modalMaskClass : ''}
        style={wndBackgroundStyle}
        onMouseDown={this.tryCloseModal}
      >
        {needGrid && this.renderSnapGrid(dragging ? moveSnap : resizeSnap)}
        {this.renderWindow()}
      </div>
    )
  }
}
