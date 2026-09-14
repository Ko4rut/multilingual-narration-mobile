import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import { Stack } from "expo-router";

import { useEffect } from "react";


SplashScreen.preventAutoHideAsync();


export default function RootLayout(){

 const [loaded] = useFonts({

   "Lora-Regular":
      require("@/assets/fonts/Lora-Regular.ttf"),


   "Lora-Bold":
      require("@/assets/fonts/Lora-Bold.ttf"),

 });


 useEffect(()=>{

   if(loaded){
     SplashScreen.hideAsync();
   }

 },[loaded]);



 if(!loaded){
   return null;
 }


 return (
   <Stack
    screenOptions={{
      headerShown:false
    }}
   />
 );

}