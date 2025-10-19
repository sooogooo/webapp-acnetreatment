// Service Worker版本（更新时修改此版本号）
const CACHE_VERSION = 'acne-treatment-v1.0.0';

// 需要缓存的核心文件
const CORE_CACHE_FILES = [
  '/',
  '/index.html',
  '/treatments.html',
  '/favicon.png',
  '/manifest.json'
];

// 需要缓存的章节文件
const CHAPTER_CACHE_FILES = [
  '/chapters/01.md',
  '/chapters/02.md',
  '/chapters/03.md',
  '/chapters/04.md',
  '/chapters/05.md',
  '/chapters/06.md',
  '/chapters/07.md',
  '/chapters/08.md',
  '/chapters/09.md',
  '/chapters/10.md'
];

// 所有需要缓存的文件
const CACHE_FILES = [...CORE_CACHE_FILES, ...CHAPTER_CACHE_FILES];

// Service Worker安装事件
self.addEventListener('install', (event) => {
  console.log('[Service Worker] 安装中...', CACHE_VERSION);

  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => {
        console.log('[Service Worker] 缓存核心文件');
        return cache.addAll(CACHE_FILES);
      })
      .then(() => {
        console.log('[Service Worker] 安装成功');
        return self.skipWaiting(); // 立即激活新的Service Worker
      })
      .catch((error) => {
        console.error('[Service Worker] 安装失败:', error);
      })
  );
});

// Service Worker激活事件
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] 激活中...', CACHE_VERSION);

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        // 删除旧版本的缓存
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_VERSION) {
              console.log('[Service Worker] 删除旧缓存:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] 激活成功');
        return self.clients.claim(); // 立即控制所有页面
      })
  );
});

// Service Worker拦截请求事件
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 只处理同源请求
  if (url.origin !== location.origin) {
    return;
  }

  // 使用缓存优先策略
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // 如果缓存中有，直接返回缓存
        if (cachedResponse) {
          console.log('[Service Worker] 从缓存返回:', request.url);

          // 后台更新缓存（Stale-While-Revalidate策略）
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_VERSION)
                  .then((cache) => {
                    cache.put(request, networkResponse);
                  });
              }
            })
            .catch(() => {
              // 网络请求失败，不影响返回缓存结果
            });

          return cachedResponse;
        }

        // 缓存中没有，从网络获取
        console.log('[Service Worker] 从网络获取:', request.url);
        return fetch(request)
          .then((networkResponse) => {
            // 检查响应是否有效
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
              return networkResponse;
            }

            // 克隆响应（因为响应流只能使用一次）
            const responseToCache = networkResponse.clone();

            // 将新资源添加到缓存
            caches.open(CACHE_VERSION)
              .then((cache) => {
                // 只缓存GET请求
                if (request.method === 'GET') {
                  cache.put(request, responseToCache);
                }
              });

            return networkResponse;
          })
          .catch((error) => {
            console.error('[Service Worker] 网络请求失败:', request.url, error);

            // 如果是HTML页面请求失败，返回离线页面
            if (request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html');
            }

            // 其他资源请求失败，返回错误
            return new Response('Network error occurred', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Service Worker消息事件（用于手动清除缓存等操作）
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('[Service Worker] 缓存已清除');
      event.ports[0].postMessage({ success: true });
    });
  }

  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    caches.open(CACHE_VERSION).then((cache) => {
      cache.keys().then((keys) => {
        event.ports[0].postMessage({
          cacheSize: keys.length,
          cacheName: CACHE_VERSION
        });
      });
    });
  }
});

// 推送通知事件（可选，未来可扩展）
self.addEventListener('push', (event) => {
  console.log('[Service Worker] 收到推送消息');

  const options = {
    body: event.data ? event.data.text() : '您有新的治疗提醒',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '查看详情',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: '关闭',
        icon: '/icons/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('痘痘再见提醒', options)
  );
});

// 通知点击事件（可选）
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] 通知被点击');
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
