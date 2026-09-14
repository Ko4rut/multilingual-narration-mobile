// startup/hooks/useStartup.ts

import { useEffect, useState } from "react";
import { Asset } from "expo-asset";
import { useFonts } from "expo-font";

import { startupImages } from "../constants/startup-assets";


export function useStartup(){

  const [ready,setReady] = useState(false);


  const [fontsLoaded] = useFonts({

    "Lora-Regular":
      require("@/assets/fonts/Lora-Regular.ttf"),

    "Lora-Bold":
      require("@/assets/fonts/Lora-Bold.ttf"),

  });

  const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

useEffect(()=>{

  console.log("fontsLoaded:", fontsLoaded);


  if(!fontsLoaded){
    return;
  }


  async function prepare(){

    console.log("Start loading assets");


    try{

      await Asset.loadAsync(startupImages);


      console.log("Assets loaded");

      // Fake loading 3 seconds
      await delay(3000);
      setReady(true);


    }
    catch(error){

      console.log(
        "Startup error:",
        error
      );

      setReady(true);

    }

  }


  prepare();


},[fontsLoaded]);



  return {
    ready
  };

}