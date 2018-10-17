import React, { Component } from 'react'
import { render } from 'react-dom'
import { syntaxHighlight } from '../../src/helpers'
import { NORMAL, Window } from '../../src'
import '../../src/styles.css'
import './styles.css'


const demoWindowHeaderStyle = {
  padding: '8px 16px',
  fontSize: 16,
  fontWeight: 'bold',
  backgroundColor: 'rgba(100, 150, 200, .85)',
  color: 'white',
  display: 'flex',
  justifyContent: 'space-between',
}

const paramsWindowHeaderStyle = {
  backgroundColor: '#ddff',
  borderBottom: '1px solid #ccc',
  color: '#333',
  padding: '10px 20px',
  fontSize: 20,
}

const demoWindowStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  color: 'white',
  fontSize: 18,
  padding: 20,
}

const BOOL = 1
const STRING = 2
const NUMBER = 4
const REQUIRED = 8
const OBJECT = 16

const types = {
  [BOOL]: 'checkbox',
  [STRING]: 'text',
  [NUMBER]: 'number',
  [OBJECT]: 'text',
}


class Demo extends Component {
  state = {
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
  }

  change = (field, type) => (e) => {
    console.log('Field', field, e.target.value, e.target.checked, type, type & STRING & NUMBER)

    if (type & STRING || type & NUMBER) {
      console.log(type)
      this.setState({ [field]: e.target.value })
    } else if (type & BOOL) {
      console.log('BOOL')
      this.setState({ [field]: e.target.checked })
    } else if (type & OBJECT) {
      console.log('OBJECT')
    }
  }

  getInputProps = (field, type) => ({
    type: types[type],
    checked: this.state[field],
    value: this.state[field],
    onChange: this.change(field, type),
  })

  renderField = (name, type, strike = false) => (
    <div>
      <label>
        <dt style={{ textDecoration: strike && 'line-through' }}>{name}:</dt>
        <dd>
          <input {...this.getInputProps(name, type)} />
        </dd>
      </label>
    </div>
  )

  render() {
    return <div>
      <Window
        left={0}
        bottom={0}
        top={0}
        width={450}
        shadow={false}
        bordered
        borderWidth={0}
        draggable={false}
        resizable={false}
        clientStyle={{
          borderRight: '1px solid #ccc',
          boxShadow: '4px 0 20px #bbb',
        }}
        bodyStyle={{
          fontSize: 18,
          padding: 20,
          // backgroundColor: '#eee'
        }}
        header={
          <div style={paramsWindowHeaderStyle}>
            react-wm-window Demo
          </div>
        }
      >
        <fieldset>
          <legend>Modal params</legend>
          {this.renderField('modal', BOOL)}
          {this.renderField('showModalMask', BOOL)}
          {this.renderField('modalMaskClass', STRING)}
          {this.renderField('modalMaskStyle', OBJECT)}
          {this.renderField('modalMaskClosable', BOOL)}
        </fieldset>

        <fieldset>
          <legend>Aria attributes</legend>
          {this.renderField('ariaRole', STRING)}
          {this.renderField('ariaLabelledby', STRING)}
          {this.renderField('ariaDescribedby', STRING)}
          {this.renderField('ariaModal', STRING)}
        </fieldset>

        <fieldset>
          <legend>Border</legend>
          {this.renderField('bordered', BOOL)}
          {this.renderField('borderless', BOOL, this.state.bordered)}
          {this.renderField('borderColor', STRING)}
          {this.renderField('borderDividerColor', STRING)}
          {this.renderField('borderWidth', NUMBER)}
          {this.renderField('borderBlink', BOOL)}
          {this.renderField('borderRadius', NUMBER)}
          {this.renderField('cornerBorderColor', STRING)}
          {this.renderField('cornerBorderWidth', NUMBER)}
        </fieldset>

        <fieldset>
          <legend>Shadow</legend>
          {this.renderField('shadow', BOOL)}
          {this.renderField('shadowOffsetX', NUMBER)}
          {this.renderField('shadowOffsetY', NUMBER)}
          {this.renderField('shadowWidth', NUMBER)}
          {this.renderField('shadowColor', STRING)}
        </fieldset>

        <fieldset>
          <legend>Opaqueness</legend>
          {this.renderField('opaqueness', BOOL)}
          {this.renderField('opacity', NUMBER)}
        </fieldset>

        <fieldset>
          <legend>Window size limits</legend>
          {this.renderField('minWidth', NUMBER)}
          {this.renderField('minHeight', NUMBER)}
          {this.renderField('maxWidth', NUMBER)}
          {this.renderField('maxHeight', NUMBER)}
        </fieldset>

        <fieldset>
          <legend>Moving</legend>
          {this.renderField('draggable', BOOL)}
          {this.renderField('bringToFront', BOOL)}
          {this.renderField('overflow', BOOL)}
          {this.renderField('draggableHeader', BOOL)}
          {this.renderField('draggableFooter', BOOL)}
          {this.renderField('draggableAlt', BOOL)}
          {this.renderField('position', NUMBER)}
          {this.renderField('binding', NUMBER)}
          {this.renderField('sticky', BOOL)}
        </fieldset>

        <fieldset>
          <legend>Resizing</legend>
          {this.renderField('resizable', BOOL)}
          {this.renderField('sizeFactor', NUMBER)}
          {this.renderField('maximizable', BOOL)}
          {this.renderField('minimizable', BOOL)}
        </fieldset>

        <fieldset>
          <legend>Snap params</legend>

          {this.renderField('snapMask', BOOL)}
          {this.renderField('snapMaskStyle', OBJECT)}
          {this.renderField('snapMaskClass', STRING)}
          {this.renderField('snapGridWidth', NUMBER)}
          {this.renderField('snapGridColor', STRING)}
          {this.renderField('minMoveSnap', NUMBER)}
          {this.renderField('minResizeSnap', NUMBER)}
          {this.renderField('moveSnap', NUMBER)}
          {this.renderField('resizeSnap', NUMBER)}
        </fieldset>

        <fieldset>
          <legend>Animation move/resize</legend>
          {this.renderField('throttle', NUMBER)}
          {this.renderField('transition', BOOL)}
          {this.renderField('transitionStyle', STRING)}
        </fieldset>

        <fieldset>
          <legend>Overlay grid</legend>
          {this.renderField('overlayGridStyle', OBJECT)}
          {this.renderField('overlayGridClass', STRING)}
        </fieldset>
      </Window>

      <Window
        bodyStyle={demoWindowStyle}
        header={
          <div style={{ ...demoWindowHeaderStyle }}>
            <div>
              {'Header '}
              {this.state.maximizable && '[double-click to max/min] '}
              {this.state.draggable && '[mouse click and drag]'}
            </div>
            <label>
              <dt>modal:</dt>
              <dd>
                <input type="checkbox" checked={this.state.modal} onChange={this.change('modal', BOOL)} />
              </dd>
            </label>
          </div>
        }
        footer="Footer"
        footerStyle={{
          padding: '2px 10px',
          backgroundColor: '#eee'
        }}
        {...this.state}
      >
        Press ALT key above window
      </Window>
    </div>
  }
}


render(<Demo />, document.querySelector('#demo'))
