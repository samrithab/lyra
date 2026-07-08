# Lyra

Lyra is a mobile stargazing application built with **React Native**, **Expo**, and **TypeScript** that calculates the real-time positions of the Sun, Moon, and visible planets based on the user's location and current time.

The app combines live GPS data, device sensors, and astronomical calculations to create an interactive view of the sky while demonstrating mobile sensor integration, real-time calculations, and data visualization.

---

## Features

- Live GPS location
- Real-time compass heading
- Device orientation (pitch & roll)
- Sun position calculations
- Moon position calculations
- Mercury, Venus, Mars, Jupiter, and Saturn visibility
- Real-time astronomical calculations using the user's location
- Interactive sky visualization
- Celestial position dashboard
- Experimental AR prototype

---

## Screenshots

*ADD SCREENSHOT*
---

# Tech Stack

### Mobile

- React Native
- Expo
- Expo Router
- TypeScript

### Device APIs

- Expo Location
- Expo Sensors
- Expo Camera

### Astronomy

- Astronomy Engine

### Graphics

- React Native Skia

---

# Architecture

```
                GPS
                 │
                 ▼
         Expo Location
                 │
                 ▼
      Astronomy Engine
                 │
                 ▼
      Celestial Coordinates
        (Altitude / Azimuth)
                 │
                 ▼
      Sky Visualization Layer
                 │
                 ▼
        Interactive Sky View
```

---

# How It Works

1. The user grants location permission.
2. The app retrieves the user's current GPS coordinates.
3. Astronomy Engine computes the positions of the Sun, Moon, and planets based on the current time and location.
4. The app determines:
   - Altitude
   - Azimuth
   - Visibility (Above or Below Horizon)
5. Device sensors provide heading and orientation information.
6. The visualization updates based on the user's position and viewing direction.

---

# Current Capabilities

Lyra currently supports:

- Live location
- Real-time astronomical calculations
- Device heading
- Device orientation
- Interactive sky visualization
- Celestial object information

---

# Experimental Features

An experimental camera overlay has been implemented to explore augmented reality visualization.

A production-quality AR stargazing experience requires advanced sensor fusion, camera calibration, and 3D coordinate projection. The current implementation serves as a proof of concept and foundation for future work.

---

# Future Improvements

- Major constellation rendering
- Star catalog integration
- International Space Station tracking
- Meteor shower calendar
- Planet rise and set times
- Telescope mode
- Improved AR overlay using ARKit / ARCore
- Deep sky object support
- Moon phase visualization

---

# Project Structure

```
app/
components/
hooks/
services/
types/
assets/
```

---

# What I Learned

This project provided experience with:

- React Native architecture
- Expo Router
- Mobile sensor integration
- GPS and location services
- Compass and orientation tracking
- Camera APIs
- Real-time astronomical calculations
- Coordinate systems
- Interactive graphics
- TypeScript
- Mobile UI development

---

# Running Locally

```bash
git clone https://github.com/yourusername/lyra.git

cd lyra

npm install

npx expo start
```

---

# Permissions

Lyra requires the following permissions:

- Location
- Motion Sensors
- Camera (Experimental AR mode)

---

# Challenges

One of the biggest challenges in this project was accurately visualizing celestial objects relative to the device's orientation. While calculating planetary positions using astronomical data is straightforward, creating a precise augmented reality experience requires accurate sensor fusion, camera calibration, and 3D coordinate transformations. Exploring these challenges provided valuable insight into how commercial stargazing applications approach real-time sky visualization.

---

# Why I Built Lyra

I've always loved astronomy since I was 6 years old. It's what I have so much love for and I always try to learn new things during my free time. I own a telescope and often stargaze. I wanted to personally experience the process of how to calculate coordinates, use sensors, gps and display objects in a mobile setting. Plus this is something that I thought I could use to keep track of what planets are visible during the night sky and point my telescope.
