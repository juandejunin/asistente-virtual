// src/controllers/EconomyController.ts - VERSIÓN CORRECTA
import { Request, Response } from 'express';
import { ForexService } from '../services/forex/ForexService';
import { CryptoService } from '../services/crypto/CryptoService';
import { ExchangeService } from '../services/ExchangeService'; // ✅ TU servicio existente

export class EconomyController {
    // ✅ Dashboard global (Forex Internacional + Crypto)
    static async getGlobalDashboard(req: Request, res: Response) {
        try {
            console.log('🌍 Building global dashboard (using services directly)...');
            
            const [forexData, cryptoData] = await Promise.all([
                ForexService.getAllRates(),    // Forex global
                CryptoService.getTop5()        // Cripto
            ]);
            
            const dashboard = {
                forex: forexData,
                crypto: cryptoData,
                metadata: {
                    lastUpdated: new Date().toISOString(),
                    services: ['forex', 'crypto'],
                    status: 'operational'
                }
            };
            
            console.log('✅ Global dashboard ready');
            
            res.json({
                success: true,
                data: dashboard,
                timestamp: new Date().toISOString()
            });
            
        } catch (error: unknown) {
            console.error('❌ Global dashboard error:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to build global dashboard' 
            });
        }
    }

    // ✅ Dashboard ARGENTINA (usando TUS servicios)
    static async getArgentinaDashboard(req: Request, res: Response) {
        try {
            console.log('🇦🇷 Building Argentina dashboard...');
            
            const [dolaresData, cotizacionesData] = await Promise.all([
                ExchangeService.getDolares(),       // ✅ TU servicio directo
                ExchangeService.getCotizaciones()   // ✅ TU servicio directo
            ]);
            
            const dashboard = {
                argentina: {
                    dolares: dolaresData,
                    cotizaciones: cotizacionesData,
                    lastUpdated: new Date().toISOString()
                },
                metadata: {
                    source: 'Local ExchangeService',
                    status: 'operational'
                }
            };
            
            console.log('✅ Argentina dashboard ready');
            
            res.json({
                success: true,
                data: dashboard,
                timestamp: new Date().toISOString()
            });
            
        } catch (error: unknown) {
            console.error('❌ Argentina dashboard error:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to build Argentina dashboard' 
            });
        }
    }

    // ✅ Dashboard COMPLETO (Global + Argentina)
    static async getCompleteDashboard(req: Request, res: Response) {
        try {
            console.log('🌎 Building complete dashboard (Global + Argentina)...');
            
            const [forexData, cryptoData, dolaresData, cotizacionesData] = await Promise.all([
                ForexService.getAllRates(),
                CryptoService.getTop5(),
                ExchangeService.getDolares(),      // ✅ Directo
                ExchangeService.getCotizaciones()  // ✅ Directo
            ]);
            
            const dashboard = {
                global: {
                    forex: forexData,
                    crypto: cryptoData
                },
                argentina: {
                    dolares: dolaresData,
                    cotizaciones: cotizacionesData
                },
                metadata: {
                    lastUpdated: new Date().toISOString(),
                    services: ['forex', 'crypto', 'dolares', 'cotizaciones'],
                    status: 'operational'
                }
            };
            
            console.log('✅ Complete dashboard ready');
            
            res.json({
                success: true,
                data: dashboard,
                timestamp: new Date().toISOString()
            });
            
        } catch (error: unknown) {
            console.error('❌ Complete dashboard error:', error);
            
            // Dashboard de emergencia
            res.json({
                success: false,
                error: 'Some services failed',
                data: this.getEmergencyDashboard(),
                _fallback: true,
                timestamp: new Date().toISOString()
            });
        }
    }

    // ✅ Integrar ARS en ForexService (OPCIONAL - si quieres unificar)
    static async getUnifiedForex(req: Request, res: Response) {
        try {
            // 1. Forex internacional
            const forexGlobal = await ForexService.getAllRates();
            
            // 2. Dólar argentino (de TU servicio)
            const argentinaDolares = await ExchangeService.getDolares();
            
            // 3. Extraer ARS para integrar
            const arsRate = this.extractARSRate(argentinaDolares);
            
            const unifiedData = {
                // Mantener forex global
                ...forexGlobal,
                
                // ✅ Añadir ARS integrado
                integratedARS: {
                    value: arsRate,
                    source: 'Local ExchangeService',
                    type: 'blue' // o 'oficial' según lo que extraigas
                },
                
                // Datos completos de Argentina
                argentinaFull: argentinaDolares,
                
                timestamp: new Date().toISOString()
            };
            
            res.json({
                success: true,
                data: unifiedData,
                timestamp: new Date().toISOString()
            });
            
        } catch (error: unknown) {
            console.error('Unified forex error:', error);
            res.status(500).json({ success: false, error: 'Unification failed' });
        }
    }
    
    // ✅ Helper: extraer tasa ARS de tus datos
    private static extractARSRate(dolaresData: any): number {
        try {
            // Dependiendo de la estructura de tu API
            if (Array.isArray(dolaresData)) {
                // Si es array: [{nombre: "Blue", venta: 1250}, ...]
                const blue = dolaresData.find((d: any) => 
                    d.nombre?.toLowerCase() === 'blue' || 
                    d.casa?.toLowerCase() === 'blue'
                );
                return blue?.venta || blue?.value || 1000;
            } else if (dolaresData.blue || dolaresData.Blue) {
                // Si es objeto: {blue: 1250, oficial: 850}
                return dolaresData.blue || dolaresData.Blue || 1000;
            }
            return 1000; // Fallback
        } catch {
            return 1000;
        }
    }
    
    // ✅ Dashboard de emergencia
    private static getEmergencyDashboard(): any {
        return {
            global: {
                forex: { major: { EUR: 0.85, USD: 1.0 }, _fallback: true },
                crypto: { data: [{ name: 'Bitcoin', price: 65000 }], _fallback: true }
            },
            argentina: {
                dolares: { blue: 1000, oficial: 850, _fallback: true },
                cotizaciones: { _fallback: true }
            },
            _fallback: true
        };
    }
}