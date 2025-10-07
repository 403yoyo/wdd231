import { fetchJSON } from '../utils.js';

export async function getTutorials(){
  return fetchJSON('/project/learning-hub/data/tutorials.json');
}

export async function loadFeatured(){
  const all = await getTutorials();
  // return array sorted by popularity (if available)
  return all;
}