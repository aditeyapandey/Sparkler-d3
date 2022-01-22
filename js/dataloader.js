/**
 * Maintains global cache for a file already read.
 * If during the life of a server, the file has already been read before,
 * we store this file's data in the GLOBAL_CACHE.
 * 
 * GLOBAL_CACHE has some limitations. At any point of time
 * there can only be contents of 5 files maintained in this CACHE to
 * prevent excessive bloating of the CACHE.
 */
 const GLOBAL_CACHE = {
  atomicCounter: -1,
  keyQueue: [],
  data: {}
}
/**
 * Looks up for file data in cache. If cache missed,
 * goes and loads the data of the file and updates the cache.
 * 
 * @param {string} key: name of TSV file 
 * @returns 
 */
async function cacheLookup(key) {
  if (key in GLOBAL_CACHE.data) {
    console.log("CACHE HIT")
    return GLOBAL_CACHE.data[key];
  }

  const fileData = await readFile(key);
  const resultData = dataProcessorInternal(fileData);

  GLOBAL_CACHE.atomicCounter = GLOBAL_CACHE.atomicCounter + 1;
  const currentCacheKey = GLOBAL_CACHE.keyQueue[GLOBAL_CACHE.atomicCounter % 5];

  if (currentCacheKey !== undefined) {
    delete GLOBAL_CACHE.data[currentCacheKey];
  }
  GLOBAL_CACHE.keyQueue[GLOBAL_CACHE.atomicCounter % 5] = key;
  GLOBAL_CACHE.data[key] = resultData;
  return resultData;
}


async function readFile(fileName) {
  const jsonResponse = await d3.tsv(`data/${fileName}`);
  return jsonResponse;
}

function dataProcessorInternal(rawData) {
  const resultData = {
    "jsonData": [],
    "metaData":{},
    "controllerData":{
      "categorical":["stim", "celltype", "multiplets"],
      "quantitative":["tsne1", "tsne2", "sample", "cluster"]
    },
    "omitFields": ["barcode"]
  };
  resultData.jsonData = rawData;

  // Generate metaData from first element of rawData

  const firstElement = rawData[0];
  for (const key in firstElement) {
    if (resultData.omitFields.includes(key)) {
      continue;
    }
    else if (resultData.controllerData.categorical.includes(key)) {
      resultData.metaData[key] = {"dTypeName": "categorical", "range": new Set()};
    } else {
      resultData.metaData[key] = {"dTypeName": "quantitative", "range": [Number.MAX_VALUE, Number.MIN_VALUE]};
    }
  }

  // Fill up the range by iterating through the elements
  rawData.forEach(item => {
    for (const key in item) {
      if (resultData.omitFields.includes(key)) {
        continue;
      } else if (resultData.controllerData.categorical.includes(key)) {
        resultData.metaData[key].range.add(item[key]);
      } else {
        const val = parseFloat(item[key]);
        if (val < resultData.metaData[key].range[0]) {
          resultData.metaData[key].range[0] = val;
        }
        if (val > resultData.metaData[key].range[1]) {
          resultData.metaData[key].range[1] = val;
        }
      }
    }
  });

  return resultData;
}

/**
 * Takes filename as the input and locates the filename
 * in data folder. Once located this method, massages the data
 * in the form defined in datamodel.json.
 * 
 * After massaginging, this method calls the plotViz
 * downstream method.
 * 
 * 
 * @param {string} fileName 
 */
async function processTSVData(fileName) {
  const resultData = await cacheLookup(fileName);
  console.log(resultData);
}