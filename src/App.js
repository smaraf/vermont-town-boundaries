/* global navigator */

import React, { Component } from 'react';
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
  Polygon,
} from 'react-google-maps';

import uuidv from 'uuid/v4';

import rawData from './raw-data.json';
import './App.css';

const MyMapComponent = withScriptjs(withGoogleMap((props) => {
  const polygons = rawData.features
    .map(v => ({
      name: v.properties.TOWNNAME,
      paths: v.geometry.coordinates[0].map(c => ({
        lng: Math.round(c[0] * 100000000) / 100000000,
        lat: Math.round(c[1] * 100000000) / 100000000,
      })),
    }));

  const getRandomColor = () => {
    const myGuid = uuidv();
    return `#${myGuid.substring(myGuid.length - 6)}`;
  };

  return (
    props.currentLocation && (
    <GoogleMap defaultZoom={8} defaultCenter={props.currentLocation}>
      <Marker
        label={props.currentLocation.name}
        position={props.currentLocation}
      />
      {polygons.map(p => (
        <Polygon
          options={{
                fillColor: getRandomColor(),
                strokeColor: 'lightgray',
              }}
          defaultVisible
          paths={p.paths}
          onClick={(e) => {
                props.onPolyClick(e, p);
              }}
        />
          ))}
    </GoogleMap>
    )
  );
}));

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLocation: null,
    };
  }

  onPolyClick(e, p) {
    this.setState({
      currentLocation: {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        name: p.name,
      },
    });
  }

  render() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        currentLocation: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          name: 'You are here',
        },
      });
    });

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Vermont Town Boundaries</h1>
        </header>
        <MyMapComponent
          isMarkerShown
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyDdLN5rUnBNrqGEUY0ye87LYDLELiwjRCI"
          loadingElement={<div style={{ height: '100%' }} />}
          containerElement={<div style={{ height: '600px' }} />}
          mapElement={<div style={{ height: '100%' }} />}
          currentLocation={this.state.currentLocation}
          onPolyClick={(e, p) => {
            this.onPolyClick(e, p);
          }}
        />
      </div>
    );
  }
}
