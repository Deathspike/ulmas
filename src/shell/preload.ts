import electron from 'electron';

process.once('loaded', () => {
  window.addEventListener('message', x => {
    if (typeof x.data !== 'string') return;
    electron.ipcRenderer.send('message', x.data);
  });
});
