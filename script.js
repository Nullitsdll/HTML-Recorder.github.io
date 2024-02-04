let mediaRecorder;
let recordedChunks = [];
let lightOn = false;

function toggleLight() {
  lightOn = !lightOn;
  const lamp = document.querySelector('.lamp');
  lamp.classList.toggle('light-on', lightOn);
}

function showTooltip(text) {
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.innerText = text;

  document.body.appendChild(tooltip);
}

function hideTooltip() {
  const tooltips = document.querySelectorAll('.tooltip');
  tooltips.forEach(tooltip => tooltip.remove());
}

async function startRecording() {
  try {
    const startButton = document.querySelector('button:nth-of-type(1)');
    const stopButton = document.querySelector('button:nth-of-type(2)');
    const downloadButton = document.querySelector('button:nth-of-type(3)');

    startButton.disabled = true;
    stopButton.disabled = false;
    downloadButton.disabled = true;

    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
      const recordedVideo = document.getElementById('recordedVideo');
      recordedVideo.src = URL.createObjectURL(recordedBlob);
      recordedVideo.controls = true;

      startButton.disabled = false;
      stopButton.disabled = true;
      downloadButton.disabled = false;
    };

    recordedChunks = [];
    mediaRecorder.start();
  } catch (error) {
    console.error('Error al iniciar la grabación:', error);
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
}

function downloadVideo() {
  if (recordedChunks.length === 0) {
    console.error('No hay video grabado para descargar.');
    return;
  }

  const blob = new Blob(recordedChunks, { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'grabacion_pantalla.webm';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}