# auction-client

Angular kliens, amellyel lehetőségünk van aukciók létrehozására, aukciók között keresni, ajánlatokat tenni az egyes aukciókon, stb.

## Bejelentkezés

Regisztrálhatunk új felhasználót, vagy beléphetünk az alábbi négy előre létrehozott felhasználó egyikével:

- TesztElek / *tesztelek1*
- MyTestUser / *mytestuser2*
- AuctionTester / *auctiontester3*
- newbie / *ijuststarted4* - teljesen *"tiszta"* felhasználó (nincs aukciója, nem licitált és kommentelt sehova)

## Információ az egyes oldalakról

#### Home page (dashboard)

Az oldalon négy panel található. Ebből a felső kettő szolgál arra, hogy az aukciók között keressünk, illetve új aukciót hozzunk létre. A két alsó pedig a felhasználó által létrehozott, valamint a korábban már megnyert aukcióit mutatja. A már inaktív (lejárt) aukciók halvány piros/rózsaszín színnel vannak jelölve. A felhasználó aukcióit tartalmazó panelen van is egy gomb, amivel tudunk váltani aközött, hogy minden aukciót mutasson az alkalmazás, vagy csak az aktív (le nem járt) aukciókat. A headerben két fontos objektum található a jobb szélen. Az első mutatja az éppen bejelentkezett felhasználó nevét, valamint ha rákattintunk, akkor visszakerülünk a home page-re. A másodikkal pedig az alkalmazásból tudunk kijelentkezni.

#### Create auction page

Ez az új aukció létrehozására szolgáló oldal. Itt minden mezőt ki kell tölteni, kivéve azt a textarea-t, ami az aukció leírását tartalmazza, az opcionális. Kötelező tehát megadni a kezdőárat, a licitlépcsőt, valamint az aukció végdátumát. Meg kell adni továbbá a termék (hirdetés) nevét, illetve, hogy melyik kategóriába sorolható be az aukció tárgya. Ha mindent kitöltöttünk, és a *Create* gomb megnyomása után sikeresen létrejött az új aukció, visszakerülünk a home page-re, ahol az felhasználó aukciói között ott kell legyen a most létrehozott aukció is a listában.

#### Search for auctions

Két panel található az oldalon, a felső panelben tuduk megadni a keresési feltételt (gyakorlatilag egy query-t állít össze, amit elküld a */queryAuctions* API végpontnak), az alsóban pedig a keresés eredményét láthatjuk (a */queryAuctions* API végpont válasza). A felső panelben minden mező opcionális, kereshetünk teljesen üres formmal is, ekkor az összes aktív aukció listáját kapjuk vissza. Az alábbi szűrési lehetőségek adottak:

- keresés a hirdetés címében (case insensitive)
- aukció végdátuma (*-tól*, *-ig*, *-tól* és *-ig*)
- aktuális ár (*-tól*, *-ig*, *-tól* és *-ig*)
- kategória

Ha van találat, lehetőségünk van megnézni az aukció részleteit is, a hirdetés nevére kattintva (ez nyilván minden más olyan oldalra is igaz, ahol listázunk hirdetéseket). Így jutunk az auction details page-re.

#### Auction details page

Ezen az oldalon találjuk az összes, az adott aukcióhoz köthető információt:

- termék kategóriája
- hirdetés (termék) neve
- leírás
- aktuális ár (legmagasabb licit, ha ilyen nincs, akkor a kezdőár)
- kezdőár
- az eddigi licitek listája, névvel, dátummal, összeggel
- információ a licitlépcsőről és a következő licit minimum értékéről
- a hirdretés feladójáról, valamint az aukció kezdő- és végdátumáról

Az oldalon lévő felhasználónevek egyben linkek is, melyek az adott felhasználóhoz tartozó user details page-re visznek (lásd lentebb).

Nyilvánvalóan a hirdetést feladó felhasználó nem tud licitálni a saját termékére, valamint a lejárt aukciókra sem licitálhat senki. Kommentelni viszont bárki, bármikor tud az egyes aukciókhoz, eladó és vevő egyaránt.

#### User details page

Egy egyszerű oldal, amely az adott felhasználó felhasználónevét, e-mail címét, valamint az általa feladott, jelenleg aktív hirdetéseket tartalmazza.