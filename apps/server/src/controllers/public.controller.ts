import type { Request, Response } from "express";
import { contactsService } from "../services/contacts.service.js";
import { trackingService } from "../services/tracking.service.js";
import { getSingleParam } from "../utils/request.js";

function renderVerificationHtml(status: "success" | "error", message: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VAJRITA Contact Verification</title>
    <style>
      body { margin: 0; font-family: Arial, sans-serif; background: #0f1115; color: #fff; display:flex; min-height:100vh; align-items:center; justify-content:center; }
      .card { width:min(440px, 92vw); background:#171a21; border:1px solid #2f3642; border-radius:24px; padding:32px; box-shadow:0 10px 40px rgba(0,0,0,.35); }
      h1 { margin-top:0; }
      .pill { display:inline-block; padding:8px 12px; border-radius:999px; background:${status === "success" ? "#1e8e3e" : "#b3261e"}; }
    </style>
  </head>
  <body>
    <div class="card">
      <span class="pill">${status === "success" ? "Verified" : "Error"}</span>
      <h1>Trusted Contact Verification</h1>
      <p>${message}</p>
      <p>You can close this page and return to the app.</p>
    </div>
  </body>
</html>`;
}

function renderTrackingHtml(shareToken: string, payload: unknown) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VAJRITA Live Tracking</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
      body { margin:0; font-family: Arial, sans-serif; background:#0f1115; color:#fff; }
      header { padding:16px 20px; border-bottom:1px solid #2a2f39; display:flex; justify-content:space-between; align-items:center; }
      #map { height: calc(100vh - 132px); width:100%; }
      .meta { padding:16px 20px; background:#171a21; border-bottom:1px solid #2a2f39; }
      .badge { display:inline-block; padding:6px 10px; border-radius:999px; background:#8b1111; margin-right:8px; }
      a { color: #fff; }
    </style>
  </head>
  <body>
    <header>
      <strong>VAJRITA Live Tracking</strong>
      <span id="status"></span>
    </header>
    <div class="meta">
      <div id="last-updated">Waiting for location...</div>
      <div id="open-maps"></div>
    </div>
    <div id="map"></div>
    <script src="https://cdn.socket.io/4.8.1/socket.io.min.js"></script>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      window.__INITIAL_TRACKING__ = ${JSON.stringify(payload)};
      const map = L.map('map').setView([20.5937, 78.9629], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);
      const marker = L.marker([20.5937, 78.9629]).addTo(map);

      function renderState(data) {
        const status = document.getElementById('status');
        const updated = document.getElementById('last-updated');
        const openMaps = document.getElementById('open-maps');

        status.textContent = data.active ? 'ACTIVE' : 'INACTIVE';
        status.className = 'badge';
        if (data.lastLocation) {
          const { latitude, longitude, timestamp } = data.lastLocation;
          marker.setLatLng([latitude, longitude]);
          map.setView([latitude, longitude], 16);
          updated.textContent = 'Last updated: ' + new Date(timestamp).toLocaleString();
          openMaps.innerHTML = '<a target="_blank" rel="noopener noreferrer" href="https://maps.google.com/?q=' + latitude + ',' + longitude + '">Open in Google Maps</a>';
        } else {
          updated.textContent = 'Location not available yet.';
          openMaps.innerHTML = '';
        }
      }

      renderState(window.__INITIAL_TRACKING__);
      const socket = io({ transports: ['websocket'] });
      socket.emit('watch:track', '${shareToken}');
      socket.on('tracking:update', renderState);
      socket.on('tracking:stopped', renderState);
    </script>
  </body>
</html>`;
}

export const publicController = {
  async verifyContact(req: Request, res: Response) {
    try {
      const rawToken = getSingleParam(req.params.token);
      const contact = await contactsService.verifyByToken(rawToken);
      res.status(200).send(
        renderVerificationHtml("success", `${contact.name} is now a verified trusted contact.`),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Verification failed";
      res.status(400).send(renderVerificationHtml("error", message));
    }
  },

  async publicTrack(req: Request, res: Response) {
    const shareToken = getSingleParam(req.params.shareToken);
    const data = await trackingService.getPublic(shareToken);
    res.status(200).send(renderTrackingHtml(shareToken, data));
  },
};
