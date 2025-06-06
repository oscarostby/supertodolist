# Super Todo List

## Hvordan bruke

1. **Legg til oppgaver**
   - Skriv inn oppgaven i feltet nederst på siden
   - Trykk Enter eller på +-knappen for å legge den til

2. **Marker oppgaver som fullført**
   - Klikk på avkrysningsboksen foran hver oppgave
   - Fullførte oppgaver blir gjennomstreket

3. **Filtrer oppgaver**
   - Bruk filterknappene øverst til venstre for å vise:
     - Alle oppgaver
     - Kun aktive (ufullførte) oppgaver
     - Kun fullførte oppgaver

4. **Slett oppgaver**
   - Klikk på X-knappen til høyre for oppgaven du vil slette
   
5. **Dra og slipp**
   - Hold tak i oppgaven og dra den for å endre rekkefølgen

## Utviklermiljø

For å sette opp utviklermiljøet ditt:

## Funksjoner

- **Legg til oppgaver** - Enkelt legge til nye oppgaver
- **Oppgaveliste** - Marker oppgaver som fullførte eller ufullførte
- **Filtrering** - Filtrer oppgaver etter:
  - Alle oppgaver
  - Aktive oppgaver
  - Fullførte oppgaver
- **Responsivt design** - Fungerer på både mobil og desktop
- **Rent grensesnitt** - Oversiktlig og enkelt å bruke

## Teknologier

- **Frontend**: React 18
- **Byggeverktøy**: Vite
- **Stilsett**: CSS Modules & Styled Components
- **Navigasjon**: React Router v6
- **Dra og slipp**: react-beautiful-dnd
- **Pakkehåndterer**: npm

## Kom i gang

1. **Klon prosjektet**
   ```bash
   git clone https://github.com/dittbrukernavn/supertodolist.git
   cd supertodolist
   ```

2. **Installer avhengigheter**
   ```bash
   npm install
   ```

3. **Start utviklingsserveren**
   ```bash
   npm run dev
   ```
   Dette starter en lokal utviklingsserver med live reload.

4. **Åpne i nettleseren**
   Gå til `http://localhost:5173` i din nettleser

## Utvikling

### Viktige filer og mapper

- `src/App.jsx` - Hovedkomponenten for applikasjonen
- `src/components/TodoApp/` - Hovedlogikken for todo-listen
- `src/styles/` - Globale stiler
- `public/` - Statiske filer som blir kopiert til build-mappen

### Vanlige npm-kommandoer

- `npm run dev` - Starter utviklingsserveren
- `npm run build` - Bygger produksjonsversjon
- `npm run lint` - Kjører ESLint for å sjekke kodekvalitet
- `npm run preview` - Forhåndsviser produksjonsbygget lokalt

### Hvordan legge til nye funksjoner

1. Lag en ny branch for funksjonen din:
   ```bash
   git checkout -b navn-pa-funksjonen
   ```
2. Gjør endringene dine
3. Test endringene grundig
4. Send en pull request til hovedgrenen

### Feilsøking

- **Feil ved installasjon?** Prøv å slette `node_modules` og `package-lock.json`, og kjør `npm install` på nytt.
- **Serveren starter ikke?** Sjekk om port 5173 er opptatt, eller om du har alle avhengigheter installert.
- **React-advarsler?** Sjekk konsollen i nettleseren for mer informasjon.

## Bygge for produksjon

For å lage en produksjonsversjon:

```bash
npm run build
```

Dette vil generere en optimalisert produksjonsversjon i `dist`-mappen.

## Prosjektstruktur

```
supertodolist/
├── public/              # Statiske filer
├── src/
│   ├── assets/          # Bilder og andre statiske ressurser
│   ├── components/      # Gjenbrukbare komponenter
│   │   └── TodoApp/     # Hovedkomponenten for todo-listen
│   ├── pages/           # Sider
│   ├── styles/          # Globale stiler
│   ├── App.jsx          # Hovedkomponent
│   └── main.jsx         # Inngangspunkt for applikasjonen
├── .gitignore
├── package.json         # Avhengigheter og skript
├── vite.config.js       # Vite-konfigurasjon
└── README.md            # Denne filen
```

## Lisens

Dette prosjektet er lisensiert under MIT-lisensen. Se [LICENSE](LICENSE) for detaljer.

