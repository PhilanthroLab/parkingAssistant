import React from 'react';
import Navigator from './utils/Navigator'
import StreetParkingSpot from './models/StreetParkingSpot'
import StreetParkingSpotView from './views/StreetParkingSpotView'
import CurrentLocationView from './views/CurrentLocationView'
import Loading from './views/Loading'
import CompassView from './views/CompassView'
import HomeView from './views/HomeView'
import ParkedView from './views/ParkedView'

export default class App extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      location: false,
      heading: false
    }
  }

  setLocation(position) {
    this.setState(() => {
      return {
        position: position
      }
    })
  }

  setHeading(newHeading) {
    this.setState(() => {
      return {
        heading: newHeading
      }
    })
  }

  _parkingSpot() {
    const coordinatesWithHeading = Object.assign(
      {},
      this.state.position.coords,
      { heading: this.state.heading }
    )
    return new StreetParkingSpot(coordinatesWithHeading, new Navigator())
  }


  render() {
    if(this.state.position && !this.state.heading) {
      return (
        <CompassView setHeading={this.setHeading.bind(this)}/>
      )
    } else if (this.state.position && this.state.heading){
      return (
        <ParkedView parkingSpot={this._parkingSpot()}/>
      )
    } else{
      return (
        <HomeView setLocation={this.setLocation.bind(this)}/>
      )
    }
  }
}
