// @ts-nocheck
import { Box } from "@chakra-ui/react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L, { Map } from "leaflet";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MESSAGE } from "@component/constants/message";

const genericIcon = L.icon({
  iconUrl: MESSAGE.LEAFLETMAP.ICON_URL,
  iconSize: MESSAGE.LEAFLETMAP.ICON_SIZE,
  iconAnchor: MESSAGE.LEAFLETMAP.ICON_ANCHOR,
  popupAnchor: MESSAGE.LEAFLETMAP.POPUP_ANCHOR,
  shadowUrl: MESSAGE.LEAFLETMAP.SHADOW_URL,
  shadowSize: MESSAGE.LEAFLETMAP.SHADOW_SIZE,
});

const LeafletMap = ({ position }) => {
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    if (map) {
      setInterval(function () {
        map.invalidateSize();
      }, MESSAGE.LEAFLETMAP.INTERVAL);
    }
  }, [map]);

  const mapRef = useRef<L.Map | null>(null);

  return (
    <Box w={MESSAGE.WIDTH.FULL} height={MESSAGE.LEAFLETMAP.HEIGHT}>
      <MapContainer
        center={position}
        zoom={MESSAGE.LEAFLETMAP.ZOOM}
        ref={mapRef}
        whenReady={() => {
          if (mapRef.current) {
            setMap(mapRef.current);
          }
        }}
        style={MESSAGE.LEAFLETMAP.STYLE}
      >
        <TileLayer
          url={MESSAGE.LEAFLETMAP.TILE_LAYER_URL}
          attribution={MESSAGE.LEAFLETMAP.ATTRIBUTION}
        />
        <Marker position={position} icon={genericIcon} />
      </MapContainer>
    </Box>
  );
};

export default LeafletMap;
