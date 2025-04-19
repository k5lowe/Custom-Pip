(function () {
    if (document.getElementById('custom-pip')) return;


  
    const originalVideo = document.querySelector('video');



    if (!originalVideo) {
      alert("No video found on this page!");
      return;
    }


    originalVideo.muted = true;
    originalVideo.style.filter = "brightness(0)";
    


  
    const pip = document.createElement('div');
    pip.id = 'custom-pip';
    pip.style.cssText = `
    
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 300px;
      height: 170px;
      background: black;
      z-index: 99999;
      border-radius: 12px;
      overflow: auto;
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
      resize: both;
      display: flex;
      flex-direction: column;
    `;

  

    const vid = document.createElement('video');
    vid.srcObject = originalVideo.captureStream();
    vid.autoplay = true;
    vid.muted = true;
    vid.controls = true;
    vid.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: brightness(1.0);
    `;



    const controlsContainer = document.createElement('div');
    controlsContainer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none; /* Hidden by default */
    pointer-events: none; /* Allow clicks to pass through when hidden */
    z-index: 100002;
  `;


    const closeButton = document.createElement('button');
    closeButton.textContent = 'x';
    closeButton.style.cssText = `
      position: absolute;
      top: 5px;
      right: 5px;
      width: 25px;
      height: 25px;
      background: gray;
      color: white;
      border: none;
      border-radius: 50%;
      font-size: 16px;
      cursor: pointer;
      pointer-events: auto;
    `;

    closeButton.onclick = () => {
      pip.remove();
    };

  
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0.5;
    slider.max = 1.5;
    slider.step = 0.1;
    slider.value = 1.0;
    slider.style.cssText = `
      position: absolute;
      top: 5px;
      left: 5px;
      width: 80px;
      z-index: 100000;
      pointer-events: auto;
    `;

    slider.onmousedown = (e) => {
      e.stopPropagation(); // Prevent the mousedown event from propagating to the pip container
    };


    slider.oninput = () => {
      vid.style.filter = `brightness(${slider.value})`;
    };



    controlsContainer.appendChild(closeButton);
    controlsContainer.appendChild(slider);

    
    pip.appendChild(controlsContainer);
    pip.appendChild(vid)

    document.body.appendChild(pip);
  
    pip.onmousedown = function (e) {
      const rect = pip.getBoundingClientRect();
      const isResizing =
        e.clientX > rect.right - 10 && e.clientY > rect.bottom - 10;
    
      if (isResizing) return; // Skip drag logic if resizing
    
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
    
      function onMouseMove(e) {
        pip.style.left = e.clientX - offsetX + 'px';
        pip.style.top = e.clientY - offsetY + 'px';
      }
    
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', () =>
        document.removeEventListener('mousemove', onMouseMove)
      );
    };


        // Show controls on mouse enter
    pip.addEventListener('mouseenter', () => {
      controlsContainer.style.display = 'block';
    });

    // Hide controls on mouse leave
    pip.addEventListener('mouseleave', () => {
      controlsContainer.style.display = 'none';
    });


  })();
  