// ════════════════════════════════════════════════════════════════
// WEBSITE CONTENT — edit this file to change reviews and photos.
// ════════════════════════════════════════════════════════════════

// Reviews: copy real reviews here (Google, The Knot, Facebook…).
// Leave the list empty to show a "reviews coming soon" note instead.
// { text: "…", name: "Sarah & Mike", event: "Wedding · The Grand Ballroom", stars: 5, source: "Google" }
window.REVIEWS = [];

// Gallery photos: put image files in /images and list them here.
// tall: true makes a portrait-shaped tile.
// { src: "images/first-dance.jpg", caption: "First dance — uplighting & cloud effect", tall: false }
window.GALLERY = [
  { src: "images/first-dance-rooftop.jpg", caption: "First dance, seen from the DJ booth" },
  { src: "images/first-dance-church.jpg", caption: "First dance" },
  { src: "images/setup-church.jpg", caption: "DJ booth and sound beside the cake table" },
];

// Optional photos for the home page hero and the brand panels (leave "" to use the plain dark background).
window.PHOTOS = {
  hero: "images/first-dance-rooftop.jpg",
  weddings: "images/first-dance-church.jpg",
  events: "",      // e.g. "images/school-dance.jpg"
  about: "images/setup-church.jpg",
};
