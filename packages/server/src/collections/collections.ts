import { CollectionReference, DocumentSnapshot } from 'firebase-admin/firestore';
import _ = require('lodash');
import { SnakeToCamelCaseNested, IUser, IPost, IStory } from './types';
import admin from '../service';

const firestore = admin.firestore();

const collections = {
  users: getCollectionWithCoverter<IUser>(firestore.collection('users')),
  stories: getCollectionWithCoverter<IStory>(firestore.collection('stories')),
  posts: getCollectionWithCoverter<IPost>(firestore.collection('posts')),
};

function getCollectionWithCoverter<T extends { [key: string]: any }>(collection: CollectionReference) {
  const converter = {
    toFirestore(data: SnakeToCamelCaseNested<T>) {
      return snackeCaseKeysDeep(data);
    },

    fromFirestore(documentSnapshot: DocumentSnapshot) {
      return camelCaseKeysDeep(documentSnapshot.data() as T);
    },
  };

  return collection.withConverter<SnakeToCamelCaseNested<T>>(converter);
}

function camelCaseKeysDeep(obj: any): any {
  if (_.isEmpty(obj)) {
    return obj;
  } else if (Array.isArray(obj)) {
    return obj.map((current) => camelCaseKeysDeep(current));
  } else if (typeof obj === 'object') {
    const newObj: any = {};

    _.forEach(obj, (value, key) => {
      newObj[_.camelCase(key)] = camelCaseKeysDeep(value);
    });

    return newObj;
  }

  return obj;
}

function snackeCaseKeysDeep(obj: any): any {
  if (_.isEmpty(obj)) {
    return obj;
  } else if (Array.isArray(obj)) {
    return obj.map((current) => snackeCaseKeysDeep(current));
  } else if (typeof obj === 'object') {
    const newObj: any = {};

    _.forEach(obj, (value, key) => {
      newObj[_.snakeCase(key)] = snackeCaseKeysDeep(value);
    });

    return newObj;
  }

  return obj;
}

export default collections;
