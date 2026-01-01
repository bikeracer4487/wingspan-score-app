/**
 * Bird avatar images for player profiles.
 */

export interface BirdAvatar {
  id: string;
  name: string;
  image: any; // React Native image require type
}

export const BIRD_AVATARS: BirdAvatar[] = [
  { id: 'baldeagle', name: 'Bald Eagle', image: require('../../assets/bird-avatars/baldeagle.jpg') },
  { id: 'barnowl', name: 'Barn Owl', image: require('../../assets/bird-avatars/barnowl.jpg') },
  { id: 'bluejay', name: 'Blue Jay', image: require('../../assets/bird-avatars/bluejay.jpg') },
  { id: 'cardinal', name: 'Northern Cardinal', image: require('../../assets/bird-avatars/cardinal.jpg') },
  { id: 'chickadee', name: 'Chickadee', image: require('../../assets/bird-avatars/chickadee.jpg') },
  { id: 'crane', name: 'Crane', image: require('../../assets/bird-avatars/crane.jpg') },
  { id: 'crow', name: 'American Crow', image: require('../../assets/bird-avatars/crow.jpg') },
  { id: 'duck', name: 'Mallard Duck', image: require('../../assets/bird-avatars/duck.jpg') },
  { id: 'eagle', name: 'Golden Eagle', image: require('../../assets/bird-avatars/eagle.jpg') },
  { id: 'falcon', name: 'Peregrine Falcon', image: require('../../assets/bird-avatars/falcon.jpg') },
  { id: 'flamingo', name: 'American Flamingo', image: require('../../assets/bird-avatars/flamingo.jpg') },
  { id: 'goldfinch', name: 'American Goldfinch', image: require('../../assets/bird-avatars/goldfinch.jpg') },
  { id: 'goose', name: 'Canada Goose', image: require('../../assets/bird-avatars/goose.jpg') },
  { id: 'greathornedowl', name: 'Great Horned Owl', image: require('../../assets/bird-avatars/greathornedowl.jpg') },
  { id: 'heron', name: 'Great Blue Heron', image: require('../../assets/bird-avatars/heron.jpg') },
  { id: 'hummingbird', name: 'Hummingbird', image: require('../../assets/bird-avatars/hummingbird.jpg') },
  { id: 'kestrel', name: 'American Kestrel', image: require('../../assets/bird-avatars/kestrel.jpg') },
  { id: 'kingfisher', name: 'Kingfisher', image: require('../../assets/bird-avatars/kingfisher.jpg') },
  { id: 'loon', name: 'Common Loon', image: require('../../assets/bird-avatars/loon.jpg') },
  { id: 'magpie', name: 'Magpie', image: require('../../assets/bird-avatars/magpie.jpg') },
  { id: 'oriole', name: 'Baltimore Oriole', image: require('../../assets/bird-avatars/oriole.jpg') },
  { id: 'penguin', name: 'Penguin', image: require('../../assets/bird-avatars/penguin.jpg') },
  { id: 'puffin', name: 'Atlantic Puffin', image: require('../../assets/bird-avatars/puffin.jpg') },
  { id: 'robin', name: 'American Robin', image: require('../../assets/bird-avatars/robin.jpg') },
  { id: 'scarletmacaw', name: 'Scarlet Macaw', image: require('../../assets/bird-avatars/scarletmacaw.jpg') },
  { id: 'snowyowl', name: 'Snowy Owl', image: require('../../assets/bird-avatars/snowyowl.jpg') },
  { id: 'stellarsjay', name: "Steller's Jay", image: require('../../assets/bird-avatars/stellarsjay.jpg') },
  { id: 'swan', name: 'Mute Swan', image: require('../../assets/bird-avatars/swan.jpg') },
  { id: 'toucan', name: 'Toucan', image: require('../../assets/bird-avatars/toucan.jpg') },
  { id: 'woodpecker', name: 'Woodpecker', image: require('../../assets/bird-avatars/woodpecker.jpg') },
];

/**
 * Get a bird avatar by its ID
 */
export function getBirdAvatarById(id: string): BirdAvatar | undefined {
  return BIRD_AVATARS.find(bird => bird.id === id);
}

/**
 * Get a random bird avatar
 */
export function getRandomBirdAvatar(): BirdAvatar {
  const index = Math.floor(Math.random() * BIRD_AVATARS.length);
  return BIRD_AVATARS[index];
}

/**
 * Get the default bird avatar (first in list)
 */
export function getDefaultBirdAvatar(): BirdAvatar {
  return BIRD_AVATARS[0];
}
