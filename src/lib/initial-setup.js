const all = [
  ['Alejandra', 'Daniela '],
  ['Alejandra', 'María Paula '],
  ['Alejandra', 'Alejandra '],
  ['Macha', 'Macha'],
  ['Macha', 'Esteban '],
  ['Macha', 'Alonso'],
  ['Silvia', 'Gabriel '],
  ['Silvia', 'Silvia'],
  ['Silvia', 'Miguel'],
  ['Lourdes', 'Lourdes'],
  ['Lourdes', 'Fabri '],
  ['Lourdes', 'Dayanna'],
  ['Lourdes', 'Anyo'],
  ['Lourdes', 'Nico'],
  ['Meche', 'José'],
  ['Meche', 'Meche'],
  ['Meche', 'Sebas'],
  ['Meche', 'Vale '],
  ['Meche', 'Jime'],
  ['Meche', 'Daniel'],
  ['Meche', 'María J'],
  ['Meche', 'Fabiola'],
  ['Nalda', 'Nalda'],
  ['Nalda', 'Andrés '],
  ['Nalda', 'Laura '],
  ['Nalda', 'Matías'],
  ['Nalda', 'Jose Mario'],
  ['Nalda', 'Tefa'],
  ['Diego', 'Santiago'],
  ['Marta', 'Marta'],
  ['Marta', 'Kry'],
  ['Marta', 'Nono'],
  ['Marta', 'Feli'],
  ['Marta', 'David'],
  ['Marta', 'Andre'],
  ['Franco', 'Franco'],
  ['Carlos', 'Leo'],
  ['Carlos', 'Annie'],
  ['Carlos', 'Carlos'],
]


const getShuffledArr = arr => {
  const newArr = arr.slice()
  for (let i = newArr.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr
}

function setup(db) {
  return Promise.all(
    all.map(([family, name]) =>
      db.save('personas', {
        familia: family,
        name
      })
    )
  )
  .then(allSaved => {
    const copyPersonas = getShuffledArr(allSaved)

    return Promise.all(copyPersonas.map((persona, idx) => {
      const possibleTo = allSaved.filter(single =>
        !single.taken && persona.familia !== single.familia
      )

      if (!possibleTo.length) {
        console.log('Iteración fallida', persona, `${idx} de ${copyPersonas.length}`)
        throw new Error('Error!')
      }
      const givesToIndex = Math.floor(Math.random() * Math.floor(possibleTo.length - 1))
      const idxInOriginalArray = allSaved.findIndex(p => p.id === possibleTo[givesToIndex].id)
      allSaved[idxInOriginalArray].taken = true
      return db.update('personas', persona.id, {
        givesTo: possibleTo[givesToIndex].id
      })
    }))
  })
}

function check(db) {
  return db.get('personas')
    .then(everybody => {
      const byId = everybody.reduce((accum, { id }) => ({
        ...accum,
        [id]: false
      }), {})

      everybody.forEach(single => {
        if (single.id === single.givesTo) {
          console.log(single, 'se da a el mismo')
        }
        byId[single.givesTo] = true
      })

      console.log(Object.keys(byId).length, byId)

      return true
    })
}

export default function own(db) {
  db.get('settings')
    .then(s => {
      if (s[0].forceReset) {
        console.log('FORCING RESET!!')
        db.delCollection('personas')
          .then(() => setup(db)) 
          .then(() => check(db))
          .then(() => {
            db.update('settings', s[0].id, {
              forceReset: false
            })
          })
      } else {
        console.log('All good! Not forcing reset')
      }
    })
}