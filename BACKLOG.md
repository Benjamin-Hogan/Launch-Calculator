# Feature Backlog

This backlog lists planned calculator capabilities and textbook tie-ins for AstroCalc. Each item aligns with an example or exercise sequence from the "Launch Vehicle and Orbital Mechanics" text.

| Calculator feature prompt | Textbook tie‑in |
|---------------------------|-----------------|
| Given **r**, **v** in IJK, output **a**, **e**, **i**, **Ω**, **ω**, **ν**. | Chapter 2, sections 2.3–2.5 (elements ⇄ vectors) |
| Propagate state for Δt via universal‑variable f‑g series; allow elliptical, parabolic, hyperbolic. | Chapter 4, sections 4.2–4.6 |
| Solve Lambert (Gauss) problem: **r₁**, **r₂**, Δt → **v₁**, **v₂**; support short/long‑way choice. | Chapter 5, sections 5.2 & 5.6 workflow |
| Compute Hohmann / bi‑elliptic ΔV between two coplanar circular orbits. | Chapter 3, sections 3.3 & 3.4 and transfer tables |
| Evaluate plane‑change ΔV at any true anomaly or combined Hohmann+plane‑change sequence. | Chapter 3, section 3.4 |
| Generate ground‑track for user‑defined orbit over N revolutions. | Chapter 2, section 2.15 (ground‑track equations) |
| Estimate J₂ nodal regression & apsidal rotation rates for a circular LEO. | Chapter 9 perturbation introduction |
| Patched‑conic Earth‑to‑Moon transfer: give insertion ΔV, perilune radius, TLI epoch sweep. | Chapter 7, sections 7.3–7.5 |
| Interplanetary pork‑chop plot: compute C₃/ΔV grid for launch window. | Chapter 8, section 8.3 |
| Sub‑orbital trajectory tool: max‑range, flight‑time, re‑entry impact for given launch site & azimuth. | Chapter 6, sections 6.2–6.4 |
| Monte‑Carlo launch‑error dispersion showing CEP ellipse on target plane. | Chapter 6, section 6.3 (statistics) |
| Batch‑process optical angle sets (α, δ) to initial orbit via Gibbs/Laplace. | Chapter 2, sections 2.10–2.12 |
| Interactive exercise mode: auto‑grade textbook Exercises X.Y (#) with step‑by‑step hints. | End‑of‑chapter exercise lists (e.g. Ch. 2 p. 144, Ch. 4 p. 222) |

These tickets will drive future API endpoints and frontend pages. As each chapter is covered, its corresponding features can be implemented and cross‑referenced here.
