import { useReducer, useEffect } from 'react'
import DB from '../lib/data'

const reducerFns = {
  toggleLoading: state => ({
    ...state,
    loading: !state.loading
  }),
  setPeople: (state, { people }) => ({
    ...state,
    people
  }),
  setFamiliyKey: (state, { key, obj }) => ({
    ...state,
    people: {
      ...state.people,
      [key]: {
        ...state.people[key],
        ...obj
      }
    }
  }),
  setIndividual: (state, { individual }) => ({
    ...state,
    selected: individual
  }),
  agree: (state, { val }) => ({
    ...state,
    confirmed: val
  })
}

export default function useSS() {
  const reducer = (state, { type, ...payload }) => ({
    ...state,
    ...reducerFns[type](state, payload)
  })

  const [state, dispatch] = useReducer(reducer, {
    loading: true,
    people: {},
    selected: null,
    confirmed: false
  })

  useEffect(() => {
    DB().get('personas')
      .then(personas => {
        dispatch({ type: 'toggleLoading' })
        dispatch({
          type: 'setPeople',
          people: personas.reduce((accum, individual) => ({
            ...accum,
            [individual.familia]: {
              expanded: false,
              individuals: [
                ...((accum[individual.familia] || {}).individuals) || [],
                individual
              ]
            }
          }), {}),
        })
      })
  }, [])

  return [state, dispatch]
}