let controls = document.querySelectorAll('.controls');
for(let i=0; i<controls.length; i++){
  controls[i].style.display = 'inline-block';
}

let slides = document.querySelectorAll('#slides .slide');
let currentSlide = 0;
let slideInterval = setInterval(nextSlide,5000);

function nextSlide(){
  goToSlide(currentSlide+1);
}

function previousSlide(){
  goToSlide(currentSlide-1);
}

function goToSlide(n){
  slides[currentSlide].className = 'slide';
  currentSlide = (n+slides.length)%slides.length;
  slides[currentSlide].className = 'slide showing';
}


let playing = true;
let pauseButton = document.getElementById('pause');

function pauseSlideshow(){
  pauseButton.innerHTML = '&#9658;'; // play character
  playing = false;
  clearInterval(slideInterval);
}

function playSlideshow(){
  pauseButton.innerHTML = '&#10074;&#10074;'; // pause character
  playing = true;
  slideInterval = setInterval(nextSlide,5000);
}

pauseButton.onclick = function(){
  if(playing){ pauseSlideshow(); }
  else{ playSlideshow(); }
};

let next = document.getElementById('bouton_right');
let previous = document.getElementById('bouton_left');

next.onclick = function(){
  pauseSlideshow();
  nextSlide();
};
previous.onclick = function(){
  pauseSlideshow();
  previousSlide();
};

 document.addEventListener("keydown", function(e){
    if(e.keyCode === 39){
        pauseSlideshow();
        nextSlide();
    }
    else if(e.keyCode === 37){
        pauseSlideshow()
        previousSlide();
    }
  });
