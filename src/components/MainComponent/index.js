import React from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Button from '@material-ui/core/Button'
import useSecretSanta from '../../lib/main'
import Hola from './hola'
import SiSoy from './siSoy'
import MostrarAmigo from './mostrarAmigo'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '100vh',
    width: '100%',
  },
  topContent: {
    maxHeight: '90vh',
    overflowY: 'scroll'
  },
  content: {
    maxHeight: '70vh',
    padding: '0 24px 24px 24px'
  },
  actionsWrapper: {
    bottom: '0',
    display: 'flex',
    maxHeight: '10vh',
    position: 'fixed',
    width: '100%'
  }
}))

const NextButton = withStyles({
  root: {
    padding: '16px 0',
    width: '100%'
  }
})(Button)
const BackButton = withStyles({
  root: {
    flexShrink: '0',
    padding: '16px 0',
    marginRight: '8px',
    width: '30%'
  }
})(Button)

function getSteps() {
  return ['Hola', 'Si soy?', 'Su amigo secreto es 🥁']
}

function getStepContent(
  stepIndex,
  [
    {
      loading,
      people,
      selected,
      confirmed
    }, 
    dispatch
  ]
) {
  switch (stepIndex) {
    case 0:
      return (
        <Hola
          loading={loading}
          people={people}
          dispatch={dispatch}
        />
      )
    case 1:
      return (
        <SiSoy
          selected={selected}
          dispatch={dispatch}
          confirmed={confirmed}
        />
      )
    case 2:
      return (
        <MostrarAmigo
          selected={selected}
          people={people}
          dispatch={dispatch}
        />
      )
    default:
      return <p><span role="img" aria-label="poop">💩</span></p>
  }
}

export default function Main() {
  const classes = useStyles()
  const [activeStep, setActiveStep] = React.useState(0)
  const steps = getSteps()

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const ssState = useSecretSanta()
  const [{ selected, confirmed }] = ssState

  return (
    <div className={classes.root}>
      <div className={classes.topContent} id="top-content">
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div className={classes.content}>
          {getStepContent(activeStep, ssState)}
        </div>
      </div>
      <div className={classes.actionsWrapper}>
        {activeStep === 1 && (
          <BackButton variant="outlined" color="primary" onClick={handleBack}>
            &lt;&lt; NOO
          </BackButton>  
        )}
        {activeStep === 0 && (
          <NextButton variant="contained" color="primary" onClick={handleNext} disabled={!selected}>
            {selected ? `Soy ${selected.name} >>` : 'Continuar >>'}
          </NextButton>
        )}
        {activeStep === 1 && (
          <NextButton variant="contained" color="primary" onClick={handleNext} disabled={!confirmed}>
            {selected ? `Ver amigo secreto de ${selected.name}` : 'Continuar >>'}
          </NextButton>
        )}
      </div>
    </div>
  )
}