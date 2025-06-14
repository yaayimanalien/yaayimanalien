  let lastPlayedCutscene = null;
  let currentImage = 1;
  let animationInterval = null;
  
  let totalImagesToLoad = 0;
  let loadedImagesCount = 0;
  
  function updateLoadingBar(loaded, total) {
    const percentage = Math.min(100, Math.floor((loaded / total) * 100));
    const loadingBar = document.getElementById('loading-bar');
    
    if (loadingBar) {
      loadingBar.style.width = `${percentage}%`;
      console.log(`Loading progress: ${percentage}%`);
    }
    
    if (percentage === 100) {
      setTimeout(() => {
        const loadingContainer = document.getElementById('loading-bar-container');
        if (loadingContainer) {
          loadingContainer.style.opacity = '0';
          setTimeout(() => {
            loadingContainer.style.display = 'none';
          }, 500);
        }
      }, 300);
    }
  }
  
  function resetAllFramesVisibility() {
    const allFrames = document.querySelectorAll('.cutscene-frame');
    allFrames.forEach(frame => {
      frame.classList.remove('visible');
    });
  }
  
  function showFrame(prefix, totalFrames, frameNumber) {
    for (let i = 1; i <= totalFrames; i++) {
      const id = `${prefix}${i.toString().padStart(2, '0')}`;
      const el = document.getElementById(id);
      if (el) el.classList.toggle('visible', i === frameNumber);
    }
  }
  
  function playCutscene({ prefix = 'intro', totalFrames = 14, frameRate = 40, onComplete = () => {} }) {
      resetAllFramesVisibility();
    
      currentImage = 1;
      showFrame(prefix, totalFrames, currentImage);
    
      if (animationInterval) clearInterval(animationInterval);
      animationInterval = setInterval(() => {
        currentImage++;
        if (currentImage > totalFrames) {
          clearInterval(animationInterval);
          lastPlayedCutscene = prefix;
          console.log(`Finished cutscene: ${prefix}`);
          onComplete();
          return;
        }
        showFrame(prefix, totalFrames, currentImage);
      }, frameRate);
  }
    
  function playCutsceneReverse({ prefix = 'skills', totalFrames = 14, frameRate = 40, onComplete = () => {} }) {
      resetAllFramesVisibility();
    
      currentImage = totalFrames;
      showFrame(prefix, totalFrames, currentImage);
    
      if (animationInterval) clearInterval(animationInterval);
      animationInterval = setInterval(() => {
        currentImage--;
        if (currentImage < 1) {
          clearInterval(animationInterval);
          lastPlayedCutscene = prefix;
          console.log(`Finished reverse cutscene: ${prefix}`);
          onComplete();
          return;
        }
        showFrame(prefix, totalFrames, currentImage);
      }, frameRate);
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    const loadingBarContainer = document.getElementById('loading-bar-container');
    if (loadingBarContainer) {
      loadingBarContainer.style.display = 'block';
      loadingBarContainer.style.opacity = '1';
    }
    
    const allImages = document.querySelectorAll('img');
    totalImagesToLoad = allImages.length;
    loadedImagesCount = 0;
    
    updateLoadingBar(loadedImagesCount, totalImagesToLoad);
    
    if (totalImagesToLoad === 0) {
      updateLoadingBar(1, 1);
      return;
    }
    
    allImages.forEach(img => {
      if (img.complete) {
        loadedImagesCount++;
        updateLoadingBar(loadedImagesCount, totalImagesToLoad);
      } else {
        img.addEventListener('load', () => {
          loadedImagesCount++;
          updateLoadingBar(loadedImagesCount, totalImagesToLoad);
        });
        img.addEventListener('error', () => {
          loadedImagesCount++;
          updateLoadingBar(loadedImagesCount, totalImagesToLoad);
        });
      }
    });
  });
  
  window.addEventListener('load', () => {
    const cutsceneImages = document.querySelectorAll('.cutscene-frame');
    
    if (cutsceneImages.length === 0) {
      startIntro();
      return;
    }
    
    startIntro();
  
    function startIntro() {
      playCutscene({
        prefix: 'intro',
        totalFrames: 16,
        frameRate: 70,
        onComplete: () => {
          document.querySelector('.intro-container').style.display = 'flex';
          const introFirstFrame = document.getElementById('intro01');
          if (introFirstFrame) introFirstFrame.classList.add('visible');
        }
      });
  
      document.getElementById('to-skillset').addEventListener('click', () => {
        document.getElementById("audio").play();
        document.querySelector('.intro-container').style.display = 'none';
        //   document.getElementById('scroll-image-container').style.display = 'none';
  
        playCutscene({
          prefix: 'skills',
          totalFrames: 16,
          frameRate: 70,
          onComplete: () => {
            console.log('Skills animation done!');
            document.querySelector('.skills-container').style.display = 'flex';
            document.querySelectorAll('.overlay-skills').forEach(el => {
              el.style.display = 'block';
            });
          }
        });
      });
  
      document.getElementById('skills-to-main').addEventListener('click', () => {
        document.getElementById("audio").play();
        document.querySelector('.skills-container').style.display = 'none';
        document.querySelectorAll('.overlay-skills').forEach(el => {
          el.style.display = 'none';
        });
  
        playCutsceneReverse({
          prefix: 'skills',
          totalFrames: 16,
          frameRate: 70,
          onComplete: () => {
            console.log('Reverse to intro done!');
            document.querySelector('.intro-container').style.display = 'flex';
            const introFirstFrame = document.getElementById('intro01');
            if (introFirstFrame) introFirstFrame.classList.add('visible');
          }
        });
      });
  
      document.getElementById('to-contacts').addEventListener('click', () => {
        document.getElementById("audio").play();
          document.querySelector('.intro-container').style.display = 'none';
          //   document.getElementById('scroll-image-container').style.display = 'none';
    
          playCutscene({
            prefix: 'contacts',
            totalFrames: 16,
            frameRate: 70,
            onComplete: () => {
              console.log('About done!');
              document.querySelector('.contacts-container').style.display = 'block';
              document.querySelectorAll('.overlay-contacts').forEach(el => {
                el.style.display = 'block';
              });
            }
          });
        });
  
        document.getElementById('contacts-to-main').addEventListener('click', () => {
          document.getElementById("audio").play();
          document.querySelector('.contacts-container').style.display = 'none';
          document.querySelectorAll('.overlay-contacts').forEach(el => {
            el.style.display = 'none';
          });
          
          playCutsceneReverse({
            prefix: 'contacts',
            totalFrames: 16,
            frameRate: 70,
            onComplete: () => {
              console.log('About done!');
              document.querySelector('.intro-container').style.display = 'flex';
            }
          });
        });
  
      // about me section
      document.getElementById('to-about').addEventListener('click', () => {
        document.getElementById("audio").play();
        document.querySelector('.intro-container').style.display = 'none';
        //   document.getElementById('scroll-image-container').style.display = 'none';
  
        playCutscene({
          prefix: 'about',
          totalFrames: 16,
          frameRate: 70,
          onComplete: () => {
            console.log('About done!');
            document.querySelector('.about-container').style.display = 'block';
          }
        });
      });
  
      document.getElementById('about-to-main').addEventListener('click', () => {
        document.getElementById("audio").play();
        document.querySelector('.about-container').style.display = 'none';
        
        playCutsceneReverse({
          prefix: 'about',
          totalFrames: 16,
          frameRate: 70,
          onComplete: () => {
            console.log('About done!');
            document.querySelector('.intro-container').style.display = 'flex';
            const introFirstFrame = document.getElementById('intro01');
            if (introFirstFrame) introFirstFrame.classList.add('visible');
          }
        });
      });
    }
    document.getElementById('github').addEventListener('click', () => {
      window.open("https://github.com/username", "_blank");
    });

    document.getElementById('email').addEventListener('click', () => {
      navigator.clipboard.writeText("email@email.com");
    });

    document.getElementById('twitter').addEventListener('click', () => {
      window.open("https://x.com/username", "_blank");
    });

    // Minecraft-style tooltip logic for skill icons
    const skillIcons = document.querySelectorAll('.overlay-skills');

    function positionTooltip(event, tooltipElement) {
      if (tooltipElement.style.display !== 'flex') return; // Ensure calculations are done only if visible

      const tooltipWidth = tooltipElement.offsetWidth;
      const tooltipHeight = tooltipElement.offsetHeight;

      const offsetX = 15; // pixels to the right of cursor
      const offsetY = 15; // pixels below cursor

      let x = event.clientX + offsetX;
      let y = event.clientY + offsetY;

      // Boundary checks to keep tooltip within the viewport
      if (x + tooltipWidth > window.innerWidth) {
        x = event.clientX - tooltipWidth - offsetX; // Place to the left of cursor
      }
      if (x < 0) {
        x = 5; // Small margin from left edge if still out of bounds
      }

      if (y + tooltipHeight > window.innerHeight) {
        y = event.clientY - tooltipHeight - offsetY; // Place above cursor
      }
      if (y < 0) {
        y = 5; // Small margin from top edge if still out of bounds
      }

      tooltipElement.style.left = `${x}px`;
      tooltipElement.style.top = `${y}px`;
    }

    skillIcons.forEach(iconEl => {
      const tooltipEl = iconEl.nextElementSibling;

      if (tooltipEl && tooltipEl.classList.contains('mc-tooltip')) {
        iconEl.addEventListener('mouseenter', (e) => {
          tooltipEl.style.display = 'flex';
          positionTooltip(e, tooltipEl); // Initial position update
        });

        iconEl.addEventListener('mousemove', (e) => {
          positionTooltip(e, tooltipEl);
        });

        iconEl.addEventListener('mouseleave', () => {
          tooltipEl.style.display = 'none';
        });
      }
    });
  })