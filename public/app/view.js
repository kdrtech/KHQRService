// Add CSS styles dynamically to the document head
function addCSS() {
  const style = document.createElement('style');
  style.innerHTML = `
      .view {
        background-color: #ffffff;
        color: white;
        text-align: center;
        padding: 0px;
        border-radius: 8px;
        font-size: 20px;
        position: absolute;
        transition: all 0.3s ease;
      }
    `;
  document.head.appendChild(style);  // Append the style element to the head
}
// Function to create the centered view
function createAndCenterView() {
  // Create a new div element for the view
  const newView = document.createElement('div');
  newView.style.visibility = 'hidden';
  newView.classList.add('view');
  // Create the image element
  const img = document.createElement('img');
  img.src = "image/khqr-bg.png";
  img.height = 500;
  // Append the image to the new div
  const hedder = document.createElement('div');
  hedder.style.cssText = 'position: absolute; margin-top: 93px; color: rgb(0, 0, 0); margin-left: 47px; font-size: 18px;';
  hedder.textContent = "Kuch Darith";
  newView.appendChild(hedder);

  const amount = document.createElement('div');
  amount.style.cssText = 'position: absolute; margin-top: 119px; color: rgb(0, 0, 0); margin-left: 44px; font-size: 35px;';
  amount.innerHTML = "10000,000" + '<span style="font-size: 24px; margin-left: 10px;">$</span>';

  newView.appendChild(amount);

  const imgQR = document.createElement('img');
  imgQR.src = "image/khqr.png";
  imgQR.style.cssText = "height: 260px; left: 48px; position: absolute; width: 260px; top: 199px;";

  newView.appendChild(imgQR);
  newView.appendChild(img);

  // Append the new view to the body
  document.body.appendChild(newView);

  // Center the view
  centerView(newView);
}

// Function to center the view
function centerView(viewElement) {
  const viewWidth = viewElement.offsetWidth;
  const viewHeight = viewElement.offsetHeight;

  // Get the viewport width and height
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // Calculate the position to center the view
  const left = (windowWidth - viewWidth) / 2;
  const top = (windowHeight - viewHeight) / 2;

  // Set the position of the view
  viewElement.style.left = `${left}px`;
  viewElement.style.top = `${top}px`;
}
window.onload = function () {
  const view = document.querySelector('.view');
  if (view) {
    view.style.visibility = 'visible';
    centerView(view);
  }

}

// Re-center the view when the window is resized
window.onresize = function () {
  const view = document.querySelector('.view');
  if (view) {
    centerView(view);
  }
};// Re-center the view when the window is resized

export default {
  addCSS,
  createAndCenterView
}