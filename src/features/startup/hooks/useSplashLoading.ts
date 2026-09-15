import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";


const SPLASH_MESSAGES = [
  "PREPARING AUDIO GUIDE",
  "LOADING DESTINATIONS",
  "PREPARING YOUR JOURNEY",
];


const DOT_COUNT = 3;
const DOT_INTERVAL = 450;
const MESSAGE_INTERVAL = 800;


export function useSplashLoading() {

  const [activeDot, setActiveDot] = useState(0);

  const [loadingText, setLoadingText] = useState(
    SPLASH_MESSAGES[0]
  );


  const opacity = useRef(
    new Animated.Value(0.4)
  ).current;



  useEffect(() => {

    let index = 0;


    const timer = setInterval(() => {

      index++;


      if(index < SPLASH_MESSAGES.length){

        setLoadingText(
          SPLASH_MESSAGES[index]
        );

      }


    }, MESSAGE_INTERVAL);


    return () => clearInterval(timer);


  }, []);



  useEffect(() => {

    let cancelled = false;
    opacity.setValue(0.4);

    const animation = Animated.sequence([

        Animated.timing(opacity, {

          toValue: 1,

          duration: DOT_INTERVAL / 2,

          useNativeDriver: true,

        }),


        Animated.timing(opacity, {

          toValue: 0.4,

          duration: DOT_INTERVAL / 2,

          useNativeDriver: true,

        }),

      ]);


    // Advance only after this dot completes its pulse.
    animation.start(({ finished }) => {
      if (finished && !cancelled) {
        setActiveDot((prev) => (prev + 1) % DOT_COUNT);
      }
    });


    return () => {
      cancelled = true;
      animation.stop();
    };


  }, [activeDot, opacity]);



  return {
    activeDot,
    loadingText,
    opacity,
  };

}
