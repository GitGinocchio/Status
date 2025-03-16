
#### Python
- [x] Creare la struttura del database

- [ ] (**forse**) Il database dovrebbe contenere delle tabelle aggiuntive per le visioni mensili e settimanali

#### Html, css e javascript
- [ ] Il tooltip dei servizi deve essere modificato non eliminato e ricreato ogni volta
- [ ] Per i grafici per ora possiamo provare ad utilizzare [Rechart](https://recharts.org/en-US).
  
#### Varie
- [ ] Capire come funziona la pagina 404 di github pages

- [ ] Oltre all'endpoint del servizio, dovrei inserire anche l'indirizzo per gli utenti che vogliono andare nella home page del sito
- [ ] Sostituire endpoint di GGsBot da ggsbot.ginocchio.workers.dev al link di bot-hosting.net (per evitare di fare una query al worker di cloudflare)

- [ ] Strutturare questa feature fornita da chatgpt

>Puoi ottenere il risultato desiderato anche in un sito statico utilizzando JavaScript per generare dinamicamente la pagina di confronto. In altre parole, anziché pre-costruire tutte le possibili combinazioni con Jinja2 (che diventa rapidamente ingestibile se il numero di servizi è elevato), puoi:

>Preparare un file dati: Durante il processo di build, puoi esportare i dati dei servizi (latency, uptime, ecc.) in un formato come JSON.

>Utilizzare una pagina di confronto dinamica: Crea una pagina (ad esempio, compare.html) che, tramite JavaScript, legge i dati dal file JSON e costruisce il confronto in base ai parametri forniti dall'utente (ad esempio, tramite query string o selezioni da dropdown).

>Implementare logica client-side: Con JavaScript puoi leggere l'URL (ad esempio, compare.html?service1=nome1&service2=nome2), estrarre i parametri e cercare nei dati il confronto da mostrare. In questo modo non generi tutte le combinazioni a build time, ma gestisci il confronto in tempo reale nel browser.

>Questa soluzione ti permette di mantenere il sito statico (perfetto per GitHub Pages) e al contempo offrire un’esperienza interattiva e dinamica. Se il dataset non è troppo grande, il caricamento e il processamento lato client sarà veloce e gestibile.