let controls = document.querySelectorAll('.controls');
for(let i=0; i<controls.length; i++){
  controls[i].style.display = 'inline-block';
}

let slides = document.querySelectorAll('#slides .slide');
let currentSlide = 0; // commence au premeir slide
let slideInterval = setInterval(nextSlide,5000); // fixe l'interval des sliders

function nextSlide(){ // Slide suivant
  goToSlide(currentSlide+1);
}

function previousSlide(){ // Slide précédent
  goToSlide(currentSlide-1);
}

function goToSlide(n){ // function pour faire le roulement des slides
  slides[currentSlide].className = 'slide';
  currentSlide = (n+slides.length)%slides.length;
  slides[currentSlide].className = 'slide showing';
}


let playing = true;
let pauseButton = document.getElementById('pause');

function pauseSlideshow(){ // Met pause de l'interval
  pauseButton.innerHTML = '&#9658;'; // play character
  playing = false;
  clearInterval(slideInterval);
}

function playSlideshow(){ // Réactive l'interval de 5seconde
  pauseButton.innerHTML = '&#10074;&#10074;'; // pause character
  playing = true;
  slideInterval = setInterval(nextSlide,5000);
}

pauseButton.onclick = function(){ // function du bouton play pause si play affiche pause et inversement
  if(playing){ pauseSlideshow(); }
  else{ playSlideshow(); }
};

let next = document.getElementById('bouton_right'); // bouton droit
let previous = document.getElementById('bouton_left'); // bouton gauche

next.onclick = function(){ // met en pause le timer et passe au slide suivant
  pauseSlideshow();
  nextSlide();
};
previous.onclick = function(){ // met en pause le timer et passe au slide précédent
  pauseSlideshow();
  previousSlide();
};

 document.addEventListener("keydown", function(e){ // changement de slider avec touche gauche droite clavier
    if(e.keyCode === 39){ // Slider suivant
        pauseSlideshow();
        nextSlide();
    }
    else if(e.keyCode === 37){ // Slider précédent
        pauseSlideshow()
        previousSlide();
    }
  });
