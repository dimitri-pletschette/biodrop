import './Home.css'

<<<<<<< HEAD:src/Components/Home/Home.js
import React, { useState, useEffect } from 'react'
=======
import React, { useEffect, useState } from 'react'
import { Avatar } from 'primereact/avatar'
>>>>>>> 7fa9d4d (Delete blank line):src/Components/Home.js
import { ProgressBar } from 'primereact/progressbar'

import Placeholders from './Placeholders'
import Users from './Users'

function Home() {
  const [showProgress, setShowProgress] = useState(true)
  const [list, setList] = useState([])
  const [skeleton, setskeleton] = useState(true)

  useEffect(() => {
    fetch('/list.json')
      .then((response) => response.json())
      .then((data) => data.sort((a, b) => a.username.localeCompare(b.username)))
      .then((data) => setList(data))
      .catch((error) => {
        console.log('Home useEffect', error)
        alert('An error occurred please try again later.')
      })
      .finally(() => {
        setShowProgress(false)
        setTimeout(() => {
          setskeleton(false)
        }, 500)
      })
  }, [])

  return (
    <main>
      {showProgress && <ProgressBar mode="indeterminate" />}
      {skeleton ? <Placeholders list={list} /> : <Users list={list} />}
    </main>
  )
}

export default Home
