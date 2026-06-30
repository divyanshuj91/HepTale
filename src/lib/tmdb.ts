// OMDb API Client wrapper with rich mockup fallbacks (replaces TMDB)

const OMDB_API_URL = 'https://www.omdbapi.com/';

// Bidirectional ID mapping: 'tt15239678' <-> 15239678
export function imdbIdToId(imdbId: string): number {
  const match = imdbId.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

export function idToImdbId(id: number): string {
  const numStr = String(id);
  const padded = numStr.padStart(7, '0');
  return `tt${padded}`;
}

// Curated IMDb IDs for Home Page sections
export const NEW_RELEASES_IDS = [
  'tt10366206', // Inside Out 2
  'tt6263850',  // Deadpool & Wolverine
  'tt11389872', // Kingdom of the Planet of the Apes
  'tt12037194', // Furiosa: A Mad Max Saga
  'tt16428756', // Challengers
  'tt17279496'  // Civil War
];

export const TRENDING_MOVIES_IDS = [
  'tt15239678', // Dune: Part Two
  'tt15398776', // Oppenheimer
  'tt0814155',  // Interstellar
  'tt15092608', // Spider-Man: Across the Spider-Verse
  'tt6710474'   // Everything Everywhere All at Once
];

export const TRENDING_TV_IDS = [
  'tt0903747',  // Breaking Bad
  'tt14243818', // The Last of Us
  'tt27987458', // Shōgun
  'tt11280740', // Severance
  'tt14452778'  // The Bear
];

export const TRENDING_ANIME_IDS = [
  'tt27078282', // Frieren: Beyond Journey's End
  'tt8333036',  // Demon Slayer: Kimetsu no Yaiba
  'tt2560140',  // Attack on Titan
  'tt12343534', // Jujutsu Kaisen
  'tt0877057'   // Death Note
];

// Curated YouTube Trailers Lookup Map
export const TRAILER_MAP: Record<string, string> = {
  'tt10366206': 'LEjhY15eCx0', // Inside Out 2
  'tt6263850': '73_1biulkYw',  // Deadpool & Wolverine
  'tt11389872': 'xtXXjpEupGE', // Kingdom of the Planet of the Apes
  'tt12037194': 'XJMuhwVlca4', // Furiosa
  'tt16428756': 'Vov5aTBc3V8', // Challengers
  'tt17279496': 'c2G0lhXCcBc', // Civil War
  'tt15239678': 'U2Qp5pL3ovA', // Dune 2
  'tt15398776': 'uYPbbksJxIg', // Oppenheimer
  'tt0814155': 'zSWdZAIB5nY',  // Interstellar
  'tt15092608': 'shW9i6k8Mc0', // Spider-Man Spider-Verse
  'tt6710474': 'wxN1T1UxQ2A',  // Everything Everywhere
  'tt0903747': 'HhesaQXLuRY',  // Breaking Bad
  'tt14243818': 'uLtkt8BonwM', // Last of Us
  'tt27987458': 'yAN5usp7yBY', // Shogun
  'tt11280740': 'xKTGPpDuZ1I', // Severance
  'tt14452778': 'i5U-w1yRy4M', // The Bear
  'tt27078282': 'It2eP692y74', // Frieren
  'tt8333036': 'dQw4w9WgXcQ',  // Demon Slayer
  'tt2560140': 'MGRm4IzK1SQ',  // Attack on Titan
  'tt12343534': 'hF2fL9f8wQc', // Jujutsu Kaisen
  'tt0877057': 'NlJZ-YgAt-c'   // Death Note
};

// Rich Offline fallback dictionary for curated list metadata
export const CURATED_OFFLINE_DB: Record<string, any> = {
  'tt10366206': {
    Title: 'Inside Out 2',
    Year: '2024',
    Released: '14 Jun 2024',
    Runtime: '96 min',
    Genre: 'Animation, Adventure, Comedy',
    Director: 'Kelsey Mann',
    Actors: 'Amy Poehler, Maya Hawke, Kensington Tallman, Liza Lapira',
    Plot: 'Teenager Riley\'s mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust, who’ve long been running a successful operation by all accounts, aren’t sure how to feel when Anxiety shows up.',
    Poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
    imdbRating: '7.7',
    Ratings: [{ Source: 'Internet Movie Database', Value: '7.7/10' }, { Source: 'Rotten Tomatoes', Value: '90%' }, { Source: 'Metacritic', Value: '73/100' }],
    Type: 'movie'
  },
  'tt6263850': {
    Title: 'Deadpool & Wolverine',
    Year: '2024',
    Released: '26 Jul 2024',
    Runtime: '127 min',
    Genre: 'Action, Comedy, Sci-Fi',
    Director: 'Shawn Levy',
    Actors: 'Ryan Reynolds, Hugh Jackman, Emma Corrin, Morena Baccarin',
    Plot: 'Deadpool\'s peaceful life comes to an abrupt end when the Time Variance Authority recruits him to safeguard the multiverse alongside a grumpy Wolverine.',
    Poster: 'https://images.unsplash.com/photo-1608889175123-8ec330b86f84?w=500&auto=format&fit=crop&q=80',
    imdbRating: '7.9',
    Ratings: [{ Source: 'Internet Movie Database', Value: '7.9/10' }, { Source: 'Rotten Tomatoes', Value: '78%' }, { Source: 'Metacritic', Value: '56/100' }],
    Type: 'movie'
  },
  'tt11389872': {
    Title: 'Kingdom of the Planet of the Apes',
    Year: '2024',
    Released: '10 May 2024',
    Runtime: '145 min',
    Genre: 'Action, Adventure, Sci-Fi',
    Director: 'Wes Ball',
    Actors: 'Owen Teague, Freya Allan, Kevin Durand, Peter Macon',
    Plot: 'Many years after the reign of Caesar, a young ape goes on a journey that will lead him to question everything he has been taught about the past and make choices that will define a future for apes and humans alike.',
    Poster: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=500&auto=format&fit=crop&q=80',
    imdbRating: '7.0',
    Ratings: [{ Source: 'Internet Movie Database', Value: '7.0/10' }, { Source: 'Rotten Tomatoes', Value: '80%' }, { Source: 'Metacritic', Value: '66/100' }],
    Type: 'movie'
  },
  'tt12037194': {
    Title: 'Furiosa: A Mad Max Saga',
    Year: '2024',
    Released: '24 May 2024',
    Runtime: '148 min',
    Genre: 'Action, Adventure, Sci-Fi',
    Director: 'George Miller',
    Actors: 'Anya Taylor-Joy, Chris Hemsworth, Tom Burke, Alyla Browne',
    Plot: 'The origin story of renegade warrior Furiosa before her encounter and teamup with Mad Max in Fury Road.',
    Poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
    imdbRating: '7.6',
    Ratings: [{ Source: 'Internet Movie Database', Value: '7.6/10' }, { Source: 'Rotten Tomatoes', Value: '90%' }, { Source: 'Metacritic', Value: '79/100' }],
    Type: 'movie'
  },
  'tt16428756': {
    Title: 'Challengers',
    Year: '2024',
    Released: '26 Apr 2024',
    Runtime: '131 min',
    Genre: 'Drama, Romance, Sports',
    Director: 'Luca Guadagnino',
    Actors: 'Zendaya, Mike Faist, Josh O\'Connor, Darnell Appling',
    Plot: 'Tashi, a former tennis prodigy turned coach, signs her husband up for a challenger match, where he must face off against his former best friend and Tashi\'s ex-boyfriend.',
    Poster: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=500&auto=format&fit=crop&q=80',
    imdbRating: '7.3',
    Ratings: [{ Source: 'Internet Movie Database', Value: '7.3/10' }, { Source: 'Rotten Tomatoes', Value: '88%' }, { Source: 'Metacritic', Value: '82/100' }],
    Type: 'movie'
  },
  'tt17279496': {
    Title: 'Civil War',
    Year: '2024',
    Released: '12 Apr 2024',
    Runtime: '109 min',
    Genre: 'Action, Adventure, Thriller',
    Director: 'Alex Garland',
    Actors: 'Kirsten Dunst, Wagner Moura, Cailee Spaeny, Stephen McKinley Henderson',
    Plot: 'A journey across a dystopian future America, following a team of military-embedded journalists as they race against time to reach DC before rebel factions descend upon the White House.',
    Poster: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=500&auto=format&fit=crop&q=80',
    imdbRating: '7.1',
    Ratings: [{ Source: 'Internet Movie Database', Value: '7.1/10' }, { Source: 'Rotten Tomatoes', Value: '81%' }, { Source: 'Metacritic', Value: '75/100' }],
    Type: 'movie'
  },
  'tt15239678': {
    Title: 'Dune: Part Two',
    Year: '2024',
    Released: '01 Mar 2024',
    Runtime: '166 min',
    Genre: 'Action, Adventure, Drama',
    Director: 'Denis Villeneuve',
    Actors: 'Timothée Chalamet, Zendaya, Rebecca Ferguson, Javier Bardem',
    Plot: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    Poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
    imdbRating: '8.6',
    Ratings: [{ Source: 'Internet Movie Database', Value: '8.6/10' }, { Source: 'Rotten Tomatoes', Value: '95%' }, { Source: 'Metacritic', Value: '79/100' }],
    Type: 'movie'
  },
  'tt15398776': {
    Title: 'Oppenheimer',
    Year: '2023',
    Released: '21 Jul 2023',
    Runtime: '180 min',
    Genre: 'Biography, Drama, History',
    Director: 'Christopher Nolan',
    Actors: 'Cillian Murphy, Emily Blunt, Matt Damon, Robert Downey Jr.',
    Plot: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    Poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&auto=format&fit=crop&q=80',
    imdbRating: '8.4',
    Ratings: [{ Source: 'Internet Movie Database', Value: '8.4/10' }, { Source: 'Rotten Tomatoes', Value: '93%' }, { Source: 'Metacritic', Value: '90/100' }],
    Type: 'movie'
  },
  'tt0814155': {
    Title: 'Interstellar',
    Year: '2014',
    Released: '07 Nov 2014',
    Runtime: '169 min',
    Genre: 'Adventure, Drama, Sci-Fi',
    Director: 'Christopher Nolan',
    Actors: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain, Mackenzie Foy',
    Plot: 'When Earth becomes uninhabitable, a team of explorers travels through a wormhole in space in an attempt to ensure humanity\'s survival.',
    Poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80',
    imdbRating: '8.7',
    Ratings: [{ Source: 'Internet Movie Database', Value: '8.7/10' }, { Source: 'Rotten Tomatoes', Value: '73%' }, { Source: 'Metacritic', Value: '74/100' }],
    Type: 'movie'
  },
  'tt15092608': {
    Title: 'Spider-Man: Across the Spider-Verse',
    Year: '2023',
    Released: '02 Jun 2023',
    Runtime: '140 min',
    Genre: 'Animation, Action, Adventure',
    Director: 'Joaquim Dos Santos, Kemp Powers',
    Actors: 'Shameik Moore, Hailee Steinfeld, Oscar Isaac, Jake Johnson',
    Plot: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
    Poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&auto=format&fit=crop&q=80',
    imdbRating: '8.6',
    Ratings: [{ Source: 'Internet Movie Database', Value: '8.6/10' }, { Source: 'Rotten Tomatoes', Value: '95%' }, { Source: 'Metacritic', Value: '86/100' }],
    Type: 'movie'
  },
  'tt6710474': {
    Title: 'Everything Everywhere All at Once',
    Year: '2022',
    Released: '08 Apr 2022',
    Runtime: '139 min',
    Genre: 'Action, Adventure, Comedy',
    Director: 'Daniel Kwan, Daniel Scheinert',
    Actors: 'Michelle Yeoh, Stephanie Hsu, Ke Huy Quan, Jamie Lee Curtis',
    Plot: 'A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes and connecting with the lives she could have led.',
    Poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80',
    imdbRating: '7.8',
    Ratings: [{ Source: 'Internet Movie Database', Value: '7.8/10' }, { Source: 'Rotten Tomatoes', Value: '93%' }, { Source: 'Metacritic', Value: '81/100' }],
    Type: 'movie'
  },
  'tt0903747': {
    Title: 'Breaking Bad',
    Year: '2008–2013',
    Released: '20 Jan 2008',
    Runtime: '49 min',
    Genre: 'Crime, Drama, Thriller',
    Director: 'Vince Gilligan',
    Actors: 'Bryan Cranston, Aaron Paul, Anna Gunn, Betsy Brandt',
    Plot: 'A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family\'s future.',
    Poster: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&auto=format&fit=crop&q=80',
    imdbRating: '9.5',
    Ratings: [{ Source: 'Internet Movie Database', Value: '9.5/10' }, { Source: 'Rotten Tomatoes', Value: '96%' }, { Source: 'Metacritic', Value: '87/100' }],
    Type: 'series'
  },
  'tt14243818': {
    Title: 'The Last of Us',
    Year: '2023–',
    Released: '15 Jan 2023',
    Runtime: '50 min',
    Genre: 'Action, Adventure, Drama',
    Director: 'Craig Mazin, Neil Druckmann',
    Actors: 'Pedro Pascal, Bella Ramsey, Gabriel Luna, Rutina Wesley',
    Plot: 'After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity\'s last hope.',
    Poster: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop&q=80',
    imdbRating: '8.8',
    Ratings: [{ Source: 'Internet Movie Database', Value: '8.8/10' }, { Source: 'Rotten Tomatoes', Value: '96%' }, { Source: 'Metacritic', Value: '84/100' }],
    Type: 'series'
  },
  'tt27987458': {
    Title: 'Shōgun',
    Year: '2024',
    Released: '27 Feb 2024',
    Runtime: '60 min',
    Genre: 'Adventure, Drama, History',
    Director: 'Rachel Kondo, Justin Marks',
    Actors: 'Hiroyuki Sanada, Cosmo Jarvis, Anna Sawai, Tadanobu Asano',
    Plot: 'When a mysterious English ship is found marooned in a nearby fishing village, Lord Yoshii Toranaga discovers secrets that could tip the scales of power in feudal Japan.',
    Poster: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=80',
    imdbRating: '8.7',
    Ratings: [{ Source: 'Internet Movie Database', Value: '8.7/10' }, { Source: 'Rotten Tomatoes', Value: '99%' }, { Source: 'Metacritic', Value: '85/100' }],
    Type: 'series'
  },
  'tt11280740': {
    Title: 'Severance',
    Year: '2022–',
    Released: '18 Feb 2022',
    Runtime: '57 min',
    Genre: 'Drama, Mystery, Sci-Fi',
    Director: 'Dan Erickson',
    Actors: 'Adam Scott, Zach Cherry, Britt Lower, Patricia Arquette',
    Plot: 'Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.',
    Poster: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&auto=format&fit=crop&q=80',
    imdbRating: '8.7',
    Ratings: [{ Source: 'Internet Movie Database', Value: '8.7/10' }, { Source: 'Rotten Tomatoes', Value: '97%' }, { Source: 'Metacritic', Value: '83/100' }],
    Type: 'series'
  },
  'tt14452778': {
    Title: 'The Bear',
    Year: '2022–',
    Released: '23 Jun 2022',
    Runtime: '30 min',
    Genre: 'Comedy, Drama',
    Director: 'Christopher Storer',
    Actors: 'Jeremy Allen White, Ebon Moss-Bachrach, Ayo Edebiri, Lionel Boyce',
    Plot: 'A young chef from the fine dining world returns to Chicago to run his family\'s sandwich shop after a family tragedy.',
    Poster: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&auto=format&fit=crop&q=80',
    imdbRating: '8.6',
    Ratings: [{ Source: 'Internet Movie Database', Value: '8.6/10' }, { Source: 'Rotten Tomatoes', Value: '99%' }, { Source: 'Metacritic', Value: '86/100' }],
    Type: 'series'
  },
  'tt27078282': {
    Title: 'Frieren: Beyond Journey\'s End',
    Year: '2023–2024',
    Released: '29 Sep 2023',
    Runtime: '24 min',
    Genre: 'Animation, Adventure, Drama, Fantasy',
    Director: 'Keiichirō Saitō',
    Actors: 'Atsumi Tanezaki, Kana Ichinose, Chiaki Kobayashi, Hiroki Touchi',
    Plot: 'An elf mage and her former party members have defeated the Demon King, bringing peace to the land. As an elf, Frieren will live for hundreds of years. She embarks on a new journey to understand the humans she adventured with.',
    Poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80',
    imdbRating: '8.9',
    Ratings: [{ Source: 'Internet Movie Database', Value: '8.9/10' }, { Source: 'Rotten Tomatoes', Value: '100%' }, { Source: 'Metacritic', Value: '85/100' }],
    Type: 'series'
  },
  'tt8333036': {
    Title: 'Demon Slayer: Kimetsu no Yaiba',
    Year: '2019–',
    Released: '06 Apr 2019',
    Runtime: '24 min',
    Genre: 'Animation, Action, Adventure, Fantasy',
    Director: 'Haruo Sotozaki',
    Actors: 'Natsuki Hanae, Zach Aguilar, Abby Trott, Yoshitsugu Matsuoka',
    Plot: 'A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly. Tanjiro sets out to become a demon slayer to avenge his family and cure his sister.',
    Poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80',
    imdbRating: '8.6',
    Ratings: [{ Source: 'Internet Movie Database', Value: '8.6/10' }, { Source: 'Rotten Tomatoes', Value: '95%' }, { Source: 'Metacritic', Value: '80/100' }],
    Type: 'series'
  },
  'tt2560140': {
    Title: 'Attack on Titan',
    Year: '2013–2023',
    Released: '07 Apr 2013',
    Runtime: '24 min',
    Genre: 'Animation, Action, Adventure, Fantasy',
    Director: 'Tetsurō Araki',
    Actors: 'Yuki Kaji, Marina Inoue, Yui Ishikawa, Josh Grelle',
    Plot: 'After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.',
    Poster: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=500&auto=format&fit=crop&q=80',
    imdbRating: '9.1',
    Ratings: [{ Source: 'Internet Movie Database', Value: '9.1/10' }, { Source: 'Rotten Tomatoes', Value: '95%' }, { Source: 'Metacritic', Value: '86/100' }],
    Type: 'series'
  },
  'tt12343534': {
    Title: 'Jujutsu Kaisen',
    Year: '2020–',
    Released: '03 Oct 2020',
    Runtime: '24 min',
    Genre: 'Animation, Action, Adventure, Fantasy',
    Director: 'Sunghoo Park',
    Actors: 'Junya Enoki, Yuma Uchida, Asami Seto, Yuichi Nakamura',
    Plot: 'A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman\'s school to be able to locate the demon\'s other body parts and exorcise himself.',
    Poster: 'https://images.unsplash.com/photo-1627556587428-ec2b7abcf266?w=500&auto=format&fit=crop&q=80',
    imdbRating: '8.6',
    Ratings: [{ Source: 'Internet Movie Database', Value: '8.6/10' }, { Source: 'Rotten Tomatoes', Value: '88%' }, { Source: 'Metacritic', Value: '75/100' }],
    Type: 'series'
  },
  'tt0877057': {
    Title: 'Death Note',
    Year: '2006–2007',
    Released: '04 Oct 2006',
    Runtime: '24 min',
    Genre: 'Animation, Crime, Drama, Fantasy',
    Director: 'Tetsurō Araki',
    Actors: 'Mamoru Miyano, Brad Swaile, Vincent Tong, Ryô Naitô',
    Plot: 'An intelligent high school student goes on a secret crusade to eliminate criminals from the world after discovering a notebook capable of killing anyone whose name is written into it.',
    Poster: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=500&auto=format&fit=crop&q=80',
    imdbRating: '8.9',
    Ratings: [{ Source: 'Internet Movie Database', Value: '8.9/10' }, { Source: 'Rotten Tomatoes', Value: '96%' }, { Source: 'Metacritic', Value: '80/100' }],
    Type: 'series'
  }
};

// Helper to determine if we should fall back to mock data
function isMockMode() {
  const key = process.env.OMDB_API_KEY;
  return !key || key === 'your-omdb-api-key' || key.trim() === '';
}

// Low-level helper to fetch from OMDb API
async function omdbFetch(queryParams: string) {
  const key = process.env.OMDB_API_KEY || '';
  const url = `${OMDB_API_URL}?apikey=${key}&${queryParams}`;
  const res = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
  if (!res.ok) {
    throw new Error(`OMDb Fetch Error: ${res.statusText}`);
  }
  return res.json();
}

// Low-level fetch by IMDb ID with mock fallback
export async function getOmdbDetailsByImdbId(imdbId: string) {
  if (isMockMode()) {
    return CURATED_OFFLINE_DB[imdbId] || CURATED_OFFLINE_DB['tt15239678'];
  }
  try {
    const data = await omdbFetch(`i=${imdbId}&plot=full`);
    if (data.Response === 'False') {
      return CURATED_OFFLINE_DB[imdbId] || CURATED_OFFLINE_DB['tt15239678'];
    }
    return data;
  } catch (e) {
    console.error(`OMDb API details failed for ${imdbId}:`, e);
    return CURATED_OFFLINE_DB[imdbId] || CURATED_OFFLINE_DB['tt15239678'];
  }
}

// Helper to load a list of curated items in parallel
async function getCuratedList(imdbIds: string[], type: 'movie' | 'tv') {
  const promises = imdbIds.map(id => getOmdbDetailsByImdbId(id));
  const results = await Promise.all(promises);
  return results.map(item => {
    const ratingFloat = item.imdbRating && item.imdbRating !== 'N/A' ? parseFloat(item.imdbRating) : 0;
    return {
      id: imdbIdToId(item.imdbID || 'tt15239678'),
      title: item.Title || 'Untitled',
      name: item.Title || 'Untitled',
      poster_path: item.Poster && item.Poster !== 'N/A' ? item.Poster : null,
      media_type: type,
      vote_average: ratingFloat,
      release_date: item.Released || item.Year || '',
      overview: item.Plot || '',
    };
  });
}

export async function getTrendingMovies() {
  return getCuratedList(TRENDING_MOVIES_IDS, 'movie');
}

export async function getTrendingTV() {
  return getCuratedList(TRENDING_TV_IDS, 'tv');
}

export async function getTrendingAnime() {
  return getCuratedList(TRENDING_ANIME_IDS, 'tv');
}

export async function getNewReleases() {
  return getCuratedList(NEW_RELEASES_IDS, 'movie');
}

export interface CriticRatings {
  imdb?: string;
  rottenTomatoes?: string;
  metacritic?: string;
}

export async function getOmdbRatings(imdbId: string): Promise<CriticRatings> {
  const details = await getOmdbDetailsByImdbId(imdbId);
  const ratings = details.Ratings || [];
  const rt = ratings.find((r: any) => r.Source === 'Rotten Tomatoes')?.Value;
  const meta = details.Metascore && details.Metascore !== 'N/A' ? details.Metascore : undefined;

  return {
    imdb: details.imdbRating && details.imdbRating !== 'N/A' ? details.imdbRating : undefined,
    rottenTomatoes: rt,
    metacritic: meta || details.Metascore,
  };
}

export async function getMediaDetails(id: number, type: 'movie' | 'tv') {
  const imdbId = idToImdbId(id);
  const item = await getOmdbDetailsByImdbId(imdbId);

  // Parse genres
  const genreList = (item.Genre || '')
    .split(',')
    .map((g: string, i: number) => ({ id: i + 1, name: g.trim() }))
    .filter((g: any) => g.name.length > 0);

  // Parse actors into cast
  const castList = (item.Actors || '')
    .split(',')
    .map((actor: string, i: number) => ({
      id: i + 1,
      name: actor.trim(),
      character: 'Key Cast',
      profile_path: null
    }))
    .filter((a: any) => a.name.length > 0);

  // Parse director into crew
  const crewList = (item.Director || '')
    .split(',')
    .map((director: string, i: number) => ({
      id: i + 10,
      name: director.trim(),
      job: 'Director'
    }))
    .filter((c: any) => c.name.length > 0);

  const ratings = item.Ratings || [];
  const rt = ratings.find((r: any) => r.Source === 'Rotten Tomatoes')?.Value;

  const omdbRatings: CriticRatings = {
    imdb: item.imdbRating && item.imdbRating !== 'N/A' ? item.imdbRating : undefined,
    rottenTomatoes: rt,
    metacritic: item.Metascore && item.Metascore !== 'N/A' ? item.Metascore : undefined,
  };

  // Find trailer YouTube key
  const trailerKey = TRAILER_MAP[imdbId] || 'dQw4w9WgXcQ';

  // Map to details structure
  return {
    id,
    title: item.Title || 'Untitled',
    name: item.Title || 'Untitled',
    tagline: item.Writer ? `Written by ${item.Writer}` : undefined,
    overview: item.Plot || '',
    release_date: item.Released || item.Year || '',
    first_air_date: item.Released || item.Year || '',
    genres: genreList,
    runtime: item.Runtime && item.Runtime !== 'N/A' ? parseInt(item.Runtime.match(/\d+/)?.[0] || '0') : 0,
    number_of_seasons: item.totalSeasons && item.totalSeasons !== 'N/A' ? parseInt(item.totalSeasons) : undefined,
    vote_average: item.imdbRating && item.imdbRating !== 'N/A' ? parseFloat(item.imdbRating) : 0,
    poster_path: item.Poster && item.Poster !== 'N/A' ? item.Poster : null,
    backdrop_path: null, // OMDb doesn't return backdrops; we'll fallback to placeholder / poster
    credits: {
      cast: castList,
      crew: crewList
    },
    videos: {
      results: [
        { id: 'v1', key: trailerKey, site: 'YouTube', type: 'Trailer' }
      ]
    },
    'watch/providers': {
      results: {
        US: {
          flatrate: [
            { provider_id: 8, provider_name: 'Netflix', logo_path: '/t2ee20G7nCttpx6Gyvxn2m04ue4.jpg' },
            { provider_id: 9, provider_name: 'Prime Video', logo_path: '/gG0gJDhrd14OFwV0K1KgflSR2FU.jpg' }
          ]
        },
        IN: {
          flatrate: [
            { provider_id: 8, provider_name: 'Netflix', logo_path: '/t2ee20G7nCttpx6Gyvxn2m04ue4.jpg' },
            { provider_id: 220, provider_name: 'JioCinema', logo_path: '/gG0gJDhrd14OFwV0K1KgflSR2FU.jpg' }
          ]
        }
      }
    },
    omdbRatings
  };
}

export async function searchMedia(query: string) {
  if (!query) return [];
  const key = process.env.OMDB_API_KEY;
  if (!key || key === 'your-omdb-api-key' || key.trim() === '') {
    // Filter mocks
    const allMocks = Object.values(CURATED_OFFLINE_DB);
    return allMocks
      .filter(item => (item.Title || '').toLowerCase().includes(query.toLowerCase()))
      .map(item => ({
        id: imdbIdToId(item.imdbID || 'tt15239678'),
        title: item.Title,
        poster_path: item.Poster,
        media_type: item.Type === 'series' ? 'tv' : 'movie',
        vote_average: parseFloat(item.imdbRating) || 0,
        release_date: item.Released,
      }));
  }

  try {
    const data = await omdbFetch(`s=${encodeURIComponent(query)}`);
    if (data.Response === 'False' || !data.Search) return [];

    // Fetch full details in parallel for ratings
    const detailPromises = data.Search.slice(0, 10).map((item: any) => getOmdbDetailsByImdbId(item.imdbID));
    const details = await Promise.all(detailPromises);

    return details.map((item: any) => ({
      id: imdbIdToId(item.imdbID || 'tt15239678'),
      title: item.Title,
      poster_path: item.Poster !== 'N/A' ? item.Poster : null,
      media_type: item.Type === 'series' ? 'tv' : 'movie',
      vote_average: item.imdbRating && item.imdbRating !== 'N/A' ? parseFloat(item.imdbRating) : 0,
      release_date: item.Released || item.Year || '',
    }));
  } catch (e) {
    console.error(`searchMedia failed for ${query}:`, e);
    return [];
  }
}

export async function getDiscoverMedia(type: 'movie' | 'tv', genreId?: string, moodId?: string) {
  // Discover logic using OMDb: fallback to filter local mock database or return curated selections
  const list = Object.values(CURATED_OFFLINE_DB);
  const filtered = list.filter(item => {
    const isCorrectType = type === 'movie' ? item.Type === 'movie' : item.Type === 'series';
    return isCorrectType;
  });

  return filtered.map(item => ({
    id: imdbIdToId(item.imdbID || 'tt15239678'),
    title: item.Title,
    poster_path: item.Poster !== 'N/A' ? item.Poster : null,
    media_type: type,
    vote_average: item.imdbRating && item.imdbRating !== 'N/A' ? parseFloat(item.imdbRating) : 0,
    release_date: item.Released || item.Year || '',
  }));
}

// Mood Mapping to keywords
export const MOODS = [
  { id: 'feel-good', name: 'Feel-Good', genres: [35, 18], keywords: 'inspiring,warm,heartwarming' },
  { id: 'gritty', name: 'Gritty', genres: [80, 53], keywords: 'dark,gritty,crime' },
  { id: 'tearjerker', name: 'Tearjerker', genres: [18, 10749], keywords: 'sad,tragic,tearjerker' },
  { id: 'mind-bending', name: 'Mind-Bending', genres: [878, 9648, 53], keywords: 'mind-bending,surreal,puzzle' },
];
