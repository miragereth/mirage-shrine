# Mirage Shrine

> A feat of marvel and engineering was built, its goal is to predict the future.

## Basics

- A Prophecy contains a date of resolution (_Horizon_), a statement (_Inquiry_), and an underlying token (_Essence_).
- Create (_Scry_) a Prophecy by filling in a form, and paying a creation fee (_Tribute_). Making Prophecies has a cost in order to deter flooding the Shrine with mundane matters, and contribute to its maintenance.
- Create conditional tokens (_Fates_) by locking (_distill_) Essence, creating an equal amount of _Yes_ and _No_ Fates.
- Withdraw essence by destroying (_blend_) equal amounts of Fates.
- Fates are ERC20 tokens, and as such they can be traded, stored, staked...
- The Shrine will provide market prices for buying and selling Fates on Uniswap V3, and shortcuts to creating and contributing to liquidity pools.
- Based on their market price, the Shrine will estimate the odds the market is assigning to each outcome.
- When the horizon comes, a question in [reality](reality.eth.limo) and arbitrated by [Kleros](kleros.io) will be open to answers. From that point onwards, Fates will refuse to be distilled apart, or blended together.
- When the question is answered with something valid, the Fate of that outcome will be able to ascend, and be exchanged for Essence on its entirety, whereas the Fate of the other outcome will not be recognized.
- If the question is answered as _Invalid_, as fateful punishment to those who gamble destiny, the Shrine will instead keep the Essence to award the maintainers.

## Considerations

### Illiquidity

Prediction markets can be highly volatile and illiquid. Compared to Omen, the Shrine does not enforce an internal AMM. In Omen, placing 20% / 80% odds, would imply being forced to buy and sell at those odds, for both outcomes. With the aid of Uniswap V3, it is possible to provide one sided liquidity, which means it is closer to putting a token on sale.

Otherwise, Fate tokens are ERC20 compatible, and can be traded with order books, OTC, staked, among other uses.

### Subjective Oracle

Decentralized resolution of prediction markets is a recent area of research. The Shrine hears from a truth provider known as Reality, and arbitrated by Kleros. The Shrine does not handle the situation internally, allowing it to not engage in complicated matters such as Augur.

### Maladjusted odds

Due to the wildness of prediction markets, and the freedom the creed of the Mirage Shrine provides, the market price of Fate tokens will not necessarily add up to 100%. The Shrine does not concern itself with vanity, but distinct strategies have been found to establish Fate equilibrium.

If the market buy price of both Fates adds up to below 100%, any rational follower will acquire both types of Fates, respecting their current balance, until they add up to 100%. Then, the Fates will be blended back into Essence, the excess fattening the estate of the virtuous believer.

If the market sell price of both Fates adds up to over 100%, any rational follower will distill Essence into Fates, sell those Fates in equal proportion, the surplus elevating the vault of the faithful.
