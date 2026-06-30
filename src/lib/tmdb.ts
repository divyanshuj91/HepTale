// TMDB API Client wrapper with rich mockup fallbacks

const TMDB_API_URL = 'https://api.themoviedb.org/3';

// Fallback Mock Data for movies, TV shows, and anime
export const MOCK_TRENDING_MOVIES = [
  {
    id: 1011985,
    title: 'Kung Fu Panda 4',
    media_type: 'movie',
    overview: 'Po is geared up to become the spiritual leader of his Valley of Peace, but also needs someone to take his place as the Dragon Warrior.',
    poster_path: '/kDp1vUB3jTLm6wSbXXeZj6qGl4t.jpg',
    backdrop_path: '/1X5IWuGJZMC3m013kQ2wzczgCbs.jpg',
    release_date: '2024-03-02',
    vote_average: 7.2,
  },
  {
    id: 823464,
    title: 'Godzilla x Kong: The New Empire',
    media_type: 'movie',
    overview: 'Following their explosive showdown, Godzilla and Kong must reunite against a colossal undiscovered threat hidden within our world.',
    poster_path: '/v43Teu7t7t0dqCj26rT6jGB4J9M.jpg',
    backdrop_path: '/sR0gJDhrd14OFwV0K1KgflSR2FU.jpg',
    release_date: '2024-03-27',
    vote_average: 7.3,
  },
  {
    id: 693134,
    title: 'Dune: Part Two',
    media_type: 'movie',
    overview: 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators.',
    poster_path: '/czembDcB20oAD7ysRZr8w56214X.jpg',
    backdrop_path: '/xOMo8BRK7jaNDvUeQerFJSju730.jpg',
    release_date: '2024-02-27',
    vote_average: 8.3,
  },
  {
    id: 872585,
    title: 'Oppenheimer',
    media_type: 'movie',
    overview: 'The story of J. Robert Oppenheimer\'s role in the development of the atomic bomb during World War II.',
    poster_path: '/8Gxv8gS0W05R2qKVq1e5El4X7XG.jpg',
    backdrop_path: '/rM52HhG5F275XWp1xS7P3Zk7DqR.jpg',
    release_date: '2023-07-19',
    vote_average: 8.1,
  },
  {
    id: 569094,
    title: 'Spider-Man: Across the Spider-Verse',
    media_type: 'movie',
    overview: 'After reuniting with Gwen Stacy, Brooklyn\'s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse.',
    poster_path: '/8Gxv8gS0W05R2qKVq1e5El4X7XG.jpg',
    backdrop_path: '/4mc46Wl5m9Hk9Ex1i456Zc8d9x1.jpg',
    release_date: '2023-05-31',
    vote_average: 8.4,
  },
];

export const MOCK_TRENDING_TV = [
  {
    id: 1396,
    name: 'Breaking Bad',
    media_type: 'tv',
    overview: 'Walter White, a chemistry teacher, discovers he has cancer and decides to get into the meth-making business to repay his medical debts.',
    poster_path: '/ztkUQn2C1V4RP41i4nGoa7iA52c.jpg',
    backdrop_path: '/9fae8mo0Rcl446fMTA2i8eU482N.jpg',
    first_air_date: '2008-01-20',
    vote_average: 8.9,
  },
  {
    id: 100088,
    name: 'The Last of Us',
    media_type: 'tv',
    overview: 'Twenty years after modern civilization has been destroyed, Joel is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone.',
    poster_path: '/u3bZgnWJbb6Z1wPqHbgD57gaCuL.jpg',
    backdrop_path: '/uDgy6hyPd6i6gWhZc7j5i8t714f.jpg',
    first_air_date: '2023-01-15',
    vote_average: 8.6,
  },
  {
    id: 110492,
    name: 'Severance',
    media_type: 'tv',
    overview: 'Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.',
    poster_path: '/qS4KCEr6tB5FqLzKjN2Z7K6vT6w.jpg',
    backdrop_path: '/7mYwS6j2C6lZ4P0h8v5j2z3H4j4.jpg',
    first_air_date: '2022-02-17',
    vote_average: 8.4,
  },
  {
    id: 94605,
    name: 'Arcane',
    media_type: 'tv',
    overview: 'Amidst the escalating discord between the rich city of Piltover and the gritty underbelly of Zaun, two sisters fight on opposing sides.',
    poster_path: '/fqldE2v11X7J1n7sfPPsuhwb43S.jpg',
    backdrop_path: '/7q64LjHETvqllnSDjLHj7t1pqJb.jpg',
    first_air_date: '2021-11-06',
    vote_average: 8.7,
  },
];

export const MOCK_TRENDING_ANIME = [
  {
    id: 209867,
    name: 'Frieren: Beyond Journey\'s End',
    media_type: 'tv',
    overview: 'Mage Frieren and her courageous fellow adventurers have defeated the Demon King, bringing peace to the land. But Frieren must navigate a different kind of journey.',
    poster_path: '/r942asgj5i0d2f026aef66236fa.jpg',
    backdrop_path: '/9fae8mo0Rcl446fMTA2i8eU482N.jpg',
    first_air_date: '2023-09-29',
    vote_average: 8.9,
  },
  {
    id: 85244,
    name: 'Demon Slayer: Kimetsu no Yaiba',
    media_type: 'tv',
    overview: 'It is the Taisho Period in Japan. Tanjiro, a kindhearted boy who sells charcoal for a living, finds his family slaughtered by a demon.',
    poster_path: '/xU7w4537XU062b32f26aef66236fb.jpg',
    backdrop_path: '/hZzt5145Jj5136ja2c7fJp76f7a.jpg',
    first_air_date: '2019-04-06',
    vote_average: 8.7,
  },
  {
    id: 1429,
    name: 'Attack on Titan',
    media_type: 'tv',
    overview: 'Several hundred years ago, humans were nearly exterminated by Titans. Today, humanity is forced to live inside giant concentric walls.',
    poster_path: '/k9741asgj5i0d2f026aef66236fa.jpg',
    backdrop_path: '/uDgy6hyPd6i6gWhZc7j5i8t714f.jpg',
    first_air_date: '2013-04-07',
    vote_average: 8.7,
  },
  {
    id: 95479,
    name: 'Jujutsu Kaisen',
    media_type: 'tv',
    overview: 'Yuji Itadori is a boy with tremendous physical strength, though he lives a completely ordinary high school life.',
    poster_path: '/hZzt5145Jj5136ja2c7fJp76f7a.jpg',
    backdrop_path: '/7mYwS6j2C6lZ4P0h8v5j2z3H4j4.jpg',
    first_air_date: '2020-10-03',
    vote_average: 8.6,
  },
];

export const MOCK_NEW_RELEASES = [
  {
    id: 1022789,
    title: 'Inside Out 2',
    media_type: 'movie',
    overview: 'Teenager Riley\'s mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions!',
    poster_path: '/vpnVM9B6NMmQjGJWZ0Tyh0v2jOQ.jpg',
    backdrop_path: '/stKGOmvmv4v25ajN6n66nZ66oR4.jpg',
    release_date: '2024-06-12',
    vote_average: 7.7,
  },
  {
    id: 823464,
    title: 'Godzilla x Kong: The New Empire',
    media_type: 'movie',
    overview: 'Following their explosive showdown, Godzilla and Kong must reunite against a colossal undiscovered threat hidden within our world.',
    poster_path: '/v43Teu7t7t0dqCj26rT6jGB4J9M.jpg',
    backdrop_path: '/sR0gJDhrd14OFwV0K1KgflSR2FU.jpg',
    release_date: '2024-03-27',
    vote_average: 7.3,
  },
  {
    id: 653346,
    title: 'Kingdom of the Planet of the Apes',
    media_type: 'movie',
    overview: 'Many years after the reign of Caesar, a young ape goes on a journey that will lead him to question everything he has been taught about the past.',
    poster_path: '/gK5gxAx6az8hlw45azb8z6G1X7b.jpg',
    backdrop_path: '/fqldE2v11X7J1n7sfPPsuhwb43S.jpg',
    release_date: '2024-05-08',
    vote_average: 7.1,
  },
  {
    id: 786892,
    title: 'Furiosa: A Mad Max Saga',
    media_type: 'movie',
    overview: 'The origin story of renegade warrior Furiosa before her encounter and teamup with Mad Max.',
    poster_path: '/iND8VrxU2w1j8pZ1H75azH76azA.jpg',
    backdrop_path: '/xOMo8BRK7jaNDvUeQerFJSju730.jpg',
    release_date: '2024-05-22',
    vote_average: 7.2,
  },
];


// Helper to determine if we should fall back to mock data
function isMockMode() {
  const key = process.env.TMDB_API_KEY;
  return !key || key === 'your-tmdb-read-access-token-or-key' || key.trim() === '';
}

// Get standard headers or query parameters for TMDB requests
function getFetchConfig() {
  const key = process.env.TMDB_API_KEY || '';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json;charset=utf-8',
  };

  if (key.startsWith('eyJ')) {
    headers['Authorization'] = `Bearer ${key}`;
    return { headers };
  } else {
    return {
      headers,
      keyParam: `api_key=${key}`,
    };
  }
}

async function tmdbFetch(endpoint: string) {
  if (isMockMode()) {
    throw new Error('Mock mode is active.');
  }

  const config = getFetchConfig();
  const separator = endpoint.includes('?') ? '&' : '?';
  const url = config.keyParam 
    ? `${TMDB_API_URL}${endpoint}${separator}${config.keyParam}`
    : `${TMDB_API_URL}${endpoint}`;

  const res = await fetch(url, {
    headers: config.headers,
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) {
    throw new Error(`TMDB Fetch Error: ${res.statusText}`);
  }
  return res.json();
}

export async function getTrendingMovies() {
  if (isMockMode()) return MOCK_TRENDING_MOVIES;
  try {
    const data = await tmdbFetch('/trending/movie/day');
    return data.results.slice(0, 10).map((m: any) => ({ ...m, media_type: 'movie' }));
  } catch (e) {
    console.error('getTrendingMovies failed, falling back to mock:', e);
    return MOCK_TRENDING_MOVIES;
  }
}

export async function getTrendingTV() {
  if (isMockMode()) return MOCK_TRENDING_TV;
  try {
    const data = await tmdbFetch('/trending/tv/day');
    return data.results.slice(0, 10).map((m: any) => ({ ...m, media_type: 'tv' }));
  } catch (e) {
    console.error('getTrendingTV failed, falling back to mock:', e);
    return MOCK_TRENDING_TV;
  }
}

export async function getTrendingAnime() {
  if (isMockMode()) return MOCK_TRENDING_ANIME;
  try {
    // Discover TV shows, Animation genre (16), original language Japanese (ja), sorted by popularity
    const data = await tmdbFetch('/discover/tv?with_original_language=ja&with_genres=16&sort_by=popularity.desc');
    return data.results.slice(0, 10).map((m: any) => ({ ...m, media_type: 'tv' }));
  } catch (e) {
    console.error('getTrendingAnime failed, falling back to mock:', e);
    return MOCK_TRENDING_ANIME;
  }
}

export async function getMediaDetails(id: number, type: 'movie' | 'tv') {
  if (isMockMode()) {
    // Create detailed mock response
    const mockList = type === 'movie' ? MOCK_TRENDING_MOVIES : [...MOCK_TRENDING_TV, ...MOCK_TRENDING_ANIME];
    const found = mockList.find((m) => m.id === id) || mockList[0];
    
    const mockRatings = {
      imdb: found.vote_average ? (found.vote_average + 0.3).toFixed(1) : '7.8',
      rottenTomatoes: found.vote_average ? Math.round(found.vote_average * 10 + 5) + '%' : '85%',
      metacritic: found.vote_average ? Math.round(found.vote_average * 10).toString() : '78',
    };

    return {
      ...found,
      omdbRatings: mockRatings,
      genres: [
        { id: 1, name: type === 'movie' ? 'Sci-Fi' : 'Drama' },
        { id: 2, name: 'Adventure' },
      ],
      credits: {
        cast: [
          { id: 1, name: 'Timothée Chalamet', character: 'Paul Atreides', profile_path: null },
          { id: 2, name: 'Zendaya', character: 'Chani', profile_path: null },
          { id: 3, name: 'Florence Pugh', character: 'Princess Irulan', profile_path: null },
        ],
        crew: [
          { id: 10, name: 'Denis Villeneuve', job: 'Director' }
        ]
      },
      videos: {
        results: [
          { id: 'v1', key: 'dQw4w9WgXcQ', site: 'YouTube', type: 'Trailer' }
        ]
      },
      'watch/providers': {
        results: {
          US: {
            flatrate: [
              { provider_name: 'Netflix', logo_path: '/t2ee20G7nCttpx6Gyvxn2m04ue4.jpg' },
              { provider_name: 'Prime Video', logo_path: '/gG0gJDhrd14OFwV0K1KgflSR2FU.jpg' }
            ]
          },
          IN: {
            flatrate: [
              { provider_name: 'Netflix', logo_path: '/t2ee20G7nCttpx6Gyvxn2m04ue4.jpg' },
              { provider_name: 'JioCinema', logo_path: '/gG0gJDhrd14OFwV0K1KgflSR2FU.jpg' }
            ]
          }
        }
      }
    };
  }

  try {
    const tmdbData = await tmdbFetch(`/${type}/${id}?append_to_response=credits,videos,watch/providers,external_ids`);
    const imdbId = tmdbData.external_ids?.imdb_id;
    let omdbRatings: CriticRatings = {};
    if (imdbId) {
      omdbRatings = await getOmdbRatings(imdbId);
    }
    return {
      ...tmdbData,
      omdbRatings,
    };
  } catch (e) {
    console.error(`getMediaDetails failed for ${type} ${id}:`, e);
    // Return base mock structure
    return {
      id,
      title: type === 'movie' ? 'Mock Movie' : 'Mock TV Show',
      name: type === 'movie' ? 'Mock Movie' : 'Mock TV Show',
      overview: 'Details could not be fetched from TMDB. This is fallback overview.',
      genres: [{ id: 1, name: 'Unknown' }],
      credits: { cast: [], crew: [] },
      videos: { results: [] },
      'watch/providers': { results: {} },
      omdbRatings: { imdb: '7.5', rottenTomatoes: '78%', metacritic: '72' }
    };
  }
}

export async function searchMedia(query: string) {
  if (isMockMode() || !query) {
    const allMocks = [...MOCK_TRENDING_MOVIES, ...MOCK_TRENDING_TV, ...MOCK_TRENDING_ANIME];
    return allMocks.filter(m => {
      const name = ((m as any).title || (m as any).name || '').toLowerCase();
      return name.includes(query.toLowerCase());
    });
  }

  try {
    const data = await tmdbFetch(`/search/multi?query=${encodeURIComponent(query)}`);
    return data.results.filter((r: any) => r.media_type === 'movie' || r.media_type === 'tv');
  } catch (e) {
    console.error(`searchMedia failed for ${query}:`, e);
    return [];
  }
}

// Mood Mapping to TMDB keywords/genres
// Feel-Good: Comedy, Drama (Keywords: warm, feel-good, inspiring)
// Gritty: Crime, Thriller (Keywords: dark, gritty, crime)
// Tearjerker: Drama, Romance (Keywords: sad, tragic, emotional)
// Mind-Bending: Sci-Fi, Mystery, Thriller (Keywords: puzzle, mind-bending, surreal)
export const MOODS = [
  { id: 'feel-good', name: 'Feel-Good', genres: [35, 18], keywords: 'inspiring,warm,heartwarming' },
  { id: 'gritty', name: 'Gritty', genres: [80, 53], keywords: 'dark,gritty,crime' },
  { id: 'tearjerker', name: 'Tearjerker', genres: [18, 10749], keywords: 'sad,tragic,tearjerker' },
  { id: 'mind-bending', name: 'Mind-Bending', genres: [878, 9648, 53], keywords: 'mind-bending,surreal,puzzle' },
];

export async function getDiscoverMedia(type: 'movie' | 'tv', genreId?: string, moodId?: string) {
  if (isMockMode()) {
    let list = type === 'movie' ? MOCK_TRENDING_MOVIES : [...MOCK_TRENDING_TV, ...MOCK_TRENDING_ANIME];
    if (moodId) {
      // Return a filtered list based on mood mock mapping
      if (moodId === 'mind-bending') {
        return list.filter(m => ((m as any).title || (m as any).name || '').match(/Dune|Severance|Last of Us/i));
      }
      if (moodId === 'gritty') {
        return list.filter(m => ((m as any).title || (m as any).name || '').match(/Breaking Bad|Godzilla/i));
      }
      if (moodId === 'feel-good') {
        return list.filter(m => ((m as any).title || (m as any).name || '').match(/Kung Fu Panda|Frieren/i));
      }
      if (moodId === 'tearjerker') {
        return list.filter(m => ((m as any).title || (m as any).name || '').match(/Attack on Titan|Last of Us/i));
      }
    }
    return list;
  }

  try {
    let queryParams = `?sort_by=popularity.desc`;
    if (genreId) {
      queryParams += `&with_genres=${genreId}`;
    }
    if (moodId) {
      const mood = MOODS.find(m => m.id === moodId);
      if (mood) {
        // We filter by genres corresponding to the mood
        queryParams += `&with_genres=${mood.genres.join(',')}`;
      }
    }
    const data = await tmdbFetch(`/discover/${type}${queryParams}`);
    return data.results.map((m: any) => ({ ...m, media_type: type }));
  } catch (e) {
    console.error(`discoverMedia failed:`, e);
    return type === 'movie' ? MOCK_TRENDING_MOVIES : MOCK_TRENDING_TV;
  }
}

export interface CriticRatings {
  imdb?: string;
  rottenTomatoes?: string;
  metacritic?: string;
}

export async function getOmdbRatings(imdbId: string): Promise<CriticRatings> {
  const key = process.env.OMDB_API_KEY;
  if (!key || key === 'your-omdb-api-key' || key.trim() === '') {
    // Generate realistic consistent mock rating based on imdbId hash
    const hash = imdbId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const imdbVal = (7.2 + (hash % 18) / 10).toFixed(1);
    const rtVal = Math.round(72 + (hash % 23)) + '%';
    const metaVal = Math.round(68 + (hash % 25)).toString();
    return {
      imdb: imdbVal,
      rottenTomatoes: rtVal,
      metacritic: metaVal,
    };
  }

  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${key}&i=${imdbId}`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });
    if (!res.ok) throw new Error('OMDb API error');
    const data = await res.json();
    
    if (data.Response === 'False') return {};

    const ratings = data.Ratings || [];
    const rt = ratings.find((r: any) => r.Source === 'Rotten Tomatoes')?.Value;
    const meta = data.Metascore && data.Metascore !== 'N/A' ? data.Metascore : undefined;

    return {
      imdb: data.imdbRating && data.imdbRating !== 'N/A' ? data.imdbRating : undefined,
      rottenTomatoes: rt,
      metacritic: meta,
    };
  } catch (e) {
    console.error('getOmdbRatings failed:', e);
    return {};
  }
}

export async function getNewReleases() {
  if (isMockMode()) return MOCK_NEW_RELEASES;
  try {
    const data = await tmdbFetch('/movie/now_playing');
    return data.results.slice(0, 10).map((m: any) => ({ ...m, media_type: 'movie' }));
  } catch (e) {
    console.error('getNewReleases failed, falling back to mock:', e);
    return MOCK_NEW_RELEASES;
  }
}

