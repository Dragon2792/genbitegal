const https = require('https');
const fs = require('fs');

function download(url, dest, cb) {
  const file = fs.createWriteStream(dest);
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, function(response) {
    if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
      // Follow redirect
      download(response.headers.location.startsWith('http') ? response.headers.location : `https://${response.req.host}${response.headers.location}`, dest, cb);
    } else {
      response.pipe(file);
      file.on('finish', () => file.close(cb));
    }
  }).on('error', (e) => {
    console.error(e);
  });
}

download('https://api.allorigins.win/raw?url=' + encodeURIComponent('https://upload.wikimedia.org/wikipedia/id/3/36/Logo_Universitas_Pancasakti.png'), 'c:/xampp/htdocs/genbi-nextjs/public/assets/images/logo-ups.png', () => console.log('UPS'));
download('https://api.allorigins.win/raw?url=' + encodeURIComponent('https://upload.wikimedia.org/wikipedia/commons/e/ec/Logo_UNIKAL_%28Universitas_Pekalongan%29.png'), 'c:/xampp/htdocs/genbi-nextjs/public/assets/images/logo-unikal.png', () => console.log('UNIKAL'));
