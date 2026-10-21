'use client';
import { useEffect } from 'react';
type TrackingConfig = { meta?: string; tiktok?: string; ga?: string; clarity?: string };
export function TrackingConsent({ config }: { config: TrackingConfig }) {
  useEffect(() => {
    let loaded = false;
    const clean = (id?: string) => id && /^[a-zA-Z0-9_-]+$/.test(id) ? id : undefined;
    const inline = (source: string) => { const script = document.createElement('script'); script.dataset.pgTracker = 'true'; script.textContent = source; document.head.appendChild(script); };
    const apply = () => {
      let granted = false;
      try { granted = localStorage.getItem('pg_cookie_consent') === 'granted'; } catch { /* Default denied. */ }
      if (!granted) {
        window.fbq?.('consent', 'revoke');
        (window.ttq as unknown as { revokeConsent?: () => void })?.revokeConsent?.();
        window.gtag?.('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
        window.clarity?.('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' });
        window.clarity?.('consent', false);
        return;
      }
      window.fbq?.('consent', 'grant');
      (window.ttq as unknown as { grantConsent?: () => void })?.grantConsent?.();
      window.gtag?.('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' });
      window.clarity?.('consentv2', { ad_Storage: 'granted', analytics_Storage: 'granted' });
      if (loaded) return;
      loaded = true;
      const meta = clean(config.meta), tiktok = clean(config.tiktok), ga = clean(config.ga), clarity = clean(config.clarity);
      if (meta) inline(`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('consent','grant');fbq('init','${meta}');fbq('track','PageView');`);
      if (tiktok) inline(`!function(w,d,t){w.TiktokAnalyticsObject=t;var q=w[t]=w[t]||[];q.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie','grantConsent','revokeConsent'];q.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<q.methods.length;i++)q.setAndDefer(q,q.methods[i]);q.instance=function(t){for(var e=q._i[t]||[],n=0;n<q.methods.length;n++)q.setAndDefer(e,q.methods[n]);return e};q.load=function(e,n){q._i=q._i||{};q._i[e]=[];q._i[e]._u='https://analytics.tiktok.com/i18n/pixel/events.js';q._t=q._t||{};q._t[e]=+new Date;q._o=q._o||{};q._o[e]=n||{};var s=d.createElement('script');s.async=1;s.src=q._i[e]._u+'?sdkid='+e+'&lib='+t;d.head.appendChild(s)};q.load('${tiktok}');q.grantConsent();q.page()}(window,document,'ttq');`);
      if (ga) {
        inline(`window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('consent','default',{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});gtag('js',new Date());gtag('config','${ga}');`);
        const script = document.createElement('script'); script.async = true; script.src = `https://www.googletagmanager.com/gtag/js?id=${ga}`; document.head.appendChild(script);
      }
      if (clarity) inline(`(function(c,l,a,r,i){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};var t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;l.head.appendChild(t)})(window,document,'clarity','script','${clarity}');clarity('consentv2',{ad_Storage:'granted',analytics_Storage:'granted'});`);
    };
    apply();
    window.addEventListener('pg:consent', apply);
    window.addEventListener('storage', apply);
    return () => { window.removeEventListener('pg:consent', apply); window.removeEventListener('storage', apply); };
  }, [config]);
  return null;
}
