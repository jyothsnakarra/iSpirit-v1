// A simple service to play sound effects

export enum SoundEffect {
  MessageSent = 'https://actions.google.com/sounds/v1/foley/cassette_tape_button_press.ogg',
  MessageReceived = 'https://actions.google.com/sounds/v1/notifications/card_popup.ogg',
  CardFlip = 'https://actions.google.com/sounds/v1/cards/card_deal_single.ogg',
  MatchSuccess = 'https://actions.google.com/sounds/v1/rewards/success_bell.ogg',
  GameWin = 'https://actions.google.com/sounds/v1/rewards/jingle.ogg',
  MoveClick = 'https://actions.google.com/sounds/v1/switches/switch_toggle_on_1.ogg',
}

/**
 * Plays a sound effect.
 * @param sound The sound effect to play from the SoundEffect enum.
 */
export const playSound = (sound: SoundEffect) => {
  try {
    const audio = new Audio(sound);
    audio.volume = 0.4; // Keep the volume subtle and unobtrusive
    audio.play().catch(error => {
      // This can happen if the user hasn't interacted with the page yet.
      // We can safely ignore this as subsequent sounds will play.
      console.warn("Sound playback was prevented by the browser:", error);
    });
  } catch (error) {
    console.error("Error playing sound:", error);
  }
};
