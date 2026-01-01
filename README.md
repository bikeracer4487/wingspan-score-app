# Wingspan Score App

A mobile scoring companion app for the award-winning [Wingspan](https://stonemaiergames.com/games/wingspan/) board game. Track scores, manage players, and analyze your game history with detailed statistics.

## Features

### Score Tracking
- **Complete scoring support** for all Wingspan categories: Bird Cards, Bonus Cards, Round Goals, Eggs, Cached Food, and Tucked Cards
- **Dual scoring modes** supporting both Competitive (placement-based) and Casual (achievement-based) round goal scoring
- **Automatic tiebreaker calculation** using official rules (unused food tokens)
- **1-5 player support** per game session

### Player Management
- Create and manage player profiles with customizable avatar colors
- Soft delete preserves game history while hiding inactive players
- Quick player selection for new games

### Game History
- Complete game archive with timestamps and relative time display
- Full score breakdowns by category
- Scoring mode and player count tracking
- High score highlighting

### Statistics & Leaderboards
- Win rate and average finish position
- Best and current win streaks
- Last 5 game results at a glance
- Per-category score averages
- Head-to-head records between players
- Podium-style leaderboard display

### User Experience
- Nature-inspired color palette matching Wingspan's aesthetic
- Haptic feedback for tactile interaction
- Clean, card-based interface design
- Responsive layouts with safe area handling

## Tech Stack

- **Framework:** React Native 0.81 with Expo 54 (managed workflow)
- **Language:** TypeScript 5.9
- **State Management:** Zustand
- **Navigation:** React Navigation 7
- **Database:** SQLite (expo-sqlite)
- **Animations:** React Native Reanimated 4

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Emulator

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/wingspan-score-app.git
cd wingspan-score-app

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running the App

```bash
# iOS Simulator
npx expo run:ios

# Android Emulator
npx expo run:android

# Development build with Expo Go
npx expo start
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── common/       # Button, Card, Avatar, Input, ScoreInput
│   ├── games/        # Game-related components
│   ├── players/      # Player management components
│   ├── scoring/      # Score entry and display
│   └── stats/        # Statistics visualizations
├── screens/          # Full screen views
│   ├── home/         # Dashboard with recent games
│   ├── players/      # Player list and details
│   ├── game/         # New game flow screens
│   ├── history/      # Game history browsing
│   ├── stats/        # Leaderboard and analytics
│   └── settings/     # App preferences
├── navigation/       # React Navigation setup
├── stores/           # Zustand state management
├── db/               # SQLite database layer
│   └── repositories/ # Data access layer
├── hooks/            # Custom React hooks
├── utils/            # Business logic utilities
├── constants/        # Configuration and theming
├── theme/            # Theme provider
└── types/            # TypeScript definitions
```

## Scoring Rules Implementation

The app implements official Wingspan scoring rules:

| Category | Points |
|----------|--------|
| Bird Cards | Face value of each bird card |
| Bonus Cards | Points from completed bonus objectives |
| Round Goals (Competitive) | 1st: 4-5pts, 2nd: 1-2pts, 3rd: 0-1pt, 4th+: 0pts |
| Round Goals (Casual) | 1 point per achievement, max 5 per round |
| Eggs | 1 point each |
| Cached Food | 1 point each |
| Tucked Cards | 1 point each |

**Tiebreaker:** Most unused food tokens. Ties remain as shared victories.

## License

This project is for personal use. Wingspan is a trademark of Stonemaier Games.

## Acknowledgments

- [Stonemaier Games](https://stonemaiergames.com/) for creating Wingspan
- The React Native and Expo communities
