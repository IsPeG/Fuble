import furniturePlacedSoundFile from "./assets/sounds/furniturePlacedSound.mp3";
import buttonHoverFile from "./assets/sounds/buttonHover.mp3";

export const furniturePlacedSound = new Audio(furniturePlacedSoundFile);
export const buttonHoverSound = new Audio(buttonHoverFile);
export function playButtonHoverSound() {
  buttonHoverSound.volume = 0.4;
  buttonHoverSound.pause();
  buttonHoverSound.currentTime = 0;
  buttonHoverSound.play();
}
