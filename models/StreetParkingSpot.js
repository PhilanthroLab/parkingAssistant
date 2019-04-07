import StreetParkingRules from './StreetParkingRules'

Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

class StreetParkingSpot {

  /**
   * Constructor
   * @param {Coordinates} coordinates - Geolocation Web API Coordinate object
   * @param {Navigator} navigator - Reverse geocode API
   */
  constructor(coordinates, navigator){
    this._coordinates = coordinates
    this._navigator = navigator
    this._rules = new StreetParkingRules()
    this._calculateSide().catch(error => {
      console.log('Unable to calculate side of street: ' + error)
    })
  }

  location(){
    return {
      "latitude":  this._coordinates.latitude,
      "longitude": this._coordinates.longitude
    }
  }

  latitude() {
    return this._coordinates.latitude
  }

  longitude() {
    return this._coordinates.longitude
  }

  heading() {
    return this._coordinates.heading
  }

  getLocationInDirection(direction, distance){
    const dx = distance * Math.cos(Math.radians(direction))
    const dy = distance * Math.sin(Math.radians(direction))
    const deltaLongitude = dx / (111320 * Math.cos(Math.radians(this.latitude())))
    const deltaLatitude = dy / 110540
    const finalLongitude = this.longitude() + deltaLongitude
    const finalLatitude = this.latitude() + deltaLatitude
    return {
      latitude: finalLatitude,
      longitude: finalLongitude
    }
  }

  toTheRight() {
    return this.heading() - 90
  }

  toTheLeft() {
    return this.heading() + 90
  }

  isEven(streetNumber){
    return parseInt(streetNumber) % 2 === 0
  }

  async _calculateSide() {
    const distance = 20 // We always want to get a position 20 feet away
    const rightSideStreetLatLong = this.getLocationInDirection(this.toTheRight(), distance)
    const rightSideStreetAddr = await this._navigator.lookupAddress(rightSideStreetLatLong)

    const leftSideStreetLatLong = this.getLocationInDirection(this.toTheLeft(), distance * 2)
    const leftSideStreetAddr = await this._navigator.lookupAddress(leftSideStreetLatLong)

    this._side = this.isEven(rightSideStreetAddr.streetNumber) ? 'even' : 'odd'
  }

  timeRemaining(){
    if (this._side) {
      return this._rules.timeRemainingOnSide(new Date(), this._side)
    }
  }
}

export default StreetParkingSpot
