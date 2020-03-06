let model = null

async function load_model() {
  self.importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js')
  self.importScripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd')
  model = await cocoSsd.load()
}

onmessage = async (ev) => {
  if (model === null) {
    await load_model()
  }
  const result = await model.detect(ev.data)
  const person = result.find(v => v.class === 'person')
  if (person !== undefined) {
    postMessage({ok: true, bbox: person.bbox})
  } else {
    postMessage({ok: false, bbox: null})
  }
}

(async () => {
  await load_model()
  postMessage({})
})()
