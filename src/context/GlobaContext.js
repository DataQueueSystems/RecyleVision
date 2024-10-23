import { StyleSheet, Text, View } from 'react-native'
import React, { createContext, useContext, useState } from 'react'

const Authcontext=createContext()
export const AuthContextProvider=({children})=>{
  const [isLogin, setIsLogin] = useState(false);

    return(
       <Authcontext.Provider
       value={{
        isLogin,
        setIsLogin,
      }}>
         {children}
       </Authcontext.Provider>
    )
}

export const useAuthContext=()=>useContext(Authcontext)