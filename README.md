# Sistem za prepoznavanje digitalnog zamora

## Članovi tima: Dušica Trbović, Ana Poparić

# Opis problema

## Motivacija

Savremeni način života, naročito u IT profesijama, podrazumeva dugotrajan rad pred ekranom računara i telefona.
Prekomerno izlaganje ekranima dovodi do pada produktivnosti, smanjene koncentracije, umora očiju, poremećaja sna i
psihološkog stresa. Ljudi često nisu svesni stvarnog obima svoje digitalne aktivnosti niti posledica koje to ima na zdravlje.
Cilj sistema je da prati digitalnu aktivnost korisnika, prepozna rane znake zamora i ponudi pravovremene preporuke za
odmor i promenu navika.

## Pregled problema

Postoje aplikacije koje mere vreme korišćenja uređaja, ali retko povezuju te podatke sa indikatorima zamora, obrascima
ponašanja i konkretnim savetima. Naš sistem kombinuje praćenje aktivnosti na više uređaja sa pravilima koja prepoznaju
potencijalni digitalni zamor i prilagođavaju preporuke korisniku.

## Nedostatak postojećih rešenja

Većina postojećih rešenja (npr. Google Digital Wellbeing, Apple Screen Time) ograničena je na merenje sirovog screen
time-a, dok izostaje dublja analiza i personalizacija. Nedostaci koji se javljaju:
● **Analiza konteksta korišćenja** – nije isto 2 sata fokusiranog rada ili 2 sata pasivnog skrolovanja društvenih mreža.
● **Nedostatak reakcije u realnom vremenu** – korisnici uglavnom dobijaju izveštaje naknadno, što smanjuje efekat
prevencije.
● **Nepovezanost uređaja** – računar, telefon i tablet se obično posmatraju odvojeno, iako korisnici često prelaze s
jednog uređaja na drugi.
● **Slaba personalizacija** – većina rešenja ne uzima u obzir individualne navike korisnika (npr. produktivniji rad
ujutru, a veći zamor uveče).
Naš sistem unapređuje postojeća rešenja kroz:
● pravila koja povezuju tip aktivnosti i dužinu rada bez pauze,
● kombinovanje podataka sa više uređaja,
● prepoznavanje obrazaca koji ukazuju na digitalni zamor,
● generisanje personalizovanih preporuka u realnom vremenu.


# Metodologija rada

## Ulazi u sistem

```
● Vreme provedeno za računarom – merenje aktivnosti (tipkanje, pokreti miša, aktivni prozori).
● Vreme provedeno na telefonu – kroz podatke sa screen time API-ja.
● Tip aktivnosti – kategorizacija (rad, društvene mreže, zabava, edukacija).
● Pauze između sesija – analiza trajanja i učestalosti odmora
● Subjektivna ocena umora – korisnik može uneti svoju trenutnu ocenu zamora na skali od 1 do 5.
```
## Izlazi iz sistema

```
● Procena trenutnog stanja zamora – klasifikacija na: nema, blagi, srednji, visok.
● Preporuke akcije u realnom vremenu – npr. „uzmi 5 minuta pauze“, „izađi na kratku šetnju“, „promeni tip
aktivnosti“.
● Izveštaji o navikama – nedeljni i mesečni prikaz korišćenja uređaja sa uvidom u obrasce zamora.
```
# Baza znanja

Baza znanja u sistemu za prepoznavanje digitalnog zamora zasniva se na pravilima koja kombinuju različite ulaze (trajanje
rada, tip aktivnosti, pauze, subjektivna ocena umora). Pravila se formiraju na osnovu relevantne literature o zdravlju i
digitalnom zamoru, a sistem ih dodatno prilagođava individualnim navikama korisnika.
**Način popunjavanja baze znanja:**
● Automatski, putem podataka o korišćenju računara i telefona (aktivnost tastature, miša, screen time API).
● Subjektivnim unosom korisnika (npr. ocena trenutnog nivoa umora).
● Personalizacijom kroz akumulirane podatke tokom vremena (učenje obrazaca).
**Glavne grupe pravila:**
● **Pravila zasnovana na trajanju rada bez pauze** – npr. 90 minuta intenzivnog rada bez pauze označava visok
rizik od zamora.
● **Pravila zasnovana na tipu aktivnosti** – npr. 2 sata pasivnog skrolovanja društvenih mreža se prepoznaje kao
mentalni zamor
● **Personalizovana pravila** – sistem uči iz navika korisnika (npr. ako je korisnik produktivan ujutru, upozorenja
tada mogu biti blaža).
● **Pravila za kombinaciju više uređaja** – računar + telefon zajedno, da bi se dobila realna slika ukupnog digitalnog
opterećenja.
**Interakcije na osnovu baze znanja:**


```
● Kada se detektuje okidanje pravila, sistem u realnom vremenu generiše preporuku (pauza, promena aktivnosti,
fizička aktivnost).
● Agregacijom podataka pravila se koriste i za kreiranje izveštaja (nedeljnih i mesečnih) koji prikazuju obrasce
ponašanja i nivoe zamora
```
# Primer rezonovanja

Da bismo ilustrovali kako sistem funkcioniše u praksi, prikazaćemo scenario koji obuhvata kombinaciju forward
chaininga, backward chaininga i CEP obrade događaja.
**Scenario** : Radni dan programera

1. Početak rada
    Korisnik započinje rad na računaru u 9h. Sistem registruje aktivnost tastature i miša i klasifikuje je kao rad.
2. Praćenje aktivnosti (CEP)
    Tokom rada meri se:
       ○ brzina kucanja (početno prosečno 300 karaktera u minuti),
       ○ broj grešaka (3 greške na 100 reči).
3. Nakon sat vremena primećuje se povećanje grešaka (7 grešaka na 100 reči) i usporavanje kucanja na 200
    karaktera u minuti. CEP pravilo prepoznaje to kao indikator pada koncentracije.
4. Forward chaining – pravila o dužini rada
    U poslednja 2 sata korisnik je proveo 110 minuta neprekidno pred ekranom, bez pauze duže od 5 minuta. Sistem
    primenjuje pravilo:
       ○ Ako je rad bez pauze > 90 minuta i postoje pokazatelji pada koncentracije → rizik od srednjeg zamora.
       ○ Rezultat: sistem šalje preporuku „Uzmi kratku pauzu od 10 minuta“.
5. Ignorisanje preporuke
    Korisnik ignoriše preporuku i nastavlja da radi još 40 minuta. Ukupno vreme pred ekranom sada je 150 minuta.
    Pravilo se ponovo aktivira:
       ○ Ako je vreme rada bez pauze > 150 minuta → visok rizik od zamora.
       ○ Rezultat: sistem šalje intenzivnije upozorenje: „Potrebna je duža pauza (20 minuta). Preporučuje se šetnja
          ili fizička aktivnost“.
6. Backward chaining – korisnik prijavljuje umor
    Korisnik u 12h unosi subjektivnu ocenu umora = 4/5. Sistem tada unazad ispituje uzroke:
       ○ ukupno vreme pred ekranom poslednja 3h = 2.5h,
       ○ dominantna aktivnost = rad (bez promene konteksta),
          pauze < 5 minuta.
7. Na osnovu tih podataka sistem zaključuje da je glavni uzrok dugotrajan rad bez odmora i potvrđuje preporuku
    duže pauze.
8. Nastavak dana – promena tipa aktivnosti
    Nakon pauze korisnik prelazi na pasivno korišćenje društvenih mreža 1h. Sistem beleži tip aktivnosti = zabava.
    Pravilo se aktivira:
       ○ Ako korisnik nakon dužeg rada provede > 1h pasivno skrolujući → mentalni zamor.


```
○ Preporuka: „Ograniči društvene mreže, probaj aktivniji vid odmora“.
```
9. Generisanje izveštaja (akumulacija)
    Na kraju dana sistem pravi sažetak:
       ○ ukupno 7h pred ekranom,
       ○ od čega 4.5h rad, 2.5h pasivno korišćenje,
       ○ 3 upozorenja za zamor, od kojih je 1 ignorisano.
          Izveštaj se koristi za dugoročnu personalizaciju (npr. sistem će sledeći put ranije predložiti pauzu).

# Forward chaining:

Forward chaining u ovom sistemu koristi skup pravila koja se nadovezuju i na osnovu podataka o vremenu pred ekranom,
tipu aktivnosti i broju pauza izvode zaključke o stepenu zamora i daju preporuke.
**Primer ulančavanja pravila sa tri nivoa (rad + skrolovanje):**

1. **Prvo pravilo – vreme rada bez pauze**
    ○ Ako je ukupno vreme neprekidnog rada > 90 minuta → **zaključak** : rizična sesija.
2. **Drugo pravilo – kombinacija tipa aktivnosti**
    ○ Ako je rizična sesija i tip aktivnosti = rad + skrolovanje → **zaključak** : povećan rizik od zamora.
3. **Treće pravilo – preporuka korisniku**
    ○ Ako je povećan rizik od zamora → **akcija** : preporuka pauze od 10 minuta.
**Primer ulančavanja pravila za kombinaciju uređaja:**
1. Ako je na računaru detektovano 90 min rada bez pauze → **zaključak** : rizična sesija (računar).
2. Ako je unutar iste sesije na telefonu zabeleženo >30 min društvenih mreža → **zaključak** : povećan rizik zbog
kombinacije uređaja.
3. Ako je povećan rizik zbog kombinacije uređaja → **akcija** : intenzivnije upozorenje („Duža pauza i promena
aktivnosti“).
**Primer sa accumulate funkcijom:**
1. Sistem akumulira vreme pred ekranom u poslednjih 6 sati.
○ Ako su u tom periodu tri ili više sesija trajale > 1.5h → zaključak: opterećen dan.
2. Ako je opterećen dan i korisnik je već dobio dve ili više preporuka za pauzu koje nije ispoštovao → zaključak:
visok zamor.
3. Ako je visok zamor → akcija: preporuka duže pauze od 20 minuta i promena tipa aktivnosti (npr. fizička
aktivnost).
**Primer ulančavanja pravila za ignorisanje preporuka:**
1. Ako je preporuka poslana i korisnik je nije ispoštovao u narednih 20 minuta → zaključak: ignorisan savet.
2. Ako su ≥ 2 uzastopna saveta ignorisana → zaključak: rizik od ozbiljnog zamora.


3. Ako je rizik od ozbiljnog zamora → akcija: sistemska eskalacija (blok notifikacija, predlog dužeg odmora).
Na ovaj način forward chaining pokriva više različitih scenarija:
● dužinu rada u kombinaciji sa tipom aktivnosti,
● istovremeno korišćenje više uređaja,
● akumulaciju sesija u toku dana,
● reakciju na ignorisanje preporuka.
Takva struktura pravila omogućava višeslojno rezonovanje i detaljniju personalizaciju preporuka korisniku.

# Backward chaining:

Backward chaining u sistemu za prepoznavanje digitalnog zamora predstavlja ključni mehanizam za dijagnostičko rezonovanje - umesto da se iz ulaznih činjenica izvode zaključci (kao kod forward chaininga), sistem kreće od ciljne hipoteze i traži dokaze koji je potvrđuju ili opovrgavaju. Drools engine omogućava implementaciju ovog obrasca kroz upite (queries) koji se mogu rekurzivno pozivati, formirajući stablo zaključivanja.

## Princip rada backward chaininga

U kontekstu digitalnog zamora, backward chaining se aktivira kada:
- Korisnik prijavi visok nivo subjektivnog zamora
- Sistem detektuje potencijalnu kritičnu situaciju i želi da precizno utvrdi uzrok
- Potrebna je detaljna analiza uzroka pre davanja preporuke

Proces backward chaininga odvija se kroz sledeće korake:

1. **Definisanje hipoteza i ciljeva**
   - Sistem definiše glavne hipoteze o uzrocima zamora koje treba istražiti
   - Svaka hipoteza se razlaže na podređene hipoteze (stablo zaključivanja)

2. **Kreiranje upita (queries)**
   - Za svaku hipotezu definiše se upit koji traži relevantne dokaze
   - Upiti mogu pozivati druge upite, stvarajući rekurzivnu strukturu

3. **Evaluacija dokaza**
   - Upiti pretražuju bazu činjenica (aktivnosti korisnika, obrasce ponašanja)
   - Sistem traži specifične obrasce koji potvrđuju određene hipoteze

4. **Prikupljanje i ponderisanje rezultata**
   - Za svaku hipotezu prikupljaju se dokazi i njihova težina
   - Formira se zaključak sa stepenom pouzdanosti

## Implementacija u Drools sistemu

Drools pruža nativnu podršku za backward chaining kroz svoj query mehanizam koji omogućava:

```drools
query isUzrokZamora(String tip, Long sessionId)
    // Rekurzivno pozivanje drugih upita koji proveravaju specifične dokaze
    isRadnoOpterecenje(sessionId;) and tip == "radnoOpterecenje"
    or
    isPasivnoKoriscenje(sessionId;) and tip == "pasivnoKoriscenje"
    or
    isMultitasking(sessionId;) and tip == "multitasking"
end

// Podupit koji proverava dokaze za radno opterećenje
query isRadnoOpterecenje(Long sessionId)
    // Podupiti koji proveravaju specifične dokaze
    isDugotrajniRad(sessionId;)
    or
    isCestiRadBezPauze(sessionId;)
end

// Specifičan upit koji proverava konkretan obrazac - dugotrajni rad
query isDugotrajniRad(Long sessionId)
    $aktivnost: ActivityEvent(
        sessionId == sessionId,
        activityType == ActivityType.WORK,
        activityDuration > 90
    )
end
```

## Scenario: Dijagnostika uzroka zamora

**1. Aktivacija backward chaininga**
   - Korisnik unosi subjektivnu ocenu zamora 4/5
   - Sistem inicira dijagnostički proces kroz upite

**2. Stablo hipoteza**
   - **H1: Radno opterećenje** - glavni uzrok je prekomerni rad
     - H1.1: Dugotrajne sesije rada (>90 min)
     - H1.2: Mnogo kratkih sesija bez adekvatnih pauza
     - H1.3: Visok intenzitet rada (brzina kucanja, interakcije)

   - **H2: Pasivno korišćenje** - glavni uzrok je pasivna konzumacija sadržaja
     - H2.1: Dugotrajno korišćenje zabavnih sadržaja (>120 min)
     - H2.2: Prelazak sa rada na zabavu bez pauze
     - H2.3: Kontinuirano skrolovanje

   - **H3: Multitasking** - glavni uzrok je prekomeran multitasking
     - H3.1: Česte promene aplikacija (>30 u 2h)
     - H3.2: Paralelno korišćenje više uređaja
     - H3.3: Prekidanja fokusiranog rada

**3. Prikupljanje dokaza**
   - Sistem kroz upite pretražuje istoriju aktivnosti korisnika
   - Za svaku podhipotezu prikuplja se skup dokaza i njihova snaga
   - Primer: Za H1.1 se proverava broj sesija dužih od 90 minuta

**4. Ponderisanje i zaključivanje**
   - Sistem dodeljuje težinske faktore dokazima po hipotezama:
     - Radno opterećenje: direktni dokazi (70%), indirektni dokazi (30%)
     - Pasivno korišćenje: dugotrajnost (60%), kontekst (40%)
     - Multitasking: broj promena (50%), vremenski razmak (50%)

   - Na osnovu ponderisanih dokaza formira se konačna dijagnoza
   - Ako je više hipoteza podržano, bira se dominantna (sa najvećim skorom)

**5. Preporuka na osnovu dijagnoze**
   - **Radno opterećenje**: "Napravite dužu pauzu (20-30 min). Izađite u šetnju i vežbajte oči (20-20-20 pravilo)."
   - **Pasivno korišćenje**: "Ograničite vreme na pasivnim sadržajima. Aktivniji vid odmora pomoći će vam da se regenerišete."
   - **Multitasking**: "Fokusirajte se na jedan zadatak. Isključite notifikacije i zatvorite nepotrebne aplikacije."

Ovakav pristup backward chaininga omogućava sistemu da precizno identifikuje uzroke zamora kroz strukturirano rezonovanje, što rezultira personalizovanim i kontekstualno relevantnim preporukama za korisnika.


# CEP (Kompleksna obrada događaja)

CEP sloj obrađuje visokofrekventne događaje u realnom vremenu i pretvara ih u viši nivo signala (obrasce) koji sistem
koristi za pravila i preporuke. Koristi _tumbling_ i _sliding_ prozore, agregacije i detekciju promena (change‑point / spike).

**1. Ulazni događaji (streamovi)**
● **KeyStrokeEvent** {ts, chars_per_min, error_rate} – brzina kucanja i greške (npr. backspace/100 reči).
● **MouseEvent** {ts, move_rate, click_rate} – tempo rada mišem.
● **AppFocusEvent** {ts, app, category} – aktivni prozor (rad / društvene mreže / video / edukacija).
● **ScreenTimeEvent** {ts, device, active} – aktivacija ekrana (računar/telefon).
● **UserBreakEvent** {ts, duration} – pauza (AFK ili zaključan ekran).
● **PhoneUsageEvent** {ts, category, duration} – trajanje po kategoriji na telefonu.
**2. Prozoriranje i agregacije**
● **5** ‑ **min tumbling** (osnovna rezolucija): avg(chars_per_min), avg(error_rate), sum(active_time_by_category).
● **15** ‑ **min sliding (korak 1 min)** : avg/median(chars_per_min), avg(error_rate), count(app_switch).
● **60** ‑ **min tumbling** : kumulativno vreme po kategoriji, broj _rizičnih_ 5 ‑min segmenata.
● **Dnevne agregacije** : zbirni „work vs. leisure” satnica, broj upozorenja/ignorisanih preporuka.
Napomena: vremenski okviri su „zaokruženi” (npr. 15:00, 15:15, 15:30...), da bi višerazinske agregacije bile
stabilne i ulančive.
**3. Detekcija obrazaca (rule signali)**
● **Pad koncentracije (typing** ‑ **drop)**
Ako u 15 ‑min prozoru avg(chars_per_min) padne ≥25% u odnosu na 60 ‑min baznu vrednost **i** avg(error_rate)
poraste ≥40% → emituje se **FocusDropEvent**.
● **Prelazak na pasivni sadržaj (context** ‑ **switch)**
Ako se u 10 min zabeleži ≥3 _AppFocusEvent_ prelaza _rad → video/social_ i u narednih 20 min udeo
vreme‑u‑prozor ≥70% za _video/social_ → **PassiveBingeEvent**.
● **Dugotrajni rad bez pauze (no** ‑ **break)**
Ako sum(active) ≥90 min u kontinuitetu i UserBreakEvent.duration < 5 min u tom intervalu →
**NoBreakStreakEvent**.
● **Multitasking opterećenje (app** ‑ **switch burst)**
Ako je count(app_switch) ≥30 u 2h sliding prozoru → **MultiTaskOverloadEvent**.
Sve pragove (25%, 40%, 70%, 90 min, 30 switch‑eva...) sistem dobija iz _Template_ konfiguracije (korisnik/organizacija ih
može menjati).
**4. Spajanje obrazaca (CEP kompozicija)**
Primeri ulančavanja (spajanje više signala kroz vreme):


```
● Rani zamor (early ‑ fatigue)
FocusDropEvent AND NoBreakStreakEvent u 30 min → EarlyFatigueSignal.
● Mentalni zamor (binge ‑ after ‑ work)
PassiveBingeEvent u roku od 45 min nakon NoBreakStreakEvent → MentalFatigueSignal.
● Visok rizik u toku dana
Ako u toku dana count(EarlyFatigueSignal) ≥2 OR (MultiTaskOverloadEvent AND FocusDropEvent) →
HighRiskToday.
```
**5. Akcije i interfejs prema pravilima**
CEP signali se ne prikazuju direktno korisniku, već hrane _rule engine_ :
● Na **EarlyFatigueSignal** → pravilo „predloži 10 ‑min pauzu, istezanje očiju (20‑ 20 ‑20)”.
● Na **MentalFatigueSignal** → „limitiraj društvene mreže 30 min, predloži aktivan odmor”.
● Na **HighRiskToday** → „pauza 20–30 min + promena tipa aktivnosti (šetnja/lagani trening)”.
**6. Debounce i anti** ‑ **spam mehanizmi**
● Minimalni razmak između dve iste preporuke: **≥30 min**.
● Ako su **2 preporuke zaredom ignorisane** unutar 2h → treća eskalira (duža pauza + promjena aktivnosti),
narednih 60 min smanjuje učestalost novih notifikacija.
**7. Integracija više uređaja**
● **Merge timeline** : računar i telefon se spajaju po ts (prioritet aktivnijem uređaju).
● **Dual** ‑ **screen guard** : ako je aktivan telefon >20 min unutar radnog bloka → utiče na PassiveBingeEvent čak i bez
promene _AppFocusEvent_ na računaru.
**8. Robustnost signala**
● **Outlier guard** : winsorization 5% na chars_per_min i error_rate.
● **Cold** ‑ **start** : prvih 7 dana koristi se globalna bazna vrednost; posle prelazi na personalizovanu (per‑user baseline).

# Template - opciono

Kako bi sistem bio fleksibilan i prilagođen različitim korisnicima, predviđen je mehanizam _template-a_ koji omogućava
menjanje pravila i pragova upozorenja bez intervencije programera.
**Primeri podešavanja:**
● **Prag vremena za pauzu**
○ Podrazumevano: upozorenje posle 90 minuta rada bez pauze.
○ Korisnik može promeniti prag na 60 minuta ako želi strožiju kontrolu, ili na 120 minuta ako želi ređu.
● **Pravila po tipu aktivnosti**


○ Edukativni sadržaj može se tolerisati duže od društvenih mreža (npr. 2h edukacije = ok, dok 1h društvenih
mreža već aktivira preporuku).
○ Korisnik može postaviti personalizovana pravila: npr. „Dozvoli do 3h čitanja PDF-a, ali maksimalno 1h
Instagrama“.
● **Subjektivna ocena umora**
○ Korisnik može odrediti kako sistem reaguje na njegovu ocenu umora.
○ Primer: ako oceni 3/5 → blago upozorenje, ako oceni 4/5 → odmah duža pauza.
● **Integracija uređaja**
○ Korisnik može uključiti/isključiti da li se sabira vreme provedeno na računaru i telefonu, ili da li se
tretiraju odvojeno.
**Prednosti templejta:**
● **Personalizacija** – svaki korisnik može da prilagodi sistem sopstvenom ritmu rada.
● **Fleksibilnost** – omogućava uvođenje novih pravila bez izmene koda.
● **Upotrebljivost** – korisnik može brzo testirati koja pravila mu najviše pomažu u svakodnevnom radu.


# Zaključak

Sistem za prepoznavanje digitalnog zamora predstavlja pokušaj da se prevaziđu ograničenja postojećih rešenja koja se
uglavnom svode na jednostavno praćenje vremena provedenog pred ekranom. Korišćenjem pravila zasnovanih na tipu
aktivnosti, dužini neprekidnog rada i kombinaciji više izvora podataka (računar, telefon), sistem omogućava
prepoznavanje ranih znakova digitalnog zamora i pruža personalizovane preporuke korisnicima u realnom vremenu.
Na ovaj način korisnicima se ne nudi samo retrospektivni izveštaj o navikama, već i konkretna podrška u očuvanju
zdravlja i produktivnosti tokom samog korišćenja digitalnih uređaja. Implementacija forward i backward chaining
rezonovanja, zajedno sa kompleksnom obradom događaja (CEP), obezbeđuje viši nivo inteligencije sistema, dok template
mehanizam omogućava fleksibilnost i prilagođavanje individualnim potrebama.
Projekat ima potencijal da unapredi svakodnevni život korisnika, naročito onih koji rade u IT sektoru ili provode mnogo
sati pred ekranom. Očekivani doprinos je stvaranje sistema koji može da utiče na formiranje zdravijih radnih i životnih
navika, smanjenje digitalnog stresa i povećanje dugoročne produktivnosti.