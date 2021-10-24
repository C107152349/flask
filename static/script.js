
const constraints = {
    audio: false,
    video: {
      facingMode: "user"
    }
  };
  function delay(n){
    return new Promise(function(resolve){
        setTimeout(resolve,n*1000);
    });
  }
  const getFrameFromVideo = (video, canvas) => {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    //ctx.translate(video.width, 0);
    //ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, video.width, video.height);
    ctx.restore();
    requestAnimationFrame(() => getFrameFromVideo(video, canvas));
  };
  
  const getCameraStream = video => {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function success(stream) {
        video.srcObject = stream;
      });
  };
  
  const createVideo = (id, width, height) => {
    const video = document.createElement("video");
    video.id = id;
    video.width = width;
    video.height = height;
    video.autoplay = true;
    video.controls = false;
    return video;
  };
  
  const createCanvas = (id, width, height) => {
    const canvas = document.createElement("canvas");
    canvas.id = id;
    canvas.width = width;
    canvas.height = height;
    return canvas;
  };
  
  const init = () => {
    const video = createVideo("vid", 64, 64);
    //const canvas = createCanvas("canvas", 480, 360);
    const app = document.getElementById("app");
    getCameraStream(video);
    //getFrameFromVideo(video, canvas);
    app.appendChild(video);
    //app.appendChild(canvas);
    console.log("init");
  };
  //document.getElementById("app").onload = init();
  let video = document.getElementById('vid');
  let canvas2 = document.getElementById('canvas2');
  let ctx2 = canvas2.getContext("2d");
  let startbtn = document.getElementById('start');
  let pausebtn = document.getElementById('pause');
  video.autoplay = true;
  getCameraStream(video);
  getFrameFromVideo(video, canvas2);
  
  let timeID;
  

  startbtn.addEventListener('click',function(){
    timeID = setInterval(function(){
      let detect_img = new Image()
      detect_img.src = canvas2.toDataURL("image/png");
      let raw =  JSON.stringify(tf.browser.fromPixels(canvas2,3).arraySync())
      //console.log(raw);
      $.ajax({ 
          url: '/img', 
          type: 'POST', 
          data: raw,
          success: function(response){ 
            let vbbox = JSON.parse(response)
            console.log(vbbox);
            ctx.clearRect(0, 0, canvas1.width, canvas1.height);
            ctx.save();
            ctx.drawImage(detect_img,0,0,416,416)
            for (let index = 0; index < vbbox.length; index++) {
                let x = vbbox[index][2]*1;
                let y = vbbox[index][1]*1;
                let dx = vbbox[index][4]*1 - x;
                let dy = vbbox[index][3]*1 - y
                boundingbox(x,y,dx,dy,vbbox[index][0]);
            }
            ctx.restore();
            img.src = canvas1.toDataURL("image/png");
          }
      })
    },500);
  });
  pausebtn.addEventListener('click',function(){
    clearInterval(timeID);
  });
  function boundingbox(x,y,dx,dy,font){
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.rect(x,y,dx,dy);
    ctx.stroke();
    ctx.fillStyle = "red"
    ctx.fillRect(x,y-8,ctx.measureText(font).width,8)
    ctx.fillStyle = "white"
    ctx.fillText(font,x,y);
  }