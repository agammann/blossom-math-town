import assert from 'node:assert/strict';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
let serverReady = false;
for (let i = 0; i < 100; i++) {
  try { if ((await fetch('http://127.0.0.1:4173/tv.html')).ok) { serverReady = true; break; } } catch {}
  await delay(100);
}
assert.ok(serverReady, 'Vega HTTP server did not start');
let target;
for (let i = 0; i < 100; i++) {
  try {
    const response = await fetch('http://127.0.0.1:9222/json/new?http://127.0.0.1:4173/tv.html', { method: 'PUT' });
    if (response.ok) { target = await response.json(); break; }
  } catch {}
  await delay(100);
}
assert.ok(target?.webSocketDebuggerUrl, 'Chrome did not start');
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
let nextId = 0;
const pending = new Map();
socket.onmessage = event => {
  const data = JSON.parse(event.data);
  if (!data.id) return;
  const entry = pending.get(data.id);
  if (!entry) return;
  pending.delete(data.id);
  clearTimeout(entry.timer);
  if (data.error) entry.reject(new Error(data.error.message)); else entry.resolve(data.result);
};
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error('CDP timeout: ' + method)); }, 10000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}
async function waitFor(expression) {
  for (let i = 0; i < 100; i++) {
    if (await evaluate(expression)) return;
    await delay(100);
  }
  throw new Error('Timed out waiting for ' + expression);
}
async function key(key, code, keyCode) {
  const common = { key, code, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode };
  await send('Input.dispatchKeyEvent', { type: 'keyDown', ...common, ...(key === 'Enter' ? { text: '\r', unmodifiedText: '\r' } : {}) });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', ...common });
}
try {
  await send('Page.bringToFront');
  await waitFor("document.querySelectorAll('.destination').length === 10");
  await delay(500);
  assert.equal(await evaluate("document.documentElement.dataset.tv"), 'true');
  await evaluate("document.querySelector('#open-count').focus()");
  await key('ArrowRight', 'ArrowRight', 39);
  assert.equal(await evaluate("document.activeElement !== document.querySelector('#open-count') && document.activeElement.tagName === 'BUTTON'"), true, 'ArrowRight should move focus');
  await evaluate("document.querySelector('#open-count').focus()");
  await key('Enter', 'Enter', 13);
  await waitFor("location.hash === '#count' && !!document.querySelector('#practice-tab')");
  await key('Escape', 'Escape', 27);
  await waitFor("location.hash === '' && document.querySelectorAll('.destination').length === 10");
  console.log('Vega browser smoke passed: town, arrow focus, Select and Back.');
} finally {
  socket.close();
}
