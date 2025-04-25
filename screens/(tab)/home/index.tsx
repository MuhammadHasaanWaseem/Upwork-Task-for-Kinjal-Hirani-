import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useAuth } from '@/provider/AuthProviders'

export default  () => {
  const {logOut} =useAuth();
  return (
    <View style ={{flex:1,alignItems:'center',justifyContent:'center',alignContent:'center'}}>
              <Text style={{color:'white'}}>Welcome to Home Screen</Text>
      <TouchableOpacity onPress={logOut} style={{backgroundColor:'white',marginTop:10,borderRadius:18}}>
        <Text style={{color:'black',padding:14,textAlign:'center',fontWeight:'900'}}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

