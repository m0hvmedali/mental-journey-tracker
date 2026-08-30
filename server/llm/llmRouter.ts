import { LLMProvider, LLMGenerationRequest, LLMGenerationResponse } from './types';
import { GeminiProvider } from './providers/geminiProvider';
import { GroqProvider } from './providers/groqProvider';
import { DeepSeekProvider } from './providers/deepseekProvider';
import { OpenRouterProvider } from './providers/openrouterProvider';
import { MockProvider } from './providers/mockProvider';

interface CircuitBreakerState {
  consecutiveFailures: number;
  status: 'healthy' | 'temporarily_unhealthy';
  cooldownUntil: number;
}

export class LLMRouter {
  private static providers: LLMProvider[] = [
    new GeminiProvider(),
    new GroqProvider(),
    new DeepSeekProvider(),
    new OpenRouterProvider()
  ];

  private static mockProvider = new MockProvider();

  // In-memory circuit breaker state. Safe for Vercel warm starts.
  private static breakerStates: Record<string, CircuitBreakerState> = {};

  private static getBreakerState(providerName: string): CircuitBreakerState {
    if (!this.breakerStates[providerName]) {
      this.breakerStates[providerName] = {
        consecutiveFailures: 0,
        status: 'healthy',
        cooldownUntil: 0
      };
    }
    return this.breakerStates[providerName];
  }

  private static getCooldownDurationMs(): number {
    const customCooldown = process.env.CIRCUIT_BREAKER_COOLDOWN_SEC;
    if (customCooldown) {
      const parsed = parseInt(customCooldown, 10);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed * 1000;
      }
    }
    return 5 * 60 * 1000; // Default 5 minutes
  }

  /**
   * Evaluates if an error should trigger a circuit breaker failure
   */
  private static isFailoverError(err: any): boolean {
    const msg = (err.message || '').toLowerCase();
    // HTTP status codes or generic failover phrases
    if (
      msg.includes('429') ||
      msg.includes('500') ||
      msg.includes('502') ||
      msg.includes('503') ||
      msg.includes('timeout') ||
      msg.includes('network') ||
      msg.includes('rate_limit') ||
      msg.includes('quota') ||
      msg.includes('unavailable') ||
      msg.includes('fetch failed')
    ) {
      return true;
    }
    return true; // Default to failover for maximum robustness
  }

  /**
   * Main route/fallback generator
   */
  public static async generate(request: LLMGenerationRequest): Promise<LLMGenerationResponse> {
    const errors: Record<string, string> = {};
    const fallbackUsed: string[] = [];

    for (const provider of this.providers) {
      const state = this.getBreakerState(provider.name);
      const now = Date.now();

      // Check if provider is available by environment variables
      if (!provider.isAvailable()) {
        continue;
      }

      // Check circuit breaker status
      if (state.status === 'temporarily_unhealthy') {
        if (now < state.cooldownUntil) {
          console.warn(`[Circuit Breaker] Skipping provider ${provider.name} (temporarily unhealthy, cooldown until ${new Date(state.cooldownUntil).toISOString()})`);
          fallbackUsed.push(provider.name);
          continue;
        } else {
          // Cooldown expired, transition to half-open (try again)
          console.log(`[Circuit Breaker] Provider ${provider.name} cooldown expired. Retrying...`);
        }
      }

      try {
        console.log(`[LLMRouter] Attempting generation with provider: ${provider.name}`);
        const response = await provider.generateResponse(request);

        // Success! Reset circuit breaker state
        state.consecutiveFailures = 0;
        state.status = 'healthy';
        state.cooldownUntil = 0;

        return {
          ...response,
          isFallback: fallbackUsed.length > 0
        };
      } catch (err: any) {
        console.error(`[LLMRouter] Provider ${provider.name} failed: ${err.message || err}`);
        errors[provider.name] = err.message || String(err);
        fallbackUsed.push(provider.name);

        if (this.isFailoverError(err)) {
          state.consecutiveFailures += 1;
          if (state.consecutiveFailures >= 3) {
            const cooldownMs = this.getCooldownDurationMs();
            state.status = 'temporarily_unhealthy';
            state.cooldownUntil = now + cooldownMs;
            console.error(`[Circuit Breaker] Provider ${provider.name} tripped! State: temporarily_unhealthy for next ${cooldownMs / 1000} seconds.`);
          }
        }
      }
    }

    // Ultimate fallback to local mock synthesizer if all else fails
    console.warn('[LLMRouter] All LLM providers failed or are unavailable. Resorting to local rule-based synthesizer.');
    try {
      const response = await this.mockProvider.generateResponse(request);
      return {
        ...response,
        isFallback: true
      };
    } catch (err: any) {
      throw new Error(`All LLM providers failed. Errors: ${JSON.stringify(errors)}. Local synthesizer also failed: ${err.message}`);
    }
  }
}
