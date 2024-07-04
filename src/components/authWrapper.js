import React, { useState } from 'react'

const authWrapper = ({children}) => {
let [loading,setLoading]=useState(true)

  return (
    <div>
      {loading ? <>Loading....</>:children}
    </div>
  )
}

export default authWrapper
