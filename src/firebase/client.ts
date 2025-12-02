import { initializeFirebase } from '.';

const { auth, db } = initializeFirebase();

export { auth, db };
