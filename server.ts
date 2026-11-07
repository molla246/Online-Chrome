import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google Gen AI if key is present
const aiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (aiApiKey && aiApiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({ 
      apiKey: aiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// 1. Omnibox search suggestions endpoint
app.get('/api/suggest', async (req, res) => {
  const query = (req.query.q as string || '').trim();
  if (!query) {
    return res.json({ suggestions: [] });
  }

  try {
    const googleSuggestUrl = `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(query)}`;
    const response = await fetch(googleSuggestUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      }
    });

    if (response.ok) {
      const data = await response.json();
      // data format: [query, [sug1, sug2, ...], [desc1, desc2, ...], ...]
      const suggestions = Array.isArray(data[1]) ? data[1].slice(0, 7) : [];
      return res.json({ suggestions });
    }
  } catch (error) {
    console.warn('Suggest API fallback:', error);
  }

  // Fallback default suggestions
  const defaultList = [
    `${query} meaning in bengali`,
    `${query} bangla news`,
    `${query} tutorial`,
    `${query} wikipedia`,
    `${query} latest update`,
    `how to ${query}`
  ];
  return res.json({ suggestions: defaultList.slice(0, 5) });
});

// 2. Real Search Endpoint with Web Results & Gemini AI Overview
app.get('/api/search', async (req, res) => {
  const query = (req.query.q as string || '').trim();
  const category = (req.query.cat as string || 'all').toLowerCase();

  if (!query) {
    return res.json({ query: '', results: [], aiOverview: null, knowledgePanel: null });
  }

  try {
    // 1. Fetch Wikipedia summary if relevant
    let knowledgePanel: any = null;
    try {
      const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query.replace(/ /g, '_'))}`;
      const wikiRes = await fetch(wikiUrl, {
        headers: { 'User-Agent': 'ChromeWebBrowser/1.0 (contact@example.com)' }
      });
      if (wikiRes.ok) {
        const wikiData = await wikiRes.json();
        if (wikiData.type === 'standard' && wikiData.extract) {
          knowledgePanel = {
            title: wikiData.title,
            description: wikiData.description || 'Information from Wikipedia',
            extract: wikiData.extract,
            thumbnail: wikiData.thumbnail?.source || null,
            contentUrl: wikiData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiData.title)}`
          };
        }
      }
    } catch (e) {
      // ignore
    }

    // 2. Fetch DuckDuckGo instant answer / web results
    let webResults: any[] = [];
    try {
      const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
      const ddgRes = await fetch(ddgUrl);
      if (ddgRes.ok) {
        const ddgData = await ddgRes.json();
        if (ddgData.AbstractText) {
          webResults.push({
            title: ddgData.Heading || query,
            url: ddgData.AbstractURL || `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
            domain: ddgData.AbstractSource || 'duckduckgo.com',
            snippet: ddgData.AbstractText
          });
        }

        if (Array.isArray(ddgData.RelatedTopics)) {
          for (const item of ddgData.RelatedTopics.slice(0, 8)) {
            if (item.Text && item.FirstURL) {
              const urlObj = new URL(item.FirstURL);
              webResults.push({
                title: item.Text.split(' - ')[0] || item.Text.slice(0, 50),
                url: item.FirstURL,
                domain: urlObj.hostname.replace('www.', ''),
                snippet: item.Text
              });
            } else if (item.Topics && Array.isArray(item.Topics)) {
              for (const sub of item.Topics.slice(0, 3)) {
                if (sub.Text && sub.FirstURL) {
                  const u = new URL(sub.FirstURL);
                  webResults.push({
                    title: sub.Text.split(' - ')[0] || sub.Text.slice(0, 50),
                    url: sub.FirstURL,
                    domain: u.hostname.replace('www.', ''),
                    snippet: sub.Text
                  });
                }
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn('DDG search error:', e);
    }

    // If webResults is sparse, supplement with curated contextual web results
    if (webResults.length < 4) {
      webResults.push(
        {
          title: `${query} - Google Search`,
          url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
          domain: 'google.com',
          snippet: `Find the most comprehensive information, news, videos, and articles about "${query}" on Google Search.`
        },
        {
          title: `${query} - Wikipedia, the free encyclopedia`,
          url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
          domain: 'en.wikipedia.org',
          snippet: `Articles, history, definitions, references, and encyclopedic knowledge related to ${query}.`
        },
        {
          title: `Explore ${query} on YouTube - Watch Videos & Tutorials`,
          url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
          domain: 'youtube.com',
          snippet: `Discover top videos, documentaries, guides, and tutorials regarding ${query}.`
        },
        {
          title: `Latest News and Updates on ${query}`,
          url: `https://news.google.com/search?q=${encodeURIComponent(query)}`,
          domain: 'news.google.com',
          snippet: `Read breaking headlines, global coverage, and recent stories about ${query}.`
        }
      );
    }

    // 3. AI Overview (Gemini) if available
    let aiOverview: { text: string; sources?: { title: string; url: string }[] } | null = null;
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Provide a helpful, objective Google Search "AI Overview" summary for the search query: "${query}". 
          Respond in the language of the query (if Bengali, in Bengali; if English, in English). 
          Keep it concise (2-4 clear paragraphs or bullet points). Format cleanly with bold headings or key points if helpful.`,
        });
        if (response.text) {
          aiOverview = {
            text: response.text,
            sources: [
              { title: 'Google Knowledge Graph', url: `https://www.google.com/search?q=${encodeURIComponent(query)}` },
              { title: 'Wikipedia Encyclopedia', url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}` }
            ]
          };
        }
      } catch (err) {
        console.warn('Gemini AI Overview error:', err);
      }
    } else {
      // Smart local AI overview
      aiOverview = {
        text: `Here is a summary for "${query}". You can browse comprehensive web results, navigate directly to official websites, or read quick facts below. Click any link to open and explore directly within this Chrome browser.`,
        sources: [
          { title: 'Google Search', url: `https://www.google.com/search?q=${encodeURIComponent(query)}` },
          { title: 'Wikipedia Reference', url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}` }
        ]
      };
    }

    return res.json({
      query,
      category,
      aiOverview,
      knowledgePanel,
      results: webResults
    });
  } catch (error: any) {
    console.error('Search endpoint error:', error);
    return res.status(500).json({ error: 'Search failed', details: error.message });
  }
});

// 3. Web Proxy Endpoint for browsing any URL inside the Chrome simulator
app.get('/api/proxy', async (req, res) => {
  let targetUrl = req.query.url as string;
  if (!targetUrl) {
    return res.status(400).send('Missing url parameter');
  }

  // Normalize target URL
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'https://' + targetUrl;
  }

  try {
    const parsed = new URL(targetUrl);
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'bn-BD,bn;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      redirect: 'follow'
    });

    const contentType = response.headers.get('content-type') || 'text/html';

    // If not HTML (image, css, js, json, etc.), pipe directly
    if (!contentType.includes('text/html')) {
      const buffer = await response.arrayBuffer();
      res.setHeader('Content-Type', contentType);
      return res.send(Buffer.from(buffer));
    }

    let html = await response.text();

    // Inject base href tag so relative links, images, styles load correctly from original host
    const origin = parsed.origin;
    const baseHref = `<base href="${targetUrl}">`;

    // Intercept navigation script: when user clicks a link inside the iframe, notify parent Chrome browser
    const injectionScript = `
      <script>
        (function() {
          // Listen to clicks on <a> tags to inform Chrome tab omnibox
          document.addEventListener('click', function(e) {
            var target = e.target;
            while (target && target.tagName !== 'A') {
              target = target.parentElement;
            }
            if (target && target.href && !target.href.startsWith('javascript:')) {
              e.preventDefault();
              try {
                window.parent.postMessage({
                  type: 'CHROME_NAVIGATE',
                  url: target.href,
                  title: document.title || target.innerText || target.href
                }, '*');
              } catch(err) {
                window.location.href = '/api/proxy?url=' + encodeURIComponent(target.href);
              }
            }
          }, true);

          // Notify title
          window.addEventListener('load', function() {
            try {
              window.parent.postMessage({
                type: 'CHROME_TITLE_UPDATE',
                url: window.location.href,
                title: document.title
              }, '*');
            } catch(e) {}
          });
        })();
      </script>
    `;

    // Insert base and script into <head>
    if (html.includes('<head>')) {
      html = html.replace('<head>', `<head>${baseHref}${injectionScript}`);
    } else if (html.includes('<html>')) {
      html = html.replace('<html>', `<html><head>${baseHref}${injectionScript}</head>`);
    } else {
      html = baseHref + injectionScript + html;
    }

    // Set safe headers to allow embedding
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.removeHeader('X-Frame-Options');
    res.removeHeader('Content-Security-Policy');

    return res.send(html);
  } catch (error: any) {
    console.error('Proxy error:', error);
    const friendlyErrorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Site Can't Be Reached</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #fff; color: #202124; padding: 40px; margin: 0; }
            .container { max-width: 600px; margin: 40px auto; }
            .icon { width: 56px; height: 56px; fill: #5f6368; margin-bottom: 24px; }
            h1 { font-size: 24px; font-weight: 500; margin: 0 0 16px 0; color: #202124; }
            p { font-size: 14px; line-height: 1.6; color: #5f6368; margin-bottom: 24px; }
            .error-code { font-size: 12px; color: #70757a; margin-top: 30px; }
            .btn { background: #1a73e8; color: #fff; border: none; padding: 8px 24px; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer; }
            .btn:hover { background: #1557b0; }
          </style>
        </head>
        <body>
          <div class="container">
            <svg class="icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            <h1>This site can’t be reached</h1>
            <p>The webpage at <strong>${encodeURI(targetUrl)}</strong> might be temporarily down or it may have moved permanently to a new web address.</p>
            <button class="btn" onclick="window.location.reload()">Reload</button>
            <div class="error-code">ERR_NAME_NOT_RESOLVED / PROXY_TIMEOUT</div>
          </div>
        </body>
      </html>
    `;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(friendlyErrorHtml);
  }
});

// Vite middleware integration
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Chrome Browser Server running at http://localhost:${PORT}`);
  });
}

startServer();
