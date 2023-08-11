import { MapContainer, TileLayer } from "react-leaflet";
import Clusters from "./Clusters";
import "leaflet/dist/leaflet.css";
// import { useState, useEffect, useMemo} from "react";

export default function Map({ users }) {
  const boundsMap = [
    [-90, -180], // Southwest coordinates
    [90, 180], // Northeast coordinates
  ];

  return (
    <div style={{height: 'min(50vw, 100vh)'}}>
    <MapContainer
      center={[0, 0]}
      zoom={2}
      minZoom={2}
      zoomControl={true}
      scrollWheelZoom={true}
      maxBounds={boundsMap}
      maxBoundsViscosity={0.7}
      style={{height:'100%'}}
    >
    
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://b.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Clusters users={users} />
    </MapContainer>
    </div>
  );
}
