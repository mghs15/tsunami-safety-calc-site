
//Reference: Slippy map tilenames
//https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
const lon2tile = (lon,zoom) => { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); }
const lat2tile = (lat,zoom) => { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); }
const lon2tiled = (lon,zoom) => { return ((lon+180)/360*Math.pow(2,zoom)); }
const lat2tiled = (lat,zoom) => { return ((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)); }

const getRasterTilePixel = (pt, zl=17, tileUrl, option={}) => {
  // pt = {lng: <number>, lat: <number>}
  const xd = lon2tiled(pt.lng, zl);
  const yd = lat2tiled(pt.lat, zl);
  
  const tilePos = {"x": xd, "y": yd};

  const y = Math.floor(tilePos.y);
  const pY = Math.floor((tilePos.y - y) * 256);
  
  const x = Math.floor(tilePos.x);
  const pX = Math.floor((tilePos.x - x) * 256);
  
  const img = new Image(); 
  img.crossOrigin = "Anonymous";
  img.src = tileUrl.replace(/\{z\}/, zl).replace(/\{x\}/, x).replace(/\{y\}/, y);
  
  return new Promise((resolve, reject) => {
    
    img.onload = () => {
    
      const _canvas = document.createElement("canvas");
      _canvas.width = option.width || 256;
      _canvas.height = option.heght || 256;
      
      const ctx = _canvas.getContext("2d");

      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, 256, 256);
      const idx = (pY * 256 * 4) + (pX * 4);
      const r = imgData.data[idx + 0];
      const g = imgData.data[idx + 1];
      const b = imgData.data[idx + 2];
      
      resolve({r:r, g:g, b:b});
      
    }
    
    img.onerror = () => {
    
      reject(
        new Error('タイルの取得に失敗しました')
      );
      
    }
    
  });
    
}

