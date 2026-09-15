import { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import WebView, { WebViewMessageEvent } from "react-native-webview";

type LeafletMapProps = {
  latitude?: number;
  longitude?: number;
  onSelect?: (latitude: number, longitude: number) => void;
};

const mapHtml = `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      rel="stylesheet"
      href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    />
    <style>
      html,
      body,
      #map {
        height: 100%;
        margin: 0;
      }

      .leaflet-control-attribution a:first-child {
        display: none;
      }

      .user-location-marker {
        width: 22px;
        height: 22px;
        border: 3px solid #ffffff;
        border-radius: 50%;
        background: #2563eb;
        box-shadow: 0 1px 6px rgba(15, 23, 42, 0.45);
      }
    </style>
  </head>
  <body>
    <div id="map"></div>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      const defaultCenter = [16.0471, 108.2068];
      const defaultZoom = 13;
      const map = L.map("map", {
        zoomControl: false,
      }).setView(defaultCenter, defaultZoom);
      const tileUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

      L.tileLayer(tileUrl, {
        // attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      let locationMarker;
      const locationIcon = L.divIcon({
        className: "user-location-marker-wrapper",
        html: '<div class="user-location-marker"></div>',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      function setLocation(latitude, longitude) {
        const point = [latitude, longitude];

        if (locationMarker === undefined) {
          locationMarker = L.marker(point, { icon: locationIcon }).addTo(map);
        } else {
          locationMarker.setLatLng(point);
        }

        map.setView(point);
      }

      map.on("click", function (event) {
        const selectedPoint = {
          latitude: event.latlng.lat,
          longitude: event.latlng.lng,
        };

        window.ReactNativeWebView.postMessage(
          JSON.stringify(selectedPoint),
        );
      });
    </script>
  </body>
</html>
`;

export function LeafletMap({
  latitude,
  longitude,
  onSelect,
}: LeafletMapProps) {
  const webViewRef = useRef<WebView>(null);
  const webViewLoadedRef = useRef(false);
  const latestLocationRef = useRef<
    { latitude: number; longitude: number } | undefined
  >(undefined);

  function updateLocationOnMap(latitude: number, longitude: number) {
    if (!webViewLoadedRef.current) {
      return;
    }

    const javascript = `
      setLocation(${latitude}, ${longitude});
      true;
    `;

    webViewRef.current?.injectJavaScript(javascript);
  }

  useEffect(() => {
    if (latitude === undefined || longitude === undefined) {
      return;
    }

    latestLocationRef.current = { latitude, longitude };
    updateLocationOnMap(latitude, longitude);
  }, [latitude, longitude]);

  function handleMessage(event: WebViewMessageEvent) {
    try {
      const selectedPoint = JSON.parse(event.nativeEvent.data);

      onSelect?.(selectedPoint.latitude, selectedPoint.longitude);
    } catch {
      // Ignore invalid messages sent by the WebView.
    }
  }

  return (
    <WebView
      ref={webViewRef}
      source={{ html: mapHtml }}
      onLoad={() => {
        webViewLoadedRef.current = true;

        const latestLocation = latestLocationRef.current;
        if (latestLocation !== undefined) {
          updateLocationOnMap(
            latestLocation.latitude,
            latestLocation.longitude,
          );
        }
      }}
      onMessage={handleMessage}
      javaScriptEnabled
      style={styles.map}
    />
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
