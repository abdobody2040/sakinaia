
export const hapticFeedback = {
  impact: () => {
    if (navigator.vibrate) navigator.vibrate(15);
  },
  success: () => {
    if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
  },
  warning: () => {
    if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
  },
  heavy: () => {
    if (navigator.vibrate) navigator.vibrate(50);
  }
};
