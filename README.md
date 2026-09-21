# Student Directory

A small Angular application for browsing, filtering, and managing a directory of student records. The app loads student data from the JSONPlaceholder API, displays a searchable list, allows favourites to be toggled, and includes a form for adding new students.

## Features

- Browse a list of students loaded from a remote API
- Search students by name
- Toggle extra details on each card
- Mark students as favourites
- Filter to show only favourite students
- Add new student entries locally to the in-memory directory
- View a detailed student profile via route-based navigation
- Responsive, component-based Angular UI using standalone components

## Tech Stack

- Angular 22
- TypeScript
- RxJS
- Angular Router
- Angular Forms
- JSONPlaceholder API

## Project Structure

```text
student-directory/
├── src/
│   ├── app/
│   │   ├── add-student/
│   │   ├── student-card/
│   │   ├── student-detail/
│   │   ├── student-list/
│   │   ├── app.routes.ts
│   │   ├── app.ts
│   │   ├── app.html
│   │   ├── app.css
│   │   └── student.ts
│   ├── main.ts
│   ├── styles.css
│   └── index.html
├── angular.json
├── package.json
├── tsconfig.json
├── README.md
└── public/
```

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js 18+ or 20+
- npm

You can verify installation with:

```bash
node -v
npm -v
```

## Installation

1. Clone the repository:

```bash
git clone <your-repository-url>
cd student-directory
```

2. Install dependencies:

```bash
npm install
```

## Running the App

Start the Angular development server:

```bash
npm start
```

Then open the app in your browser at:

```text
http://localhost:4200/
```

The app uses Angular’s dev server and will automatically reload when source files change.

## Building for Production

To create a production build:

```bash
npm run build
```

The compiled files are generated in the `dist/` directory.

## Running Tests

This project includes Angular component tests. Run the suite with:

```bash
npm test -- --watch=false
```

If you want to use the default Angular test runner interface in watch mode:

```bash
npm test
```

## How the App Works

### Student list

The home page renders a list of student records. Each record includes details such as name, email, and username. Users can search by name using the input field, toggle extra details, and filter to favourites only.

### Favourites

Each student card includes a toggle button to mark or unmark a student as a favourite. The application keeps this state in the shared `StudentService` and updates the UI accordingly.

### Adding students

The Add Student form lets users create a new student with a name, score, and favourite status. New student entries are added to the in-memory student list so they appear immediately in the directory.

### Student detail page

Selecting a student opens a detail route where more information can be viewed, including address and company metadata.

## Key Files

- `src/app/student.ts` – student model and shared `StudentService`
- `src/app/student-list/student-list.ts` – list view logic and filtering
- `src/app/student-card/student-card.ts` – card UI behaviour
- `src/app/add-student/add-student.ts` – form submission and new student creation
- `src/app/student-detail/student-detail.ts` – detail route logic
- `src/app/app.routes.ts` – application routing configuration

## Notes

- Data is initially fetched from JSONPlaceholder, so the app works out of the box without a backend.
- Newly added students are stored locally in memory for the current session and are not persisted to a database.
- The app is designed as a frontend exercise/demo and is intentionally lightweight.

## License

This project is for educational/demo purposes.

## Contributing

Contributions are welcome if you want to expand the functionality, improve styling, or add persistence.
