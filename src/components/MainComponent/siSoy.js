import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'

const useStyles = makeStyles(() => ({
  root: {
    textAlign: 'center'
  }
}))

export default function Main({
  dispatch,
  selected,
  confirmed
}) {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <p><span role="img" aria-label="hi">👋</span> {selected.name}</p>
      <p>
        Confirmo que soy <b>{selected.name}</b> y que si me equivoco, puedo dejar a alguien sin regalo
        <span role="img" aria-label="cry">😢</span>
      </p>
      <FormControlLabel
        control={
          <Checkbox
            checked={confirmed}
            onChange={ev => {
              dispatch({
                type: 'agree',
                val: ev.target.checked
              })
            }}
            value="yes"
            inputProps={{
              'aria-label': 'primary checkbox',
            }}
          />
        }
        label={`En serio si soy o tengo permiso de ver el amigo secreto de ${selected.name}`}
      />
    </div>
  )
}