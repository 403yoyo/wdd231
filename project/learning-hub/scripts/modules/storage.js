// Small storage helpers
export function save(key, value){
  localStorage.setItem(key, JSON.stringify(value));
}
export function load(key, defaultValue=null){
  const v = localStorage.getItem(key);
  return v ? JSON.parse(v) : defaultValue;
}
export function remove(key){
  localStorage.removeItem(key);
}