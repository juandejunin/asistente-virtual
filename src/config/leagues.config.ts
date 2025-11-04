// src/config/leagues.config.ts
export const SEASON = 2025;

export const LEAGUES_CONFIG = [
  { slug: "la-liga",               id: 140, name: "La Liga",                country: "España" },
  { slug: "premier-league",        id: 39,  name: "Premier League",         country: "Inglaterra" },
  { slug: "serie-a",               id: 135, name: "Serie A",                country: "Italia" },
  { slug: "bundesliga",            id: 78,  name: "Bundesliga",             country: "Alemania" },
  { slug: "ligue-1",               id: 61,  name: "Ligue 1",                country: "Francia" },
  { slug: "liga-profesional",      id: 128, name: "Liga Profesional",       country: "Argentina" },
  { slug: "brasileirao",           id: 71,  name: "Brasileirão",            country: "Brasil" },
  { slug: "mls",                   id: 253, name: "Major League Soccer",    country: "USA" },
  { slug: "liga-mx",               id: 262, name: "Liga MX",                country: "México" },
  { slug: "liga-betplay",          id: 239, name: "Liga BetPlay",           country: "Colombia" },
  { slug: "primera-chile",         id: 267, name: "Primera División",       country: "Chile" },
  { slug: "primera-uruguay",       id: 268, name: "Primera División",       country: "Uruguay" },
  { slug: "primera-paraguay",      id: 269, name: "Primera División",       country: "Paraguay" }
];

// Mapa: slug → config
export const SLUG_TO_LEAGUE = Object.fromEntries(
  LEAGUES_CONFIG.map(l => [l.slug, l])
);

// Mapa: id → slug
export const ID_TO_SLUG = Object.fromEntries(
  LEAGUES_CONFIG.map(l => [l.id, l.slug])
);