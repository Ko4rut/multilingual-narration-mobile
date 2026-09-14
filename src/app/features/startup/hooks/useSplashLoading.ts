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
    new Animated.Value(0)
  ).current;



  useEffect(() => {

    const timer = setInterval(() => {

      setActiveDot(
        (prev) => (prev + 1) % DOT_COUNT
      );

    }, DOT_INTERVAL);


    return () => clearInterval(timer);

  }, []);



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

    const animation = Animated.loop(

      Animated.sequence([

        Animated.timing(opacity, {

          toValue: 1,

          duration: 700,

          useNativeDriver: true,

        }),


        Animated.timing(opacity, {

          toValue: 0.4,

          duration: 700,

          useNativeDriver: true,

        }),

      ])

    );


    animation.start();


    return () => {
      animation.stop();
    };


  }, [opacity]);



  return {
    activeDot,
    loadingText,
    opacity,
  };

}