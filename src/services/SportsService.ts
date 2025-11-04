// import { SportsCacheModel, ISportsCache } from "../models/SportsCache";
// import { SportsArchiveModel, ISportsArchive } from "../models/SportsArchive";

// export class SportsService {
//   private static API_KEY = process.env.SPORTS_API_KEY!;
//   private static BASE_URL = 'https://v3.football.api-sports.io';
//   private static TOP_LEAGUE_IDS = [39, 140, 135, 78, 61, 2, 3,128];

// // --- Método para refrescar cache y guardar histórico ---
// static async refreshCache() {
//   const types: ("top" | "last24" | "tournament")[] = ["top", "last24", "tournament"];

//   for (const type of types) {
//     // Para 'top' ignoramos el límite y traemos todos los partidos de las ligas seleccionadas
//     const limit = type === "last24" ? 20 : type === "tournament" ? null : null;
//     const data = await this.fetchAndFilter(type, limit);

//     // Guardar en cache
//     await SportsCacheModel.findOneAndUpdate(
//       { type },
//       { data, updatedAt: new Date() },
//       { upsert: true }
//     );

//     // Guardar histórico
//     await SportsArchiveModel.create({ type, data });
//   }

//   console.log("✅ Cache y archivo histórico actualizados:", new Date().toISOString());
// }

// // --- Función reutilizable existente ---
// private static async fetchAndFilter(
//   type: "top" | "last24" | "tournament",
//   limit: number | null
// ) {
//   try {
//     const yesterday = new Date();
//     yesterday.setDate(yesterday.getDate() - 1);
//     const date = yesterday.toISOString().split('T')[0];

//     const url = `${this.BASE_URL}/fixtures?date=${date}`;

//     const response = await fetch(url, {
//       method: 'GET',
//       headers: { 'x-apisports-key': this.API_KEY },
//     });

//     if (!response.ok) throw new Error(`HTTP ${response.status}`);

//     const data = await response.json();
//     let fixtures = data.response || [];

//     // Filtrar solo ligas definidas en TOP_LEAGUE_IDS
//     fixtures = fixtures.filter((f: any) => this.TOP_LEAGUE_IDS.includes(f.league.id));

//     // Ordenar por importancia de la liga
//     fixtures.sort((a: any, b: any) =>
//       this.TOP_LEAGUE_IDS.indexOf(a.league.id) - this.TOP_LEAGUE_IDS.indexOf(b.league.id)
//     );

//     // Aplicar límite solo si existe (null ignora)
//     if (limit) fixtures = fixtures.slice(0, limit);

//     return fixtures.map((f: any) => ({
//       league: f.league.name,
//       home: f.teams.home.name,
//       away: f.teams.away.name,
//       homeGoals: f.goals.home ?? '-',
//       awayGoals: f.goals.away ?? '-',
//       status: f.fixture.status.short,
//       time: new Date(f.fixture.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
//     }));
//   } catch (err: any) {
//     console.error(`Error en ${type}:`, err.message);
//     throw err;
//   }
// }

//   // --- Función existente para obtener de cache ---
//   static async getCached(type: "top" | "last24" | "tournament") {
//     const cache = await SportsCacheModel.findOne({ type });
//     return cache?.data || [];
//   }

// }

// src/services/SportsService.ts
import { SportsCacheModel, ISportsCache } from "../models/SportsCache";
import { SportsArchiveModel, ISportsArchive } from "../models/SportsArchive";

export class SportsService {
  private static API_KEY = process.env.SPORTS_API_KEY!;
  private static BASE_URL = "https://v3.football.api-sports.io";
  private static TOP_LEAGUE_IDS = [39, 140, 135, 78, 61, 2, 3, 128];

  static async refreshCache() {
    const types: ("top" | "last24" | "tournament")[] = [
      "top",
      "last24",
      "tournament",
    ];

    for (const type of types) {
      const limit = type === "last24" ? 20 : null;
      const data = await this.fetchAndFilter(type, limit);

      // ⚠️ Si no hay datos, no guardar histórico vacío
      if (!data || data.length === 0) {
        console.warn(
          `⚠️ No se encontraron datos para ${type}, se omite guardado.`
        );
        continue;
      }

      // Guardar en cache
      await SportsCacheModel.findOneAndUpdate(
        { type },
        { data, updatedAt: new Date() },
        { upsert: true }
      );

      // Guardar histórico
      await SportsArchiveModel.create({ type, data });
    }

    console.log(
      "✅ Cache y archivo histórico actualizados:",
      new Date().toISOString()
    );
  }

  static async getCached(type: "top" | "last24" | "tournament") {
    console.log(`🔍 Buscando datos en histórico para ${type}...`);

    // 1️⃣ Buscar el archivo más reciente con datos
    const archive = await SportsArchiveModel.findOne({
      type,
      "data.0": { $exists: true }, // asegura que haya al menos 1 elemento
    })
      .sort({ createdAt: -1 })
      .lean();

    if (archive && archive.data && archive.data.length > 0) {
      console.log(
        `✅ Recuperado ${type} desde histórico (${archive.createdAt.toISOString()}), con ${
          archive.data.length
        } partidos.`
      );
      return archive.data;
    }

    console.warn(
      `⚠️ No se encontraron datos válidos en histórico para ${type}, buscando en cache...`
    );

    // 2️⃣ Si el histórico no tiene datos, buscar en cache
    const cache = await SportsCacheModel.findOne({ type }).lean();

    if (cache && cache.data && cache.data.length > 0) {
      console.log(`✅ Recuperado ${type} desde cache.`);
      return cache.data;
    }

    console.warn(`⚠️ No se encontraron datos en cache para ${type}.`);
    return [];
  }

  private static async fetchAndFilter(
    type: "top" | "last24" | "tournament",
    limit: number | null
  ) {
    const maxDaysBack = 3;
    for (let i = 1; i <= maxDaysBack; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formattedDate = date.toISOString().split("T")[0];

      console.log(`🔍 Buscando partidos de ${formattedDate} para ${type}...`);
      const url = `${this.BASE_URL}/fixtures?date=${formattedDate}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "x-apisports-key": this.API_KEY },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      let fixtures = data.response || [];

      if (fixtures.length > 0) {
        // filtrar y retornar
        fixtures = fixtures.filter((f: any) =>
          this.TOP_LEAGUE_IDS.includes(f.league.id)
        );
        if (limit) fixtures = fixtures.slice(0, limit);
        return fixtures.map((f: any) => ({
          league: f.league.name,
          home: f.teams.home.name,
          away: f.teams.away.name,
          homeGoals: f.goals.home ?? "-",
          awayGoals: f.goals.away ?? "-",
          status: f.fixture.status.short,
          time: new Date(f.fixture.date).toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));
      }
    }

    console.warn(`⚠️ No se encontraron partidos recientes para ${type}`);
    return [];
  }
}
