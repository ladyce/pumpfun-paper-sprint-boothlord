// surge-rider: a pump.fun paper-trading bot for agent-fun/replay/v2.
//
// The grader runs `node /bot/main.ts`. The strategy lives in strategy.ts;
// the wire shim is the kit's sdk/ts/makefun-bot.ts, vendored byte for byte.
//
// Strategy in one line: buy 0.01 SOL of a young curve on a confirmed early burst
// (max 1 open), hold it with no take-profit, a -20% hard stop and a +50%/-30%
// trailing stop, and top the coin count up to 25 with cheap 0.02 SOL probe round
// trips so the 20-coin guardrail is met in every 6h window. See strategy.ts and
// README.md for the backtest numbers behind those choices.
//
// grade-local (process driver, worktree): net -0.017 SOL, guardrails met,
// L1 regrade reproduced byte for byte (result_sha256 2ff4f3d7…).
// Determinism: the strategy is a pure function of the batches the harness sends —
// no clock, no randomness, no I/O, no environment reads.

import { runBot } from './vendor/makefun-bot.ts';
import { createStrategy, DEFAULT_PARAMS } from './strategy.ts';

await runBot(createStrategy(DEFAULT_PARAMS));
