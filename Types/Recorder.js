/**
 * Record injected canvas at FPS and write
 * to a video element
 */
function Recorder(canvas) {
  const video = document.querySelector('video')

  const stream = canvas.captureStream(0)
  const recorder = new MediaRecorder(stream)

  let chunks = []
  recorder.ondataavailable = e => {
    chunks.push(e.data)
  }

  recorder.onstop = e => {
    const blob = new Blob(chunks, { type: 'video/mp4' })
    chunks = []
    const videoURL = URL.createObjectURL(blob)
    video.src = videoURL
    console.log('RECORDING SRC: ', video.src)
    video.style.display = 'block'
  }

  function snap() {
    stream.getVideoTracks()[0].requestFrame()
  }

  function start() {
    recorder.start()
  }

  function stop() {
    recorder.stop() 
  }

  return {
    snap,
    start,
    stop,
    get video() {return video}
  }
}