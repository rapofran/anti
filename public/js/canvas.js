function resize() {
  var canvas = $('#canvas');
  canvas.outerHeight($(window).height() - canvas.offset().top - Math.abs(canvas.outerHeight(true) - canvas.outerHeight()));
}

window.Scale = function(freqs, octaves) {
  self = this
  this.freqs = []

  for(var octave = octaves[0]; octave <= octaves[1]; octave++){
    freqs.forEach(function(freq){
      self.freqs.push(freq * Math.pow(2, octave))
    });
  }

  self.count = function(){ return this.freqs.length };
  self.get = function(note){ return this.freqs[note] };
}

window.Harp = function(context, scale){
  var self = {};

  this.ctx = context;
  this.scale = scale;
  this.amplifier = context.createGain();
  this.oscillator = context.createOscillator();

  this.oscillator.connect(this.amplifier);
  this.amplifier.connect(context.destination);
  this.amplifier.gain.value = 0.01;
  this.oscillator.start(0);

  this.play = function(){
    this.oscillator.connect(amplifier);
  }

  this.stop = function(){
    this.oscillator.disconnect();
  }

  this.note = function(note, intensity){
    this.oscillator.frequency.value = scale.get(note) || 300;
    this.amplifier.gain.value = 0.09;
  }
}

function update(event) {
  var rect = this.getBoundingClientRect();

  var position = { x: event.clientX - rect.left, y: event.clientY - rect.top }
  center = { x: Math.round(this.width / 2), y: Math.round(this.height / 2) }

  updateColor(this, position);
  updateTone(this, position);
}

function updateColor(canvas, position){
  var center = { x: Math.floor(canvas.width / 2), y: Math.floor(canvas.height / 2) }
  var max = { x: Math.floor(canvas.width), y: Math.floor(canvas.height) }

  r = 255 - Math.floor(255 * (position.y / (max.y / 2)))
  g = 255 - Math.floor(255 * (position.x / (max.x / 2)))
  b =   0 + Math.floor(255 * (position.x / (max.x / 2)))

  ctx = canvas.getContext('2d')
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function updateTone(canvas, position){
  var notex = Math.floor(position.x / (canvas.width / window.harp_x.scale.count()) + 1);
  var notey = window.harp_y.scale.count() - Math.floor(position.y / (canvas.height / window.harp_y.scale.count()));

  harp_x.note(notex, 0.09);
  harp_y.note(notey, 0.09);
}

function fullscreen(){
  var elem = document.documentElement

  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  }
}
