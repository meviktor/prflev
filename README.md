# prflev
IML109L-IML109g-1

Kötelező program - választott téma: 8. Vatera Minimál (Angular kliens, Express.js API)

## A projekt indítása

Importáljuk be a MongoDB kollekciókat, amelyek a *database-exports* mappában találhatók, a MongoDB Compass segédprogram használatával. Hozzunk létre egy új adatbázist *auction-db* névvel, benne három kollekcióval: *auctions*, *productcategories* és *users*. Majd imortáljuk be a megfelelő nevű JSON fájl adatait a megfelelő kollekcióba.

Az *auction-api* könyvtárban hozzunk létre az *.env* fájlt. Ez a fájl az alábbi információkat tartalmazza az API projekttel kapcsolatosan: 

- milyen porton érhető el az API
- JWT secret
- adatbázis (MongoDB) URL

Például:

```
API_PORT=3000
API_SECRET=<valamilyen random string>
DATABASE_URL=mongodb://localhost:27017/auction-db
```

Az *auction-api* könyvtárban maradva el már el is indíthatjuk az API projektet:

```
npm install
npm start
```

Bővebb információ az API projektről az *auction-api* könyvtárban található README.md fájlban olvasható.

Az Angular kliens indításához navigáljunk az *auction-client* mappába majd onnan adjuk ki a következő parancsokat:

```
npm install
ng serve
```

Nyissunk egy böngészőt és a címsorba írjuk be: *http://localhost:4200*. Itt lesz lehetőségünk bejelentkezni és/vagy regisztrálni (vannak előre létrehozott felhasználók is, aukciókkal). Bővebb információ a kliensről az *auction-client* mappában található README.md fájlban olvasható.