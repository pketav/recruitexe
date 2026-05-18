/**
 * Utility functions for marker animations
 */

// Spring animation for marker bounce
const bounceAnimation = (element, duration = 700) => {
  if (!element) return;
  
  // Save original transform for restoration
  const originalTransform = window.getComputedStyle(element).transform;
  
  // Bounce animation keyframes
  const keyframes = [
    { transform: `${originalTransform} translateY(0)`, offset: 0 },
    { transform: `${originalTransform} translateY(-20px)`, offset: 0.5 },
    { transform: `${originalTransform} translateY(0)`, offset: 1 }
  ];
  
  // Animation options
  const options = {
    duration,
    easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)', // Ease out cubic
    iterations: 1
  };
  
  // Run animation
  return element.animate(keyframes, options);
};

// Pulse animation for highlighted markers
const pulseAnimation = (element, duration = 1500, iterations = Infinity) => {
  if (!element) return;
  
  // Pulse animation keyframes
  const keyframes = [
    { transform: 'scale(1)', opacity: 0.7, offset: 0 },
    { transform: 'scale(1.3)', opacity: 0.5, offset: 0.5 },
    { transform: 'scale(1)', opacity: 0.7, offset: 1 }
  ];
  
  // Animation options
  const options = {
    duration,
    easing: 'ease-in-out',
    iterations
  };
  
  // Run animation
  return element.animate(keyframes, options);
};

// Drop animation for new markers
const dropAnimation = (element, duration = 500) => {
  if (!element) return;
  
  // Save original transform for restoration
  const originalTransform = window.getComputedStyle(element).transform;
  
  // Drop animation keyframes
  const keyframes = [
    { transform: `${originalTransform} translateY(-100px)`, opacity: 0, offset: 0 },
    { transform: `${originalTransform} translateY(5px)`, opacity: 1, offset: 0.7 },
    { transform: `${originalTransform} translateY(0)`, opacity: 1, offset: 1 }
  ];
  
  // Animation options
  const options = {
    duration,
    easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)', // Ease out cubic
    iterations: 1
  };
  
  // Run animation
  return element.animate(keyframes, options);
};

export { bounceAnimation, pulseAnimation, dropAnimation };
