//Icons/**
import React from 'react';

// All icons in one flat map for easier management
const allIcons = {
  // Ceremony options
  'ceremony/memorial-service': <img src="/Picture/icons/memorial-service.svg" alt="Memorial Service" />,
  'ceremony/celebration-of-life': <img src="/Picture/icons/celebration-of-life.svg" alt="Celebration of Life" />,
  'ceremony/traditional-funeral': <img src="/Picture/icons/reef.svg" alt="Traditional Funeral" />,
  
  // Care options
  'care/burial': <img src="/Picture/icons/casket-picture.svg" alt="Burial" />,
  'care/cremation': <img src="/Picture/icons/cremation.svg" alt="Cremation" />,
  'care/alternatives': <img src="/Picture/icons/alternatives.svg" alt="Alternatives" />,
  
  // Cremation options
  'cremation/kept-at-home': <img src="/Picture/icons/kept-at-home-cremation.svg" alt="Kept at Home" />,
  'cremation/cemetery-placement': <img src="/Picture/icons/cemetery-cremation.svg" alt="Cemetery Placement" />,
  'cremation/scattering': <img src="/Picture/icons/scattering-cremation.svg" alt="Scattering" />,
  
  // Resting place options
  'restingPlace/cremation': <img src="/Picture/icons/resting-cremation.svg" alt="Cremation Resting Place" />,
  'restingPlace/nature': <img src="/Picture/icons/tree-simple.svg" alt="Nature" />,
  'restingPlace/memorial': <img src="/Picture/icons/resting-memorial.svg" alt="Memorial Resting Place" />,
  'restingPlace/donation': <img src="/Picture/icons/resting-donation.svg" alt="Donation Resting Place" />,
  'restingPlace/aerial': <img src="/Picture/icons/cloud-aerial.svg" alt="Aerial" />,
  'restingPlace/meaningful-location': <img src="/Picture/icons/heart-meaningful.svg" alt="Meaningful Location" />,
  'restingPlace/natural-burial': <img src="/Picture/icons/heart-stem-hands.svg" alt="Natural Burial" />,
  'restingPlace/ocean-return': <img src="/Picture/icons/wave.svg" alt="Ocean Return" />,
  'restingPlace/tree-planting': <img src="/Picture/icons/tree-nature.svg" alt="Tree Planting" />,
  'restingPlace/keepsake-jewelry': <img src="/Picture/icons/hand-diamond.svg" alt="Keepsake Jewelry" />,
  'restingPlace/memorial-art': <img src="/Picture/icons/pictureframe.svg" alt="Memorial Art" />,
  'restingPlace/living-space': <img src="/Picture/icons/flowers.svg" alt="Living Space" />,
  'restingPlace/donate-science': <img src="/Picture/icons/science.svg" alt="Donate to Science" />,
  'restingPlace/donate-organs': <img src="/Picture/icons/heart-held-hands.svg" alt="Donate Organs" />, // Updated path
  'restingPlace/donate-cause': <img src="/Picture/icons/cause.svg" alt="Donate to Cause" />,
  'restingPlace/family-plot': <img src="/Picture/icons/3-headstone.svg" alt="Family Plot" />,
  'restingPlace/cemetery-placement': <img src="/Picture/icons/headstone.svg" alt="Cemetery" />,
  
  // Burial options
  'burial/traditional-burial': <img src="/Picture/icons/headstone.svg" alt="Traditional Burial" />,
  'burial/green-burial': <img src="/Picture/icons/green-burial.svg" alt="Green Burial" />,
  'burial/special-memorial': <img src="/Picture/icons/special-memorial.svg" alt="Special Memorial" />,
  // Alternative options
  'alternatives/memorialization': <img src="/Picture/icons/memorialization.svg" alt="Memorialization" />,
  'alternatives/return-to-nature': <img src="/Picture/icons/tree-simple.svg" alt="Return to Nature" />,
  'alternatives/donate-body': <img src="/Picture/icons/donate-body.svg" alt="Donate Body" />,
  
  // Tributes
  'tributes/ceremony': <img src="/Picture/icons/list-checkbox-hand.svg" alt="Ceremony Essentials" />,
  'tributes/speaker': <img src="/Picture/icons/hand-heart.svg" alt="Honoring Legacy" />,
  'tributes/story': <img src="/Picture/icons/hand-writing.svg" alt="Meaningful Details" />,

  // Nature options
  'nature/natural-burial': <img src="/Picture/icons/heart-stem-hands.svg" alt="Natural Burial" />,
  'nature/ocean-return': <img src="/Picture/icons/cloud-aerial.svg" alt="Ocean Return" />,
  'nature/tree-planting': <img src="/Picture/icons/tree-nature.svg" alt="Tree Planting" />,
};

// Helper function to get icon by category and choice
export const getIcon = (category, choice) => {
  const key = `${category}/${choice}`;
  return allIcons[key] || <img src="/Picture/icons/default.svg" alt="Option" />;
};

// For getting tribute icons directly
export const getTributeIcon = (section) => {
  return getIcon('tributes', section);
};

export default getIcon;
