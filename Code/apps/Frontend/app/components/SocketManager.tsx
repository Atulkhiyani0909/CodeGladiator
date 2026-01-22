'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useSocket } from '../store'

export function SocketManager() {
 const { connect } = useSocket();
const {userId} = useAuth();

useEffect(()=>{
    if(userId){
      connect(userId);  
    }
},[connect,userId])

return(<></>)

}

export default SocketManager
