// Global Variables
const openingScreen = document.getElementById("opening-screen");
const gameContainer = document.getElementById("game-container");
const gameArea = document.getElementById("game");
const textBox = document.getElementById("text-box");
let player; // Player will be created after the scrollable screen is visible
let playerPosition = { x: 240, y: 240 }; // Start position in the middle of the viewport
let currentDirection = "idle"; // Track the player's current direction

// Gifs for character animations
const characterAnimations = {
  idle: "url('Elliot_idle.gif')", // Idle GIF
  left: "url('Elliot_running_left.gif')", // Running left GIF
  right: "url('Elliot_running_right.gif')", // Running right GIF
};
// Initial Scene
const introMessage = "Welcome to The Signal.\n\nYou are a lonely software engineer working late at night. Use the Arrow keys to move and press 'E' to interact. Beware of the messages—they may reveal more than you want to know...\n\nFind the object. It calls to you.";

// Function to start the game (Opening Screen Transition)
function startGame() {
  // Add fade-out effect to the opening screen
  openingScreen.classList.add("fade-out"); // Ensure you have a fade-out class in CSS

  // After fade-out, transition to the first scene
  setTimeout(() => {
    openingScreen.style.display = "none"; // Hide the opening screen
    gameContainer.style.display = "block"; // Show the game container
    gameArea.style.backgroundImage = "url('background.gif')"; // Set background GIF for first scene
    gameArea.style.backgroundSize = "cover"; // Ensure the background fills the area
    gameArea.style.backgroundPosition = "center";

    // Display the introductory message with typewriter effect
    displayMessage("Welcome to The Signal.\n\nYou are a lonely software engineer working late at night. Use the Arrow keys to move and press 'E' to interact. Beware of the messages—they may reveal more than you want to know...\n\nFind the object. It calls to you.",showFirstSceneButton);
  }, 1000); // Adjust timing to match fade-out animation
}

// Function to display the message with typewriter effect
let typingIndex = 0;

function displayMessage(message, callback) {
  textBox.textContent = "";
  typingIndex = 0;

  function typeWriter() {
    if (typingIndex < message.length) {
      textBox.textContent += message.charAt(typingIndex);
      typingIndex++;
      setTimeout(typeWriter, 50); // Adjust the speed of typing
    } else if (callback) {
      callback(); // Call the callback (showFirstSceneButton) when the message is finished
    }
  }

  typeWriter();
}

// Show the first scene button after message is typed
function showFirstSceneButton() {
  const button = document.createElement("button");
  button.textContent = "Continue";
  button.id = "scene-button";
  button.style.position = "absolute";
  button.style.bottom = "20px";
  button.style.fontFamily = "'Press Start 2P', monospace";
  button.style.fontSize = "18px";
  button.style.padding = "10px";
  button.style.backgroundColor = "#00FF00";
  button.style.border = "none";
  button.style.cursor = "pointer";
  
  // Event listener for button click
  button.addEventListener("click", () => {
    button.remove(); // Remove the button
    showSecondScene(); // Proceed to the second scene
  });

  gameContainer.appendChild(button);
}

// Show second scene (background transition)


// Show second scene (background transition)
function showSecondScene() {
  // Change background and display new text
  gameArea.style.backgroundImage = "url('first-scene.png')";
  displayMessage("While debugging code you get a mysterious email from your work \n You are working ...", showScrollableGameButton);
}

// Show button to start scrollable part of the game
function showScrollableGameButton() {
  const button = document.createElement("button");
  button.textContent = "Start Game";
  button.id = "scene-button";
  button.style.position = "absolute";
  button.style.bottom = "20px";
  button.style.fontFamily = "'Press Start 2P', monospace";
  button.style.fontSize = "18px";
  button.style.padding = "10px";
  button.style.backgroundColor = "#00FF00";
  button.style.border = "none";
  button.style.cursor = "pointer";
  startScrollableGame(); 
  // Event listener for button click to transition to scrollable game
  button.addEventListener("click", () => {
    button.remove(); // Remove the button
    startScrollableGame(); // Transition to the scrollable game
  });

  gameContainer.appendChild(button);
}

// Function to transition to scrollable game
function startScrollableGame() {
  // Set up scrollable background
  gameArea.style.backgroundImage = "none"; // Clear previous background
  gameArea.style.width = "480px"; // Set viewport width
  gameArea.style.height = "480px"; // Set viewport height
  gameArea.style.overflow = "hidden"; // Hide overflow
  gameArea.style.position = "relative";

  // Create the scrollable area
  const scrollableArea = document.createElement("div");
  scrollableArea.id = "scrollable-area";
  scrollableArea.style.width = "1000px"; // Full scrollable width
  scrollableArea.style.height = "480px"; // Full scrollable height
  scrollableArea.style.backgroundImage = "url('scrolling_background.png')";
  scrollableArea.style.backgroundSize = "cover";
  scrollableArea.style.position = "absolute";
  scrollableArea.style.top = "0";
  scrollableArea.style.left = "0";

  gameArea.appendChild(scrollableArea);

  // Add the player after a short transition delay
  setTimeout(() => {
    createPlayer(scrollableArea);
  }, 500);
}

function createPlayer(scrollableArea) {
  // Create the player element
  player = document.createElement("div");
  player.id = "character";
  player.style.width = "64px"; // Set the character width
  player.style.height = "64px"; // Set the character height
  player.style.backgroundImage = characterAnimations["idle"]; // Set default idle animation
  player.style.backgroundSize = "cover";
  player.style.position = "absolute";
  player.style.left = `${playerPosition.x}px`; // Initial horizontal position
  player.style.top = `${playerPosition.y}px`; // Initial vertical position

  // Append the player to the scrollable area
  scrollableArea.appendChild(player);

  // Add event listeners for player movement
  window.addEventListener("keydown", handleMovement);
  window.addEventListener("keyup", handleKeyUp); // Reset to idle when keys are released
}
// Function to handle arrow key movements
function handleMovement(e) {
  const step = 10; // Number of pixels moved per key press
  const scrollableArea = document.getElementById("scrollable-area");
  let moved = false; // Track whether the player moves

  switch (e.key) {
    case "ArrowUp":
      playerPosition.y = Math.max(playerPosition.y - step, 0); // Prevent moving off top edge
      moved = true;
      break;
    case "ArrowDown":
      playerPosition.y = Math.min(playerPosition.y + step, 480 - 64); // Prevent moving off bottom edge
      moved = true;
      break;
    case "ArrowLeft":
      playerPosition.x = Math.max(playerPosition.x - step, 0); // Prevent moving off left edge
      updatePlayerAnimation("left"); // Set running left animation
      moved = true;
      break;
    case "ArrowRight":
      playerPosition.x = Math.min(playerPosition.x + step, 1000 - 64); // Prevent moving off right edge
      updatePlayerAnimation("right"); // Set running right animation
      moved = true;
      break;
  }

  if (moved) {
    updatePlayerPosition();
    scrollGameArea(playerPosition, scrollableArea);
  }
}

function handleKeyUp(e) {
  // Reset to idle animation when movement keys are released
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    updatePlayerAnimation("idle");
  }
}

// Function to update player animation
function updatePlayerAnimation(direction) {
  if (currentDirection !== direction) {
    currentDirection = direction; // Update current direction
    player.style.backgroundImage = characterAnimations[direction]; // Set the new animation
  }
}

// Function to update player position
function updatePlayerPosition() {
  player.style.left = `${playerPosition.x}px`;
  player.style.top = `${playerPosition.y}px`;
}

// Function to scroll the game area
function scrollGameArea(playerPosition, scrollableArea) {
  const gameArea = document.getElementById("game");

  // Adjust the scroll position of the game area based on the player’s position
  gameArea.scrollLeft = Math.min(
    Math.max(playerPosition.x - 240, 0), // Keep the player centered when possible
    1000 - 480 // Constrain scroll to the rightmost edge
  );
}

// Event listener to start the game when the Enter key is pressed
window.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    startGame(); // Start the game when the Enter key is pressed
  }
});
