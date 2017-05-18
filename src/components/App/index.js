import React, { PureComponent } from 'react'
import { generateRandomList } from '../../utils'
import Pockets from '../Pocket/PocketsTable';
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import './App.css'
// import 'react-virtualized/styles.css'
import 'antd/dist/antd.css'

// HACK Generate arbitrary data for use in example components :)
// let list = null;
const list = Immutable.List(generateRandomList());

class App extends PureComponent {
  static childContextTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired,
    customElement: PropTypes.any,
    isScrollingCustomElement: PropTypes.bool.isRequired,
    setScrollingCustomElement: PropTypes.func
  };
  
  state = {
    isScrollingCustomElement: true
  }

  constructor (props) {
    super(props)
    this.setScrollingCustomElement = this.setScrollingCustomElement.bind(this)
  }


  setScrollingCustomElement (custom) {
    this.setState({ isScrollingCustomElement: custom })
  }
  
  getChildContext () {
    const { customElement, isScrollingCustomElement } = this.state
    return {
      list,
      customElement,
      isScrollingCustomElement,
      setScrollingCustomElement: this.setScrollingCustomElement
    }
  }

  render() {
    return (
      <div className="App">
        {/*<div className="App-header">
          <h2>听听订阅</h2>
        </div>
        <p className="App-intro">
          keep it simple, stupid.
        </p>*/}
        <div className='Body' ref={e => this.setState({ customElement: e })}>
          <div className='column'>
            <Pockets />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
