// // src/services/CurrencyService.ts

// export class CurrencyService {
//   private static API_URL = "https://api.frankfurter.app/latest?from=USD&to=EUR,ARS,BRL";

//   /**
//    * Obtiene las cotizaciones más recientes.
//    * @param base Moneda base (por defecto USD)
//    */
//   static async getRates(base: string = 'USD') {
//     try {
//       const url = new URL(this.API_URL);
//       url.searchParams.set('base', base);
//       url.searchParams.set('symbols', 'USD,EUR,ARS,BRL');

//       const res = await fetch(url.toString(), {
//         headers: { Accept: 'application/json' },
//       });

//       if (!res.ok) {
//         throw new Error(`HTTP ${res.status} ${res.statusText}`);
//       }

//       const data = await res.json();
//       return data;
//     } catch (error) {
//       console.error('Error al obtener cotizaciones:', error);
//       throw new Error('No se pudo obtener la información de divisas');
//     }
//   }
// }


// src/services/ExchangeService.ts
export class ExchangeService {
  private static FRANKFURTER_URL = "https://api.frankfurter.app/latest";
  private static BLUELYTICS_URL = "https://api.bluelytics.com.ar/v2/latest";

  static async getRates(base = "USD") {
    try {
      // 1️⃣ Frankfurter
      const symbols = ["USD","EUR","BRL","MXN"];
      const frankfurterRes = await fetch(`${this.FRANKFURTER_URL}?from=${base}&to=${symbols.join(",")}`);
      if (!frankfurterRes.ok) throw new Error(`Frankfurter HTTP ${frankfurterRes.status}`);
      const frankfurterData = await frankfurterRes.json();

      // 2️⃣ Bluelytics
      const bluelyticsRes = await fetch(this.BLUELYTICS_URL);
      if (!bluelyticsRes.ok) throw new Error(`Bluelytics HTTP ${bluelyticsRes.status}`);
      const bluelyticsData = await bluelyticsRes.json();

      // 3️⃣ Consolidar
      const result = {
        base: frankfurterData.base,
        date: frankfurterData.date,
        rates: {
          ...frankfurterData.rates,
          ARS_oficial: bluelyticsData.oficial.value_avg,
          ARS_blue: bluelyticsData.blue.value_avg,
          EUR_oficial: bluelyticsData.oficial_euro.value_avg,
          EUR_blue: bluelyticsData.blue_euro.value_avg,
        },
      };

      return result;
    } catch (err) {
      console.error("Error obteniendo cotizaciones:", err);
      throw err;
    }
  }
}
