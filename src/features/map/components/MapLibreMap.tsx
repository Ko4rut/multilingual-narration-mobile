import {
    Camera,
    Map,
    type CameraRef,
} from "@maplibre/maplibre-react-native";

import {
    useEffect,
    useState,
} from "react";

import {
    StyleSheet,
} from "react-native";

import {
    OPEN_STREET_MAP_STYLE,
} from "../constants/mapStyle";

import type {
    MapProps,
} from "../types";

import {
    UserLocationMarker,
} from "./UserLocationMarker";



export function MapLibreMap({
    latitude,
    longitude,
    cameraRef,

}: MapProps) {


    const [
        isMapLoaded,
        setIsMapLoaded
    ] = useState(false);



    const hasValidLocation =
        latitude !== undefined &&
        longitude !== undefined;



    // Khi GPS thay đổi
    // camera di chuyển theo user

    useEffect(() => {

        if (
            isMapLoaded &&
            hasValidLocation
        ) {

            cameraRef.current?.easeTo({

                center: [
                    longitude,
                    latitude,
                ],

                duration: 500,

            });

        }


    }, [
        isMapLoaded,
        latitude,
        longitude,
    ]);



    return (

        <Map

            style={styles.map}

            mapStyle={
                OPEN_STREET_MAP_STYLE
            }


            attribution={false}

            compass={false}

            logo={false}


            onDidFinishLoadingStyle={() => {

                console.log(
                    "Map style loaded"
                );

                setIsMapLoaded(true);

            }}

        >

            <Camera
                ref={cameraRef}

                initialViewState={{
                    center: [
                        108.2068,
                        16.0471,
                    ],

                    zoom: 13,
                }}
            />



            {
                hasValidLocation && (

                    <UserLocationMarker

                        latitude={latitude}

                        longitude={longitude}

                    />

                )
            }



        </Map>

    );
}



const styles = StyleSheet.create({

    map: {
        flex: 1,
    },

});