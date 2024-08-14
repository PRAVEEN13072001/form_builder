import React, { useState } from 'react'

const authWrapper = ({children}) => {
let [loading,setLoading]=useState(true)

  return (
    <div>
      {loading ? <div>Loading....</div>:children}
    </div>
  )
}

export default authWrapper
