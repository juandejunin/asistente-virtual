// src/services/SeasonService.ts
export class SeasonService {
  private static API_KEY = process.env.SPORTS_API_KEY!;
  private static BASE_URL = 'https://v3.football.api-sports.io';
  private static SEASON = 2025;

  static async getStandings(leagueId: number) {
    return this.fetch(`/standings?season=${this.SEASON}&league=${leagueId}`);
  }

  static async getTopScorers(leagueId: number) {
    return this.fetch(`/players/topscorers?season=${this.SEASON}&league=${leagueId}`);
  }

  static async getTopAssists(leagueId: number) {
    return this.fetch(`/players/topassists?season=${this.SEASON}&league=${leagueId}`);
  }

  static async getFixtures(leagueId: number) {
    return this.fetch(`/fixtures?season=${this.SEASON}&league=${leagueId}`);
  }

  static async getLeastConceded(leagueId: number) {
    const standings = await this.getStandings(leagueId);
    if (!standings.response?.[0]?.league?.standings?.[0]) return [];
    return standings.response[0].league.standings[0]
      .map((t: any) => ({
        team: t.team.name,
        goalsAgainst: t.goals.against,
        played: t.all.played,
      }))
      .sort((a: any, b: any) => a.goalsAgainst - b.goalsAgainst);
  }

  private static async fetch(endpoint: string) {
    const url = `${this.BASE_URL}${endpoint}`;
    const res = await fetch(url, {
      headers: { 'x-apisports-key': this.API_KEY },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${url}`);
    const data = await res.json();
    return data;
  }
}