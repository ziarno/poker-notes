# Meteor + Vue3 + Vite

This is a simple app with Vue3, Tailwind and Meteor.

## How to use

1. Clone this repo
2. Run `meteor npm install`
3. Run `meteor`
4. Open `http://localhost:3000` in your browser

## Production Build

### Prerequisites

You need MongoDB installed and running locally. On macOS:

```bash
# Install MongoDB using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB as a service
brew services start mongodb-community

# Verify it's running
mongosh  # Should connect to mongodb://localhost:27017
```

### Building and Running

```bash
# Build the production app (includes dependency installation)
npm run build

# Run the production app
npm run prod
```

The app will build to `./build/bundle/` and start on http://localhost:3000.

### Environment Configuration

Production settings are in `.env.local`:
- `MONGO_URL` - MongoDB connection string (default: mongodb://localhost:27017/poker-notes)
- `ROOT_URL` - Your app's public URL (default: http://localhost:3000)
- `PORT` - Port to run on (default: 3000)
- `NODE_ENV` - Node environment (default: production)

### Troubleshooting

**MongoDB not running:**
```bash
brew services start mongodb-community
```

**Port already in use:**
Change the `PORT` in `.env.local` to a different port.

**Build fails:**
Delete the build directory and try again:
```bash
rm -rf ./build
npm run build
```

**First build:**
The first build installs all server dependencies and may take a few minutes. Subsequent builds are faster.

## Libraries used

- [Vue3](https://v3.vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Vue Router](https://next.router.vuejs.org/)
- [Meteor](https://www.meteor.com/)
- [Vue Meteor Tracker](https://github.com/meteor-vue/vue-meteor-tracker)
- [Tailwind CSS](https://tailwindcss.com/)
- [PrimeVue](https://primevue.org/)
