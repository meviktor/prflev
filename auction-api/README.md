# auction-api

API projekt, melynek célja, hogy kiszolgálja az Angular klienst, valamint kommunikál az adatbázissal.

## API végpontok

Az alábbi végpontok hívhatók:

- */register* - új felhasználó regisztrálása.
- */authenticate* - bejelentkezés a kliensbe. Bővebb információ az autentikációról lejjebb olvasható.
- */productCategories* - termékkategóriák listáját adja vissza.
- */createProductCategory* - termékkategória hozzáadása. Ez az API végpont nincs hívva az Angular kliensen keresztül, csak Postman, stb. által lehet meghajtani. Csak segéd célokat szolgál(t).
- */auctionDetails* - egy aukció adatait adja vissza, aukció id ajapján: aukció adatok, termék adatok, licitek, kommentek.
- */createAuction* - új aukció létrehozása.
- */queryAuctions* - a létrehozott aukciók közötti keresést teszi lehetővé, többféle attribútum alapján (ár, kezdő- és végdátum, kategória...).
- */addBid* - új licit hozzáadása egy adott aukcióhoz.
- */addComment* - új komment hozzáadása egy aukcióhoz.
- */userDetails* - egy felhasználó adatainak (felhasználónév, e-mail cím), valamint az általa létrehozott aktív (nem lejárt) aukciók listájának a lekérdezése.
- */getWonAuctions* - az éppen bejelentkezett felhasználó által korábban megnyert aukciók listájának lekérése.

## Autentikáció

JSON Web Token használatával történik. A */register* és az */authenticate* végpontokon kívül minden más végpont használata autentikációhoz kötött (Bearer token). A tokenek érvényesség ideje 1 órára van beállítva.

## Modellek (adatbázis)

#### Felhasználók (users)

A felhasználók adatait tárolja: felhasználónév, e-mail cím, titkosított jelszó.

#### Termékkategóriák (productcategories)

A kollekció elemei együtt alkotják a termékkategóriák fáját. Egy termékkategóriáról a nevét tároljuk, valamint a szülő kategróia id-ját, ha az adott kategória nem a legfelső szinten van.

#### Aukciók (auctions)

Itt tároljuk az adott aukció adatait (mikor fejeződik be az aukció, melyik felhasználóhoz tartozik, mi (volt) a kezdőár, stb.), valamint a hirdetett termék adatait, az aukcióhoz tartozó liciteket és kommenteket.