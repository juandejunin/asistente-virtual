// src/services/crypto/CryptoService.ts
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 120 }); // Cache de 2 minutos

export class CryptoService {
    private static BASE_URL = 'https://api.coingecko.com/api/v3';

    static async getTopCryptos(limit: number = 10): Promise<any> {
        const cacheKey = `crypto_top_${limit}`;
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        try {
            // ✅ Usando AbortSignal.timeout (Node.js 18+)
            const response = await fetch(
                `${this.BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1`,
                { signal: AbortSignal.timeout(10000) }
            );
            
            if (!response.ok) {
                throw new Error(`CoinGecko API: ${response.status}`);
            }
            
            const coins = await response.json();
            
            const processedData = coins.map((coin: any) => ({
                id: coin.id,
                name: coin.name,
                symbol: coin.symbol.toUpperCase(),
                price: coin.current_price,
                change24h: coin.price_change_percentage_24h,
                marketCap: coin.market_cap,
                volume24h: coin.total_volume,
                image: coin.image,
                lastUpdated: coin.last_updated
            }));
            
            cache.set(cacheKey, processedData);
            return processedData;
            
        } catch (error: unknown) {
            console.error('Error fetching crypto:', 
                error instanceof Error ? error.message : String(error)
            );
            
            // ✅ Fallback: datos cacheados antiguos
            const oldCache = cache.get(cacheKey);
            if (oldCache) {
                console.log('⚠️ Using cached crypto data due to API failure');
                return oldCache;
            }
            
            // ✅ Fallback: datos por defecto
            return this.getFallbackCryptoData(limit);
        }
    }

    // ✅ NUEVO: Método para cripto específica
    static async getCryptoById(id: string): Promise<any> {
        const cacheKey = `crypto_${id}`;
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        try {
            const response = await fetch(
                `${this.BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
                { signal: AbortSignal.timeout(8000) }
            );
            
            if (!response.ok) throw new Error(`CoinGecko API: ${response.status}`);
            
            const coin = await response.json();
            
            const processedData = {
                id: coin.id,
                name: coin.name,
                symbol: coin.symbol.toUpperCase(),
                price: coin.market_data.current_price.usd,
                change24h: coin.market_data.price_change_percentage_24h,
                marketCap: coin.market_data.market_cap.usd,
                volume24h: coin.market_data.total_volume.usd,
                high24h: coin.market_data.high_24h.usd,
                low24h: coin.market_data.low_24h.usd,
                image: coin.image.large,
                lastUpdated: coin.last_updated
            };
            
            cache.set(cacheKey, processedData, 120);
            return processedData;
            
        } catch (error: unknown) {
            console.error(`Error fetching crypto ${id}:`, error);
            return null;
        }
    }

    // ✅ NUEVO: Top 5 criptos (para sección resumen)
    static async getTop5(): Promise<any> {
        return this.getTopCryptos(5);
    }

    // ✅ Fallback data
    private static getFallbackCryptoData(limit: number): any[] {
        console.log('⚠️ Using fallback crypto data');
        
        const fallbackData = [
            {
                id: 'bitcoin',
                name: 'Bitcoin',
                symbol: 'BTC',
                price: 65000,
                change24h: 2.5,
                marketCap: 1.28e12,
                volume24h: 32000000000,
                image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
                lastUpdated: new Date().toISOString(),
                _fallback: true
            },
            {
                id: 'ethereum',
                name: 'Ethereum',
                symbol: 'ETH',
                price: 3500,
                change24h: 1.8,
                marketCap: 420000000000,
                volume24h: 15000000000,
                image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
                lastUpdated: new Date().toISOString(),
                _fallback: true
            },
            // ... puedes agregar más
        ];
        
        return fallbackData.slice(0, limit);
    }
}