/**
 * Bird avatar images for player profiles.
 *
 * Note: These are placeholder images from Lorem Picsum.
 * For production, replace with actual bird photographs or illustrations.
 */

export interface BirdAvatar {
  id: string;
  name: string;
  image: any; // React Native image require type
}

export const BIRD_AVATARS: BirdAvatar[] = [
  { id: 'cardinal', name: 'Northern Cardinal', image: require('../../assets/bird-avatars/cardinal.jpg') },
  { id: 'bluejay', name: 'Blue Jay', image: require('../../assets/bird-avatars/bluejay.jpg') },
  { id: 'robin', name: 'American Robin', image: require('../../assets/bird-avatars/robin.jpg') },
  { id: 'oriole', name: 'Baltimore Oriole', image: require('../../assets/bird-avatars/oriole.jpg') },
  { id: 'goldfinch', name: 'American Goldfinch', image: require('../../assets/bird-avatars/goldfinch.jpg') },
  { id: 'hummingbird', name: 'Hummingbird', image: require('../../assets/bird-avatars/hummingbird.jpg') },
  { id: 'owl', name: 'Barn Owl', image: require('../../assets/bird-avatars/owl.jpg') },
  { id: 'hawk', name: 'Red-tailed Hawk', image: require('../../assets/bird-avatars/hawk.jpg') },
  { id: 'eagle', name: 'Bald Eagle', image: require('../../assets/bird-avatars/eagle.jpg') },
  { id: 'falcon', name: 'Peregrine Falcon', image: require('../../assets/bird-avatars/falcon.jpg') },
  { id: 'duck', name: 'Mallard Duck', image: require('../../assets/bird-avatars/duck.jpg') },
  { id: 'heron', name: 'Great Blue Heron', image: require('../../assets/bird-avatars/heron.jpg') },
  { id: 'kingfisher', name: 'Kingfisher', image: require('../../assets/bird-avatars/kingfisher.jpg') },
  { id: 'woodpecker', name: 'Woodpecker', image: require('../../assets/bird-avatars/woodpecker.jpg') },
  { id: 'chickadee', name: 'Chickadee', image: require('../../assets/bird-avatars/chickadee.jpg') },
  { id: 'nuthatch', name: 'Nuthatch', image: require('../../assets/bird-avatars/nuthatch.jpg') },
  { id: 'wren', name: 'House Wren', image: require('../../assets/bird-avatars/wren.jpg') },
  { id: 'sparrow', name: 'House Sparrow', image: require('../../assets/bird-avatars/sparrow.jpg') },
  { id: 'crow', name: 'American Crow', image: require('../../assets/bird-avatars/crow.jpg') },
  { id: 'raven', name: 'Common Raven', image: require('../../assets/bird-avatars/raven.jpg') },
  { id: 'mockingbird', name: 'Northern Mockingbird', image: require('../../assets/bird-avatars/mockingbird.jpg') },
  { id: 'waxwing', name: 'Cedar Waxwing', image: require('../../assets/bird-avatars/waxwing.jpg') },
  { id: 'tanager', name: 'Scarlet Tanager', image: require('../../assets/bird-avatars/tanager.jpg') },
  { id: 'finch', name: 'House Finch', image: require('../../assets/bird-avatars/finch.jpg') },
  { id: 'warbler', name: 'Yellow Warbler', image: require('../../assets/bird-avatars/warbler.jpg') },
  { id: 'pelican', name: 'Brown Pelican', image: require('../../assets/bird-avatars/pelican.jpg') },
  { id: 'flamingo', name: 'American Flamingo', image: require('../../assets/bird-avatars/flamingo.jpg') },
  { id: 'parrot', name: 'Parrot', image: require('../../assets/bird-avatars/parrot.jpg') },
  { id: 'toucan', name: 'Toucan', image: require('../../assets/bird-avatars/toucan.jpg') },
  { id: 'peacock', name: 'Peacock', image: require('../../assets/bird-avatars/peacock.jpg') },
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
