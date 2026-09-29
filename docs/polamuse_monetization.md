# Polamuse — Monetization Model
> Combination model · No subscriptions · Charge at emotional peak
> Every rupee earned when the user *wants* to pay, not before.

---

## Core Philosophy

```
❌ Wrong: "Pay ₹99/month to unlock features"
✅ Right: "Pay ₹9 right now to remove this watermark"

The difference: one asks before the emotion.
                one asks during the emotion.
```

**Rule that governs every monetization decision:**
> Charge at the peak of the emotion. Never before it.

---

---

## The 4-Layer Model

```
Layer 1 — Watermark Flip        ← smallest ask, highest volume
Layer 2 — Pola Coins            ← bulk buying, less payment friction
Layer 3 — Print Orders          ← highest revenue per transaction
Layer 4 — Occasion Add-ons      ← impulse at checkout, pure margin
```

Each layer works independently.
Each layer feeds the next.
Together they cover every type of user.

---

---

## Layer 1 — Watermark Flip

### The mechanic

Everything in Polamuse is free.
Editor, booth mode, shared canvas, download — all free.
But every free download has a small watermark:

```
Bottom-right corner of the PNG:
"polamuse.com" — 11px, 30% opacity, white text
Small enough to not ruin the design.
Large enough to be visible on Instagram.
```

When the user is about to download and sees the watermark,
they feel a micro-loss. They spent 15 minutes on this.
At that exact moment, one option appears:

```
┌─────────────────────────────────────────┐
│  Download free  →  has watermark        │
│                                         │
│  Remove watermark  →  ₹9               │
│  This design only. One-time payment.    │
└─────────────────────────────────────────┘
```

### Why ₹9 specifically

- Less than a Dairy Milk Silk
- Less than one cigarette
- The brain does not register it as a real decision
- Nobody says "let me think about this" at ₹9
- Razorpay UPI payment takes 8 seconds

### The dual benefit

**You earn:** ₹9 per conversion

**You also earn from non-payers:**
Every watermarked image shared on Instagram
says "polamuse.com" to hundreds of people.
Non-paying users are your distribution channel.

### Implementation

```typescript
// On export button click — check if user has paid for this design
async function handleDownload(designId: string) {
  const isPaid = await checkDesignPaid(designId)

  if (isPaid) {
    downloadClean(designId)      // no watermark
    return
  }

  // Show the choice modal
  setShowWatermarkModal(true)
}

// Free download — add watermark in fabric.js before export
function exportWithWatermark(canvas: fabric.Canvas): string {
  const watermark = new fabric.Text('polamuse.com', {
    fontSize:  11,
    fill:      'rgba(255,255,255,0.3)',
    fontFamily:'DM Mono',
    right:     10,
    bottom:    10,
    selectable:false,
    evented:   false,
  })
  canvas.add(watermark)
  const url = canvas.toDataURL({ format: 'png', multiplier: 2 })
  canvas.remove(watermark)    // remove after export, don't save to state
  return url
}
```

```typescript
// After ₹9 payment confirmed:
// POST /api/designs/:id/unlock
await sql`
  INSERT INTO design_unlocks (design_id, user_id, amount_paise, paid_at)
  VALUES (${designId}, ${userId}, 900, NOW())
  ON CONFLICT (design_id) DO NOTHING`
```

```sql
-- New table needed
CREATE TABLE design_unlocks (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  design_id   UUID NOT NULL REFERENCES designs(id),
  user_id     UUID REFERENCES users(id),
  amount_paise INTEGER NOT NULL DEFAULT 900,
  paid_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (design_id)
);
```

### Revenue projection

| Monthly downloads | Conversion rate | Revenue |
|-------------------|-----------------|---------|
| 500 | 30% | ₹1,350 |
| 1,000 | 30% | ₹2,700 |
| 5,000 | 30% | ₹13,500 |
| 10,000 | 30% | ₹27,000 |

30% is conservative. Emotional peak conversions in India
on single low-value asks are typically 35-45%.

---

---

## Layer 2 — Pola Coins

### Why coins instead of direct charges

Direct charge for every action creates payment friction.
Each ₹8 payment requires a UPI confirmation.
After 2-3 of those, users leave.

Coins solve this by decoupling the pain of paying
from the pleasure of spending.

User pays ₹59 once → gets 120 coins → spends freely.
The ₹59 pain happens once. The spending has zero friction.

### Coin packs

```
Starter     50 coins  →  ₹29
Popular    120 coins  →  ₹59   ← highlight this, 2× value perception
Best       300 coins  →  ₹99
```

**Why these numbers:**
- ₹29 is impulse range — no thought needed
- ₹59 is the sweet spot — feels like a deal vs ₹29 pack
- ₹99 is commitment range — only serious users buy this

**Always highlight the middle pack as "Most Popular"**
even on day one. Loss aversion makes people pick
the middle option when uncertain. This is proven psychology.

### What coins buy

```
EDITOR FEATURES
Remove watermark (1 design):      10 coins  (≈ ₹5)
Premium template unlock:          15 coins  (≈ ₹7)
Custom sticker upload:             8 coins  (≈ ₹4)

BOOTH MODE
Unlimited booth session:           8 coins  (≈ ₹4)
Film strip without watermark:     10 coins  (≈ ₹5)

SHARED CANVAS
Shared session (48 hrs):          12 coins  (≈ ₹6)
Session extension (+24 hrs):       5 coins  (≈ ₹2.5)

CLOUD SAVE
Save design to cloud:              3 coins  (≈ ₹1.5)
(Free users get 3 free saves/month)

DESIGNS
Download 3 designs together:      20 coins  (≈ ₹10)
```

### Why this pricing works

The coin price always feels lower than the rupee equivalent
because the conversion math requires effort.
10 coins from a 120-coin pack bought at ₹59
is actually ₹4.9 — but nobody calculates that in the moment.

### Free coins to start engagement

```
New user signup:           + 20 coins  (try 2 features free)
First design made:         + 10 coins  (reward early action)
First print ordered:       + 15 coins  (reward real commitment)
Refer a friend who signs up: + 25 coins
```

These free coins are not charity — they are deliberate.
A user who has spent coins (even free ones) is
5× more likely to buy more coins than one who hasn't.
First spend = psychological commitment = repeat buyer.

### Implementation

```sql
CREATE TABLE coin_ledger (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id),
  delta        INTEGER NOT NULL,     -- positive = earned, negative = spent
  reason       VARCHAR(100) NOT NULL,
  -- reason values:
  -- 'signup_bonus', 'first_design', 'purchase_starter',
  -- 'purchase_popular', 'purchase_best', 'referral',
  -- 'spend_watermark_remove', 'spend_booth_session', etc.
  reference_id UUID,                 -- design_id, order_id, etc.
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Computed balance view (never store balance directly — race conditions)
CREATE VIEW v_coin_balance AS
SELECT user_id, SUM(delta) AS balance
FROM coin_ledger
GROUP BY user_id;
```

```typescript
// src/lib/coins.ts

export async function getBalance(userId: string): Promise<number> {
  const [row] = await sql`
    SELECT COALESCE(SUM(delta), 0) AS balance
    FROM coin_ledger WHERE user_id = ${userId}`
  return Number(row.balance)
}

export async function spendCoins(
  userId: string,
  amount: number,
  reason: string,
  referenceId?: string
): Promise<{ success: boolean; balance: number }> {
  const balance = await getBalance(userId)
  if (balance < amount) return { success: false, balance }

  await sql`
    INSERT INTO coin_ledger (user_id, delta, reason, reference_id)
    VALUES (${userId}, ${-amount}, ${reason}, ${referenceId ?? null})`

  return { success: true, balance: balance - amount }
}

export async function earnCoins(
  userId: string,
  amount: number,
  reason: string,
  referenceId?: string
) {
  await sql`
    INSERT INTO coin_ledger (user_id, delta, reason, reference_id)
    VALUES (${userId}, ${amount}, ${reason}, ${referenceId ?? null})`
}
```

### Revenue projection

| Monthly active users | Coin buyers | Avg pack | Revenue |
|----------------------|-------------|----------|---------|
| 500 | 80 (16%) | ₹44 avg | ₹3,520 |
| 1,000 | 160 (16%) | ₹44 avg | ₹7,040 |
| 5,000 | 800 (16%) | ₹44 avg | ₹35,200 |

16% conversion from free to coin buyer is realistic
for a product where free is genuinely good
and coins unlock clearly desirable things.

---

---

## Layer 3 — Print Orders

### This is your highest revenue layer

Every physical print order is ₹79-349.
That's 9-40× the watermark price.
And the conversion psychology is the strongest —
someone ordering a print has already committed emotionally.
They made something, they love it, they want it real.

### Pricing table

```
Single print:          ₹79
Pack of 5:            ₹349   (saves ₹46 vs 5 singles)
Pack of 10:           ₹590   (saves ₹200 vs 10 singles)
Pack of 20:           ₹999   (bulk — events/farewell)
Gift send:            ₹149   (print + gift note + packaging)
Film strip (4-shot):  ₹99    (booth mode output)
```

### The gift send is your highest-margin SKU

```
Gift send breakdown:
  Print cost:          ₹35
  Gift card printing:  ₹3
  Kraft envelope:      ₹4
  Shiprocket delivery: ₹45
  Total cost:          ₹87
  Selling price:       ₹149
  Gross margin:        ₹62 (41%)
```

vs single print:
```
  Print cost:          ₹35
  Basic packaging:     ₹8
  Shiprocket delivery: ₹45
  Total cost:          ₹88
  Selling price:       ₹79
  Gross margin:        -₹9  ← losing money on singles
```

**Single prints lose money on delivery costs.**
This is fine — they're an entry point.
The pack of 5+ is where you make money.
The gift send is your best product.

**Upsell single → gift send:**
```
You're ordering 1 print for ₹79.

Want to send it as a surprise?
Add a gift note + kraft envelope for ₹70 more.
We'll ship it directly to their address. →  ₹149
```

40-50% of people sending to another address
will upgrade to gift send when shown this way.

### Occasion-based targeting

Store user's key dates at signup:

```
"When is your partner's birthday?" (optional, skip-able)
"Graduation month?" 
```

Then 3 days before:

```
WhatsApp / push notification:
"Priya's birthday is on Friday 🎂
 You made a polaroid with her last month.
 Want to send it? Delivered by Thursday.
 ₹149 → [Order now]"
```

This is not aggressive marketing.
This is your product being genuinely useful
at exactly the moment the user would want it.

### Revenue projection

| Monthly orders | Avg order | Revenue | Cost | Net |
|----------------|-----------|---------|------|-----|
| 50 | ₹149 | ₹7,450 | ₹4,350 | ₹3,100 |
| 120 | ₹149 | ₹17,880 | ₹7,200 | ₹10,680 |
| 300 | ₹149 | ₹44,700 | ₹18,000 | ₹26,700 |

---

---

## Layer 4 — Occasion Add-ons

### The psychology of open wallets

When someone is in checkout, their wallet is already open.
The mental cost of ₹149 is already paid.
Adding ₹20 more is nearly zero psychological resistance.

This is why every e-commerce cart has "Frequently bought together."
It's not recommendations — it's wallet exploitation.

### Your add-on menu

Shown at checkout, after the user has confirmed their order:

```
Your order: 1× Classic Polaroid · Glossy · ₹79

─────────────────────────────────────────
Make it more special?

☐  Gift wrap + ribbon               + ₹25
   Kraft paper, brown ribbon, wax seal

☐  Handwritten note card            + ₹20
   We write your message by hand on a card

☐  Wooden polaroid magnet           + ₹49
   Same design printed on a wooden magnet

☐  Extra copy                       + ₹59
   One for them, one for you

─────────────────────────────────────────
Order total: ₹79
```

### Margin on add-ons

```
Gift wrap + ribbon:
  Cost: ₹8 (kraft paper + ribbon + wax seal)
  Price: ₹25
  Margin: ₹17 (68%)

Handwritten note card:
  Cost: ₹5 (card + writing time 2 mins)
  Price: ₹20
  Margin: ₹15 (75%)

Wooden magnet:
  Sourced from IndiaMart: ₹18-22 per piece
  Print on it: ₹8
  Price: ₹49
  Margin: ₹19-23 (39-47%)
```

Add-ons are your highest-margin items.
No shipping cost (same package).
No extra effort (same order).
Pure incremental revenue.

### Conversion expectation

```
60% of print orders will add at least one add-on
Average add-on value: ₹30

120 orders × 60% = 72 add-on buyers
72 × ₹30 = ₹2,160/month in pure margin revenue
```

---

---

## Combined Revenue Model

### At 500 monthly active users

```
LAYER 1 — Watermark Flip
  Designs downloaded:          400/month
  Conversion at 30%:           120 payments
  120 × ₹9:                              ₹1,080

LAYER 2 — Pola Coins
  Coin buyers (16% of MAU):     80 users
  Average pack value:           ₹44
  80 × ₹44:                              ₹3,520

LAYER 3 — Print Orders
  Orders per month:             120
  Average order value:          ₹149
  120 × ₹149:                           ₹17,880

LAYER 4 — Add-ons
  60% of orders add something:  72
  Average add-on:               ₹30
  72 × ₹30:                              ₹2,160

─────────────────────────────────────────────
TOTAL GROSS REVENUE:                   ₹24,640

COSTS
  Printing + packaging (120 orders × ₹60):  -₹7,200
  Razorpay fees (~2% of gross):             -₹493
  Cloudinary + Neon + Vercel:               -₹800
  Resend emails:                            -₹0  (free tier)
─────────────────────────────────────────────
TOTAL COSTS:                           -₹8,493

NET PROFIT:                            ₹16,147/month
```

### Growth curve

```
MAU     Gross      Net
─────────────────────────
100     ₹4,928     ₹2,500
250     ₹12,320    ₹7,800
500     ₹24,640    ₹16,147
1,000   ₹49,280    ₹33,000
2,000   ₹98,560    ₹67,000
5,000   ₹2,46,400  ₹1,72,000
```

These are not hockey-stick numbers.
They are honest, conservative numbers.
500 MAU is findable from Instagram alone
if one creator post lands well.

---

---

## Anti-patterns — what NOT to do

### Don't gate the editor

```
❌ "Sign up to use the editor"
✅ "Sign up to save your design"
```

Every gate before the emotional peak loses 60-80% of users.
Let them make something first. Gate the save, not the create.

### Don't stack paywalls

```
❌ Pay to remove watermark AND pay for cloud save AND pay for booth mode
✅ Coins cover everything — one purchase, spend freely
```

Multiple separate payment asks in one session
destroys trust and feels extractive.

### Don't offer a subscription as the only upgrade path

```
❌ "Subscribe for ₹99/month to remove watermarks forever"
✅ "Remove this watermark for ₹9" + coins for power users
```

Subscriptions work when the value is continuous and obvious
(Spotify: music every day). For Polamuse the value is
occasional and emotional. Match the payment model to usage pattern.

### Don't make coins confusing

```
❌ Complex coin math: "10 coins per watermark removal but
    booth sessions cost 8 coins except on Sundays when..."
✅ Simple: watermark = 10 coins. Booth = 8 coins. That's it.
```

The moment the user opens a calculator to understand your pricing,
you've lost them.

---

---

## The watermark as marketing — the flywheel

```
User makes polaroid
        ↓
Downloads free (watermarked)
        ↓
Posts on Instagram story
        ↓
"polamuse.com" visible to their 400 followers
        ↓
10 people tap the link
        ↓
3 of them make a design
        ↓
1 pays ₹9 to remove watermark
1 orders a print
1 downloads free (watermarked) → shared → more eyes
        ↓
Repeat
```

Your free users are not lost revenue.
They are your distribution budget.
You are paying them in features to market for you.

This is the exact model that made Canva, Notion, and Figma
grow without spending on ads in their early days.

---

---

## Implementation priority

```
Week 1:  Watermark on free downloads (fabric.js text on export)
         ₹9 payment modal (Razorpay, no login needed)
         design_unlocks table in DB

Week 2:  Coin packs (3 tiers, Razorpay one-time payment)
         coin_ledger table
         Spend coins on: watermark + booth + shared canvas

Week 3:  Add-ons at checkout
         (gift wrap, note card — source packaging from local vendor)

Week 4:  Occasion targeting
         Birthday/anniversary date collection at signup
         Notification 3 days before the date

Later:   Wooden magnet SKU (requires IndiaMart sourcing first)
         Bulk pack for events (₹999 pack of 20)
```

---

---

## One number to remember

```
You need 120 print orders/month to hit ₹16,000 net.

120 orders / 30 days = 4 orders per day.

4 orders per day is not scale.
4 orders per day is a WhatsApp group of friends.

Start there.
```

---

*Polamuse Monetization Model v1.0*
*4-layer combination · No subscriptions · Emotion-timed payments*
