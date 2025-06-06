# Super Todo List

En enkel og effektiv todo-liste laget med React og Vite. Hold oversikt over daglige oppgaver med et rent og brukervennlig grensesnitt.

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

1. Klon prosjektet:
   ```bash
   git clone https://github.com/dittbrukernavn/supertodolist.git
   cd supertodolist
   ```

2. Installer avhengigheter:
   ```bash
   npm install
   ```

3. Start utviklingsserveren:
   ```bash
   npm run dev
   ```

4. Åpne nettleseren og gå til `http://localhost:5173`

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
