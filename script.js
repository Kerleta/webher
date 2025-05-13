// Initialize audio player
const audio = document.getElementById("bgMusic");
let currentPage = "firstPage";
let isAudioReady = false;

// Check orientation on page load
document.addEventListener('DOMContentLoaded', checkOrientation);

// Device orientation handling
function checkOrientation() {
  const warning = document.getElementById('orientation-warning');
  const mobileWarning = document.getElementById('mobile-warning');
  const contentWrapper = document.getElementById('content-wrapper');
  
  // Check if mobile based on user agent
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Detect orientation based on aspect ratio
  const isPortrait = window.innerHeight > window.innerWidth;
  
  if (isMobile && window.innerWidth < 768) {
    if (warning) warning.style.display = 'none';
    if (mobileWarning) mobileWarning.style.display = 'flex';
    if (contentWrapper) contentWrapper.style.display = 'none';
  } else if (isPortrait) {
    if (warning) warning.style.display = 'flex';
    if (mobileWarning) mobileWarning.style.display = 'none';
    if (contentWrapper) contentWrapper.style.display = 'none';
  } else {
    if (warning) warning.style.display = 'none';
    if (mobileWarning) mobileWarning.style.display = 'none';
    if (contentWrapper) contentWrapper.style.display = 'block';
  }
}

// Add resize listener
window.addEventListener('resize', checkOrientation);

// Set audio properties for autoplay attempt
audio.autoplay = true;
audio.loop = true; 
audio.muted = true; // Initially muted to help with autoplay policies

// Toggle Mute function
function toggleMute() {
  const soundIcons = document.querySelectorAll('[id^="soundIcon"]');

  audio.muted = !audio.muted;
  const iconSrc = audio.muted
    ? "content/sound_mute.svg"
    : "content/Sound_fill.svg";

  soundIcons.forEach(icon => {
    if (icon) icon.src = iconSrc;
  });
}

// Audio siap diputar
audio.addEventListener("canplaythrough", () => {
  isAudioReady = true;
  // Try autoplay when ready
  attemptAutoplay();
});

// Attempt to autoplay as soon as possible
function attemptAutoplay() {
  if (!isAudioReady) return;
  
  audio.play()
    .then(() => {
      console.log("✅ Autoplay berhasil");
      if (typeof playBtn !== 'undefined' && playBtn) {
        playBtn.style.display = "none";
      }
      
      // After successful autoplay, we can unmute if needed
      // Uncomment the next line if you want it to automatically unmute
      // audio.muted = false;
    })
    .catch(err => {
      console.warn("⚠️ Autoplay gagal:", err);
      // Keep the play button visible if autoplay fails
      if (typeof playBtn !== 'undefined' && playBtn) {
        playBtn.style.display = "block";
      }
    });
}

// Fungsi untuk memainkan dari detik tertentu
function playFromSecond(second) {
  if (!isAudioReady) return;
  
  audio.currentTime = second;
  audio.play()
    .then(() => console.log("▶️ Audio diputar dari detik", second))
    .catch(err => console.warn("⚠️ Audio play gagal:", err));
}

// Flag to track if user is on candle page and if candle has been blown
let candleBlown = false;
let onCandlePage = false;

// Fungsi Navigasi Halaman
function navigateToPage(pageId) {
  // Special case for sevenPage - prevent navigation FROM it if candle not blown yet
  if (currentPage === "sevenPage" && !candleBlown && pageId !== "sevenPage") {
    // If on sevenPage and trying to navigate away before blowing candle
    alert("Tiup lilin dulu ya!");
    // Stay on current page
    return;
  }

  // Sembunyikan semua halaman terlebih dahulu
  document.getElementById("firstPage").style.display = "none";
  document.getElementById("birthdayPage").style.display = "none"; 
  document.getElementById("thirdPage").style.display = "none";
  document.getElementById("fourPage").style.display = "none";
  document.getElementById("fivePage").style.display = "none";
  document.getElementById("sixPage").style.display = "none";
  document.getElementById("sevenPage").style.display = "none";
  document.getElementById("eightPage").style.display = "none"; 

  // Tampilkan halaman yang dipilih
  document.getElementById(pageId).style.display = "flex";
  
  // Perbarui halaman saat ini
  currentPage = pageId;
  
  // Track if we're on the candle page
  onCandlePage = (pageId === "sevenPage");
}

// Try to play on any user interaction with the document
document.addEventListener("click", function() {
  if (audio.paused) {
    audio.muted = false; // Unmute when user interacts
    
    audio.play()
      .then(() => {
        console.log("▶️ Audio diputar setelah interaksi pengguna");
        if (typeof playBtn !== 'undefined' && playBtn) {
          playBtn.style.display = "none";
        }
      })
      .catch(e => {
        console.warn("❌ Gagal memutar audio setelah interaksi:", e);
      });
  }
}, {once: true}); // Only trigger once

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  // Only block keyboard navigation if on candle page and candle not blown
  if (currentPage === "sevenPage" && !candleBlown) {
    // Still allow navigating TO the candle page
    if (e.key === "ArrowLeft") {
      if (currentPage === "sevenPage") {
        navigateToPage("sixPage"); // Allow going back from candle page
        return;
      }
    }
    return; // Block other navigation on candle page until blown
  }
  
  if (e.key === "ArrowLeft") {
    if (currentPage === "birthdayPage") {
      navigateToPage("firstPage");
    } else if (currentPage === "thirdPage") {
      navigateToPage("birthdayPage");
    } else if (currentPage === "fourPage") {
      navigateToPage("thirdPage");
    } else if (currentPage === "fivePage") {
      navigateToPage("fourPage");
    } else if (currentPage === "sixPage") {
      navigateToPage("fivePage");
    } else if (currentPage === "sevenPage") {
      navigateToPage("sixPage");
    } else if (currentPage === "eightPage") {
      navigateToPage("sevenPage");
    }
  } else if (e.key === "ArrowRight") {
    if (currentPage === "firstPage") {
      navigateToPage("birthdayPage");
    } else if (currentPage === "birthdayPage") {
      navigateToPage("thirdPage");
    } else if (currentPage === "thirdPage") {
      navigateToPage("fourPage");
    } else if (currentPage === "fourPage") {
      navigateToPage("fivePage");
    } else if (currentPage === "fivePage") {
      navigateToPage("sixPage");
    } else if (currentPage === "sixPage") {
      navigateToPage("sevenPage");
    } else if (currentPage === "sevenPage") { 
      navigateToPage("eightPage");
    }
  }
});

// Document ready function 
document.addEventListener("DOMContentLoaded", function() {
  // This is another attempt to make autoplay work
  attemptAutoplay();

  // Set up the flip card functionality
  const flipCard = document.getElementById('catFlipCard');
  if (flipCard) {
    flipCard.addEventListener('click', function() {
      this.classList.toggle('hover:[transform:rotateY(180deg)]');
      this.classList.toggle('[transform:rotateY(180deg)]');
    });
  }

  // Set up the candle functionality with jQuery
  if (typeof $ !== 'undefined') {
    $(function() {
      var flame = $("#flame");
      var candleTitle = $(".candle-title");
      var wishText = $("#wish-text");
      var sevenNav = $("#sevenNav");

      // Make sure the navigation is hidden initially
      if (sevenNav.length) {
        sevenNav.hide();
      }

      flame.on("click", function() {
        // Set candle blown flag
        candleBlown = true;
        
        flame.removeClass("burn").addClass("puff");

        $(".smoke").each(function() {
          $(this).addClass("puff-bubble");
        });

        $("#glow").remove();
        candleTitle.hide();

        // Show wish text with fade in effect
        wishText.hide().delay(750).fadeIn(500);
        
        // Properly show navigation with fade in
        setTimeout(function() {
          // Make sure to display as flex, not just show
          sevenNav.css('display', 'flex').hide().fadeIn(500);
        }, 1500);

        $("#candle").animate({
          opacity: ".5"
        }, 100);
      });

    });
  } else {
    // Fallback for non-jQuery - using vanilla JS
    document.addEventListener('DOMContentLoaded', function() {
      var flame = document.getElementById('flame');
      var candleTitle = document.querySelector('.candle-title');
      var wishText = document.getElementById('wish-text');
      var sevenNav = document.getElementById('sevenNav');
      
      // Make sure the navigation is hidden initially
      if (sevenNav) {
        sevenNav.style.display = 'none';
      }
      
      if (flame) {
        flame.addEventListener('click', function() {
          // Set candle blown flag
          candleBlown = true;
          
          flame.classList.remove('burn');
          flame.classList.add('puff');
          
          document.querySelectorAll('.smoke').forEach(function(smoke) {
            smoke.classList.add('puff-bubble');
          });
          
          var glow = document.getElementById('glow');
          if (glow) glow.remove();
          
          if (candleTitle) candleTitle.style.display = 'none';
          
          if (wishText) {
            wishText.style.display = 'none';
            setTimeout(function() {
              wishText.style.display = 'block';
              wishText.style.opacity = '1';
            }, 750);
          }
          
          if (sevenNav) {
            setTimeout(function() {
              // Fade in effect for vanilla JS
              sevenNav.style.display = 'flex';
              sevenNav.style.justifyContent = 'space-between';
              sevenNav.style.width = '100%';
              sevenNav.style.opacity = '0';
              var opacity = 0;
              var interval = setInterval(function() {
                if (opacity < 1) {
                  opacity += 0.1;
                  sevenNav.style.opacity = opacity;
                } else {
                  clearInterval(interval);
                }
              }, 50);
            }, 1500);
          }
          
          var candle = document.getElementById('candle');
          if (candle) candle.style.opacity = '0.5';
        });
      }
    });
  }
});