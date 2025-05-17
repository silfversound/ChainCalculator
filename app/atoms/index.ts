import AsyncStorage from '@react-native-async-storage/async-storage';
import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

export const isLoggedInAtom = atom<boolean>(false); 

export const selectedNodeAtom = atom<any | null>(null);

export const contentAtom = atom<any | null>(null);

const storage = createJSONStorage<string>(() => AsyncStorage);
export const authTokenAtom = atomWithStorage('authToken', '', storage);

const storedCircle = createJSONStorage<any>()
const contentCircle: any = [] // anything JSON serializable
export const courseCircleAtom = atomWithStorage('courseCircle', contentCircle, storedCircle)

const storedProperties = createJSONStorage<any>()
const contentProperties: any = [] // anything JSON serializable
export const contentPropertiesAtom = atomWithStorage('contentProperties', contentProperties, storedProperties)

export default isLoggedInAtom;