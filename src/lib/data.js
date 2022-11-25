import * as firebase from 'firebase/app'

import 'firebase/firestore'

let db = null

export default function(config = {}) {
  if (db) return db

  firebase.initializeApp(config)

  db = {
    save(type, data, id) {
      let objectToSave = {
        ...data,
        creationDate: Date.now()
      }
  
      if (id) {
        return db.fs.collection(type).doc(id).set(objectToSave)
          .then(() => ({
            ...objectToSave,
            id: id
          }))
      } else {
        return db.fs.collection(type).add(objectToSave)
          .then(docRef => ({
            ...objectToSave,
            id: docRef.id
          }))
      }
    },
  
    saveWithId(type, id, data) {
      return db.fs.collection(type).doc(id).set(data)
    },
  
    get(type, params, { orderBy, orderType, limit } = {}) {
      if (!params) {
        // Get all documents
        return db.fs.collection(type).get()
          .then(query => query.docs.map(data => ({
              ...data.data(),
              id: data.id
            })
          ))
      } else if (typeof params === 'string') {
        // Get document by id
        return db.fs.collection(type).doc(params).get()
          .then(data => ({
            ...data.data(),
            id: data.id
          }) )
      } else if (Array.isArray(params)) {
        let query = params.reduce(
          (acummulatedQuery, param) => acummulatedQuery.where(param[0], param[1], param[2]),
          db.collection(type)
        )
  
        if (orderBy) {
          query = query.orderBy(orderBy, orderType)
        }
  
        if (limit) {
          query = query.limit(limit)
        }
  
        return query.get()
          .then(query => query.docs.map(data => ({
              ...data.data(),
              id: data.id
            })
          ))
      }
    },
  
    update(type, id, doc) {
      return db.fs.collection(type).doc(id).update(doc)
    },
  
    remove(type, id) {
      return db.fs.collection(type).doc(id).delete()
    },
  
    exists(type, id) {
      return db.fs.collection(type).doc(id).exists
    },

    delCollection(type) {
      return db.fs.collection(type).get()
        .then(query => query.docs.map(data => ({
            ...data.data(),
            id: data.id
          })
        ))
        .then(all => Promise.all(all.map(({ id }) =>
          db.fs.collection(type).doc(id).delete()
        )))
    }
  }

  db.fs = firebase.firestore()
  db.fs.settings({
    timestampsInSnapshots: false
  })

  return db
}
