import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'center'
  },
  sayHi: {
    fontSize: '14px',
    marginBottom: '0'
  },
  instructions: {
    fontSize: '22px',
    marginTop: '0'
  },
  nested: {
    paddingLeft: theme.spacing(8),
  },
  crossed: {
    textDecoration: 'line-through'
  }
}))

function ListFamily({ name, family, toggleExpandFamily, setIndividual }) {
  const classes = useStyles()
  return (
    <>
      <ListItem button onClick={toggleExpandFamily}>
        <ListItemText primary={`Familia de ${name}`} />
        {family.expanded ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={family.expanded} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {family.individuals.map(individual => (
            <ListItem disabled={individual.seen} button key={individual.name} className={classes.nested} onClick={() => setIndividual(individual)}>
              <ListItemText primary={`${individual.name}${individual.seen ? ' (visto)' : ''}`} />
            </ListItem>
          ))}
        </List>
      </Collapse>
      <Divider />
    </>
  )
}

export default function Main({
  dispatch,
  loading,
  people
}) {
  const classes = useStyles()
  const toggleFamily = key => {
    dispatch({
      type: 'setFamiliyKey',
      key,
      obj: {
        expanded: !people[key].expanded
      }
    })
  }

  const familiesSorted = Object.keys(people).sort()

  return (
    <div className={classes.root}>
      <p className={classes.sayHi}>
        Amigo secreto de la familia Quirós <span className={classes.crossed}>2019</span> <b>2022</b>
      </p>
      <p className={classes.instructions}>
        Identifíquese <span role="img" aria-label="inspector">🧐</span>
      </p>
      {loading && <p>Cargando...</p>}
      {!loading && (
        <List component="nav" aria-label="pipol">
          {familiesSorted.map(familyKey => (
            <ListFamily
              key={familyKey}
              family={people[familyKey]}
              name={familyKey}
              toggleExpandFamily={() => {
                toggleFamily(familyKey)
              }}
              setIndividual={individual => dispatch({
                type: 'setIndividual',
                individual
              })}
            />
          ))}
        </List>
      )}
    </div>
  )
}
