import createModule from './index';
import baseModule from './module';

/*
 * Saves the specified file to the IndexedDB store where 
 * the emulator can pick it up. Will overwrite any existing
 * file with the same fileName. Shouldn't be done while the 
 * emulator is running.
 *
 * - fileName should be the rom 'goodname' for the title the save is 
 * for, along with the appropriate extension for the save type. 
 * For example: `Super Smash Bros. (U) [!].sra'
 * - fileData should be an arraybuffer containing the file data.
 */
const putSaveFile = function(fileName, fileData) {
  
  const connection = indexedDB.open('/mupen64plus');

  connection.onsuccess = (e) => {
    const db = e.target.result;
    const transaction = db.transaction('FILE_DATA', 'readwrite');
    const store = transaction.objectStore('FILE_DATA');

    const toSave = {
      contents: new Int8Array(fileData),
      timestamp: new Date(Date.now()),
      mode: 33206 // whatever this means
    };

    const savePath = '/mupen64plus/saves/' + fileName;
    store.put(toSave, savePath);
  }
}

const createMupen64PlusWeb = function(extraModuleArgs) {

  console.log(baseModule);
  const m = Object.assign({}, baseModule, extraModuleArgs);

  console.log(m);
  console.log("createMupen64PlusWeb main");

  if (!m.canvas) {
    throw "No canvas element provided for mupen64PlusWeb to use!";
  }

  if (!m.romData) {
    throw "No rom specified for emulation!";
  }

  if (!m.coreConfig.emuMode || m.coreConfig.emuMode < 0 || m.coreConfig.emuMode > 3) {
    m.coreConfig.emuMode = 0;
  }
  
  // As a default initial behavior, pop up an alert when webgl context is lost. To make your
  // application robust, you may want to override this behavior before shipping!
  // See http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.15.2
  m.canvas.addEventListener("webglcontextlost", function(e) { alert('WebGL context lost. You will need to reload the page.'); e.preventDefault(); }, false);

  console.log("createModule: %o", createModule);
  
  return createModule(m);
}

export {
  putSaveFile
}
export default createMupen64PlusWeb;

