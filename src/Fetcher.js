export async function fetchComponents(partClassName) {
  let status = false;
  let json = {};

  let cache = sessionStorage.getItem(partClassName);
  if (cache != null) {
    json = JSON.parse(cache);
    status = true;
  } else {
    let response = await fetch("http://localhost:3001/getCatalog/" + partClassName).catch(
    err => {
      console.log("Tried to fetch " + partClassName + ": " + err.message);
    }
  )
  if (typeof response !== 'undefined') {
    if (response.ok) { 
      json = await response.json();
      sessionStorage.setItem(partClassName, JSON.stringify(json));
      status = true;
    } else {
      console.log("HTTP error: " + response.status)
    }
  }
  }
  
  return {status, json};
}
