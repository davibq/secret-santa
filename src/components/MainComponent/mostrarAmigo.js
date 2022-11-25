import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import DA from '../../lib/data'

const useStyles = makeStyles(() => ({
  root: {
    textAlign: 'center'
  },
  secretSanta: {
    animation: '$rotate-center 0.6s ease-in-out both',
    borderTop: '2px solid #0f0',
    borderBottom: '2px solid #f00',
    borderLeft: '2px solid #0f0',
    borderRight: '2px solid #f00',
    fontSize: '24px',
    fontWeight: 'bolder',
    padding: '12px'
  },
  '@keyframes rotate-center': {
    '0%': {
      transform: 'rotate(0)'
    },
    '100%': {
      transform: 'rotate(360deg)'
    }
  },
  gif: {
    maxWidth: '360px',
    width: '100%'
  },
  msg: {
    color: 'rgba(0, 0, 0, .87)',
    fontSize: '12px',
    fontWeight: 'bolder',
  }
}))

export default function Main({
  dispatch,
  selected,
  people
}) {
  const classes = useStyles()
  const [match, setMatch] = useState({
    familia: ''
  })
  const [drumsAnims, setDrumsAnims] = useState([])
  const [drumsAnims2, setDrumsAnims2] = useState([])

  useEffect(() => {
    DA().get('personas', selected.givesTo)
      .then(to => {
        setMatch(to)
      })
  }, [selected])

  useEffect(() => {
    if (drumsAnims.length === 5) return

    const i = drumsAnims.length
    setTimeout(() => {
      setDrumsAnims([
        ...drumsAnims,
        (<span role="img" aria-label="drums" key={`drum-${i}`}>🥁</span>)
      ])
    }, 250 * i + 500)
  }, [drumsAnims])

  useEffect(() => {
    if (drumsAnims.length < 5 || drumsAnims2.length > 7) return

    const i = drumsAnims2.length

    setTimeout(() => {
      setDrumsAnims2([
        ...drumsAnims2,
        i
      ])

      if (drumsAnims2.length === 7) {
        const objDiv = document.getElementById('top-content')
        objDiv.scrollTop = objDiv.scrollHeight
        DA().update('personas', selected.id, {
          seen: true
        })
      }
    }, 250 * i + 500)
  }, [drumsAnims, drumsAnims2, selected])

  return (
    <div className={classes.root}>
      <p className={classes.msg}>Sólo lo va a poder ver una vez, entonces aprendaselo bien...</p>
      <p>Su amigo secreto es</p>
      <p>
      {drumsAnims.map(d => d)}
      </p>
      {drumsAnims.length === 5 && match.familia && (
        <>
          <p>
            De la familia de {match.familia}
            <span role="img" aria-label="surprised"> 😱</span>
          </p>

          {!!drumsAnims2.length && (
            <>
              {drumsAnims2.length > 0 && <p>y es...</p>}
              <p>
                {drumsAnims2.map((_, idx) => (
                  idx > 1 && idx <= 6 ? (
                    <span role="img" aria-label="drums" key={`drum2-${idx}`}>🥁</span>
                  ) : null
                ))}
              </p>
              {drumsAnims2.length > 6 && ( 
                <>
                  <img src="santa.gif" className={classes.gif} alt="" />
                  <p className={classes.secretSanta}>
                    {match.name}
                  </p>
                  <Button variant="outlined" onClick={() => {window.location.reload()}}>Listo! Ya lo memoricé</Button>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}