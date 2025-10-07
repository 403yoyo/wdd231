export function fetchJSON(path){
  return fetch(path).then(r => {
    if(!r.ok) throw new Error(`Fetch ${path} failed: ${r.status}`);
    return r.json();
  });
}

export function el(tag, props={}, ...children){
  const e = document.createElement(tag);
  Object.assign(e, props);
  children.flat().forEach(c => e.append(typeof c === 'string' ? document.createTextNode(c) : c));
  return e;
}