export function searchPhotos(query, photos) {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  
  if (tokens.length === 0) return photos;

  const SEARCHABLE_FIELDS = [
    'primary_subjects',
    'descriptive_tags',
    'sensory_cues',
    'mood_and_tone',
    'dominant_colors',
    'alt_text',
    'city',
  ];

  return photos
    .map(photo => {
      let score = 0;
      const searchableText = SEARCHABLE_FIELDS
        .map(field => {
          const value = photo[field];
          if (!value) return '';
          return Array.isArray(value) ? value.join(' ') : String(value);
        })
        .join(' ')
        .toLowerCase();

      tokens.forEach(token => {
        if (searchableText.includes(token)) score++;
      });

      return { ...photo, _score: score };
    })
    .filter(p => p._score > 0)
    .sort((a, b) => b._score - a._score);
}
