// speech/worker.js of the O&M twin app (round R5, 25 Nov 2026): Whisper base (quantized ONNX) through transformers.js, single thread
// (no cross-origin isolation on a plain static host), every file from this folder; nothing is fetched from elsewhere.
import { pipeline, env } from './transformers.min.js';
env.allowRemoteModels = false; env.allowLocalModels = true; env.localModelPath = new URL('./models/', self.location.href).href; env.useBrowserCache = false;
env.backends.onnx.wasm.wasmPaths = new URL('./', self.location.href).href; env.backends.onnx.wasm.numThreads = 1;
let asr = null;
self.onmessage = async e => { const m = e.data;
  try {
    if (m.type === 'load') { const t0 = performance.now(); asr = await pipeline('automatic-speech-recognition', 'whisper-base', { dtype: 'q8', device: 'wasm' }); self.postMessage({ type: 'ready', ms: performance.now() - t0 }) }
    if (m.type === 'run') { const t0 = performance.now(); const r = await asr(m.audio, { language: m.lang === 'he' ? 'hebrew' : 'english', task: 'transcribe', chunk_length_s: 30, stride_length_s: 5 }); self.postMessage({ type: 'done', id: m.id, text: r.text, ms: performance.now() - t0 }) }
  } catch (err) { self.postMessage({ type: m.type === 'run' ? 'done' : 'error', id: m.id, error: String(err && err.message || err) }) }
};
