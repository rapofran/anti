function Analyzer(context){
  var canvas = document.getElementById('analyzer');
  var CC = canvas.getContext('2d');

  var AC = context;
  var input;

  var filter = AC.createBiquadFilter();
  filter.type = "lowpass";
  filter.gain.value = 100;
  filter.frequency.value = 500.0;
  filter.Q.value = 10.0;

  var lfo = AC.createOscillator();
  var lfo_amp = AC.createGain();
  lfo.frequency.value = 2;
  lfo_amp.gain.value = 450.0;
  lfo.connect(lfo_amp);
  lfo_amp.connect(filter.detune);
  lfo.start();

  var analyzer = AC.createAnalyser();
  var bufferLength = analyzer.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength)
  analyzer.fftSize = 4096;

  var draw = function() {
    requestAnimationFrame(draw);

    analyzer.getByteTimeDomainData(dataArray);

    CC.fillStyle = '#002fa7';
    CC.fillRect(0, 0, canvas.width, canvas.height);

    CC.lineWidth = 2;
    CC.strokeStyle = 'rgb(0, 0, 0)';

    CC.beginPath();

    var sliceWidth = canvas.width * 1.0 / bufferLength;
    var x = 0;

    for(var i = 0; i < bufferLength; i++) {
      var v = dataArray[i] / 128.0;
      var y = v * canvas.height/2;

      if(i === 0) {
        CC.moveTo(x, y);
      } else {
        CC.lineTo(x, y);
      }

      x += sliceWidth;
    }

    CC.lineTo(canvas.width, canvas.height/2);
    CC.stroke();
  };

  var init = function (stream) {
    input = AC.createMediaStreamSource(stream);
    input.connect(filter);
    filter.connect(analyzer);
    analyzer.connect(AC.destination);

    analyzer.getByteTimeDomainData(dataArray);
    draw();
  };

  navigator.getMedia( { audio: true }, init, function(){ console.log('error requesting access to user media') } )
};
