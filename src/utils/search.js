const STOP_WORDS = new Set(['a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'if', 'in', 'into', 'is', 'it', 'no', 'not', 'of', 'on', 'or', 'such', 'that', 'the', 'their', 'then', 'there', 'these', 'they', 'this', 'to', 'was', 'will', 'with']);

export function searchPhotos(query, photos) {
  const queryLower = query.toLowerCase().trim();
  const allTokens = queryLower.split(/\s+/).filter(Boolean);
  
  if (allTokens.length === 0) return photos;

  // Filter out stop words to avoid false positive matches on common words
  const meaningfulTokens = allTokens.filter(token => !STOP_WORDS.has(token));
  
  // If the user only searched for stop words, use all tokens anyway
  const searchTokens = meaningfulTokens.length > 0 ? meaningfulTokens : allTokens;

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
      let matchedTokensCount = 0;

      const searchableText = SEARCHABLE_FIELDS
        .map(field => {
          const value = photo[field];
          if (!value) return '';
          return Array.isArray(value) ? value.join(' ') : String(value);
        })
        .join(' ')
        .toLowerCase();

      // 1. Exact phrase match gives a massive boost
      if (searchableText.includes(queryLower)) {
        score += 100;
      }

      searchTokens.forEach(token => {
        // Basic stemming: strip trailing 's' to match singular and plural
        const baseToken = token.endsWith('s') && token.length > 3 ? token.slice(0, -1) : token;
        const escapedToken = baseToken.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // 2. Exact word match using regex boundaries (matches singular or plural)
        const exactWordRegex = new RegExp(`\\b${escapedToken}(?:s)?\\b`, 'i');
        
        if (exactWordRegex.test(searchableText)) {
          score += 10;
          matchedTokensCount++;
        } 
        // 3. Fallback to substring match, but score it much lower
        else if (searchableText.includes(baseToken)) {
          score += 2;
          matchedTokensCount++;
        }
      });

      // 4. AND Condition Bonus: If ALL search words are present, it's a very strong match
      if (matchedTokensCount === searchTokens.length && searchTokens.length > 1) {
        score += 50;
      }

      return { ...photo, _score: score };
    })
    .filter(p => p._score > 0)
    .sort((a, b) => b._score - a._score);
}
