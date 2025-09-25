# SBZ
SBZ Project 2025, SIIT

CEP (Kompleksna obrada događaja)
CEP sloj obrađuje visokofrekventne događaje u realnom vremenu i pretvara ih u viši nivo signala (obrasce) koji sistem
koristi za pravila i preporuke. Koristi tumbling i sliding prozore, agregacije i detekciju promena (change‑point / spike).
1. Ulazni događaji (streamovi)
   ● KeyStrokeEvent {ts, chars_per_min, error_rate} – brzina kucanja i greške (npr. backspace/100 reči).
   ● MouseEvent {ts, move_rate, click_rate} – tempo rada mišem.
   ● AppFocusEvent {ts, app, category} – aktivni prozor (rad / društvene mreže / video / edukacija).
   ● ScreenTimeEvent {ts, device, active} – aktivacija ekrana (računar/telefon).
   ● UserBreakEvent {ts, duration} – pauza (AFK ili zaključan ekran).
   ● PhoneUsageEvent {ts, category, duration} – trajanje po kategoriji na telefonu.
2. Prozoriranje i agregacije
   ● 5‑min tumbling (osnovna rezolucija): avg(chars_per_min), avg(error_rate), sum(active_time_by_category).
   ● 15‑min sliding (korak 1 min): avg/median(chars_per_min), avg(error_rate), count(app_switch).
   ● 60‑min tumbling: kumulativno vreme po kategoriji, broj rizičnih 5‑min segmenata.
   ● Dnevne agregacije: zbirni „work vs. leisure” satnica, broj upozorenja/ignorisanih preporuka.
   Napomena: vremenski okviri su „zaokruženi” (npr. 15:00, 15:15, 15:30…), da bi višerazinske agregacije bile
   stabilne i ulančive.
3. Detekcija obrazaca (rule signali)
   ● Pad koncentracije (typing‑drop)
   Ako u 15‑min prozoru avg(chars_per_min) padne ≥25% u odnosu na 60‑min baznu vrednost i avg(error_rate)
   poraste ≥40% → emituje se FocusDropEvent.
   ● Prelazak na pasivni sadržaj (context‑switch)
   Ako se u 10 min zabeleži ≥3 AppFocusEvent prelaza rad → video/social i u narednih 20 min udeo
   vreme‑u‑prozor ≥70% za video/social → PassiveBingeEvent.
   ● Dugotrajni rad bez pauze (no‑break)
   Ako sum(active) ≥90 min u kontinuitetu i UserBreakEvent.duration < 5 min u tom intervalu →
   NoBreakStreakEvent.
   ● Multitasking opterećenje (app‑switch burst)
   Ako je count(app_switch) ≥30 u 2h sliding prozoru → MultiTaskOverloadEvent.
   Sve pragove (25%, 40%, 70%, 90 min, 30 switch‑eva…) sistem dobija iz Template konfiguracije (korisnik/organizacija ih
   može menjati).
4. Spajanje obrazaca (CEP kompozicija)
   Primeri ulančavanja (spajanje više signala kroz vreme):
   ● Rani zamor (early‑fatigue)
   FocusDropEvent AND NoBreakStreakEvent u 30 min → EarlyFatigueSignal.
   ● Mentalni zamor (binge‑after‑work)
   PassiveBingeEvent u roku od 45 min nakon NoBreakStreakEvent → MentalFatigueSignal.
   ● Visok rizik u toku dana
   Ako u toku dana count(EarlyFatigueSignal) ≥2 OR (MultiTaskOverloadEvent AND FocusDropEvent) →
   HighRiskToday.
5. Akcije i interfejs prema pravilima
   CEP signali se ne prikazuju direktno korisniku, već hrane rule engine:
   ● Na EarlyFatigueSignal → pravilo „predloži 10‑min pauzu, istezanje očiju (20‑20‑20)”.
   ● Na MentalFatigueSignal → „limitiraj društvene mreže 30 min, predloži aktivan odmor”.
   ● Na HighRiskToday → „pauza 20–30 min + promena tipa aktivnosti (šetnja/lagani trening)”.
6. Debounce i anti‑spam mehanizmi
   ● Minimalni razmak između dve iste preporuke: ≥30 min.
   ● Ako su 2 preporuke zaredom ignorisane unutar 2h → treća eskalira (duža pauza + promjena aktivnosti),
   narednih 60 min smanjuje učestalost novih notifikacija.
7. Integracija više uređaja
   ● Merge timeline: računar i telefon se spajaju po ts (prioritet aktivnijem uređaju).
   ● Dual‑screen guard: ako je aktivan telefon >20 min unutar radnog bloka → utiče na PassiveBingeEvent čak i bez
   promene AppFocusEvent na računaru.
8. Robustnost signala
   ● Outlier guard: winsorization 5% na chars_per_min i error_rate.
   ● Cold‑start: prvih 7 dana koristi se globalna bazna vrednost; posle prelazi na personalizovanu (per‑user baseline).
