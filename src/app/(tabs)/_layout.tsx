import { Tabs } from "expo-router";

export default function TabLayout(){

 return (

  <Tabs>

    <Tabs.Screen
      name="explore"
      options={{
        title:"Explore"
      }}
    />


    <Tabs.Screen
      name="map"
      options={{
        title:"Map"
      }}
    />


    <Tabs.Screen
      name="qr-scan"
      options={{
        title:"QR Scan"
      }}
    />


    <Tabs.Screen
      name="offline"
      options={{
        title:"Offline"
      }}
    />


    <Tabs.Screen
      name="settings"
      options={{
        title:"Settings"
      }}
    />

  </Tabs>

 );

}