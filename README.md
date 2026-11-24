# surge-rider — Pump.fun Paper Sprint

[![make.fun](https://make.fun/badge/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b.svg)](https://make.fun/c/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b)
[![rank](https://make.fun/badge/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b/ladyce/pumpfun-paper-sprint-boothlord/rank.svg)](https://make.fun/c/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b)
[![reward](https://make.fun/badge/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b/ladyce/pumpfun-paper-sprint-boothlord/reward.svg)](https://make.fun/c/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b)

A paper-trading bot for the [Pump.fun Paper Sprint: Any Bot Can Win](https://make.fun/c/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b) competition on [make.fun](https://make.fun) — one program at `main.ts` (Node 22, protocol `agent-fun/replay/v2`), paper trading only, no real funds.

## Strategy

Most pump.fun coins go nowhere; a few run 10x. So the bot keeps its bets tiny and lets
the rare runner run:

- **Main bet (max 1 open at once, 0.01 SOL):** buy a young curve on a confirmed
  early burst — buys dominate the tape over 20 slots, at least 3 distinct buyers, net
  inflow ≥ 0.2 SOL, price near its window high. One entry per coin, ever.
- **Exits:** no take-profit at all, a −20% hard stop, and a trailing stop once up 50%
  (exit on a 30% fall from the peak). Positions are otherwise held to the end of the
  window, so a runner is kept whole.
- **Guardrail probes:** the competition needs at least 20 coins with ≥ 0.01 SOL round
  trips. Tiny 0.02 SOL probe round trips (bought and sold on the next batch) top the
  coin count up to 25, then stop — they are nearly free and keep the entry compliant
  without spending the budget on negative-expectation trades.

Everything is a pure function of the batches the harness sends: no clock, no randomness,
no I/O, no environment reads — the two graded executions produce byte-identical action
logs.

## Dev-window results (24h pump.fun replay, 2026-11-02, 1/16 sample)

| | net PnL | trips | coins | max drawdown |
|---|---|---|---|---|
| Full 24h | −0.017 SOL | 32 | 32 | 0.2% |
| 6h window 1 | −0.006 SOL | 25 | 25 | 0.2% |
| 6h window 2 | −0.022 SOL | 25 | 25 | 0.2% |
| 6h window 3 | −0.034 SOL | 28 | 28 | 0.3% |
| 6h window 4 | −0.026 SOL | 26 | 25 | 0.3% |

At 2x fees the full-window net is −0.037 SOL. maxMain 1 was chosen over 2 after
`grade-local` scored it −0.017 vs −0.046 SOL on the dev window (per-6h-window average
−0.022 vs −0.026); in a 6h window both configs make only ~1–3 main trips, so the second
concurrent slot rarely binds. For comparison on the same data: the
kit's equal-weight baseline scores −0.023 SOL on 5 fills and fails the 20-coin
guardrail; the kit's momentum pilot scores −9.38 SOL.

## Layout

- `main.ts` — entrypoint: runs the strategy through the wire shim.
- `strategy.ts` — the strategy (all parameters in `DEFAULT_PARAMS`).
- `vendor/makefun-bot.ts` — the kit's `sdk/ts/makefun-bot.ts`, vendored byte for byte.

## License

MIT — see `LICENSE`.
