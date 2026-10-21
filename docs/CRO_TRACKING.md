# Quotation and measurement

Primary outcome: a request containing model, requested dimensions, LED, control, antifog, destination city and UTM-derived source code. No public calculated price or stock assertion. Existing illustrative price file remains internal/unrendered; old structured offers and FAQ prices are removed. A WhatsApp click is engagement/lead intent, never a confirmed sale.

Existing LeadPayload and optional Cloudflare endpoint contracts remain intact. Existing validation, session draft, number normalization, and network-failure WhatsApp fallback are retained. Configurator range 30–200 cm; separate form 20–300 cm integer inputs. Round configuration uses one diameter. Product selection preserves Leaf and Half Moon instead of silently replacing them with Capsul.

Preserved events: UTM attribution, scroll/dwell funnel, configurator_start/send, view_item, generate_lead, lead_form_* and lead_submit, FAQ interactions. New events: showroom_entry, product_catalog_view, product_select, product_3d_open, product_3d_rotate, product_3d_zoom, lighting_option_change, story_chapter_view, configurator_complete, quote_request_click, whatsapp_click. Rotation/zoom aggregate to at most once per event per five seconds. Story chapters deduplicate per session. Hero exploration emits showroom_entry instead of generate_lead.

All third-party tracker scripts load only after affirmative pg_cookie_consent=granted. trackEvent rechecks storage before calling any SDK; denial/revocation gates subsequent events. SDK consent methods are invoked on change. Footer reopens preferences. Essential local UTM/session behavior still works when analytics is declined. Form and configuration contact input should stay masked in session recording; event payloads never include name, phone, city, or notes.

Optional vendor identifiers are consumed from existing NEXT_PUBLIC_* environment keys, never hardcoded. Tests block outbound third-party requests and use synthetic SDK spies to verify event gating. Live account delivery, ad dashboards, field conversion rates, and real sales attribution require configured owner accounts and production traffic; no such delivery is claimed from local tests.

The old scarcity CTA variant is retired: there is no inventory basis for 'slot produksi terbatas'. Existing experiment attribution utilities are retained; historical exposure labels must not be interpreted as an active V3 visual experiment without a new test definition.
Clarity uses the current consentv2 signal (ad_Storage / analytics_Storage); legacy consent=false is retained only for cookie erasure on rejection. Enable Consent Mode in the owner account when configuring Clarity. Reference: https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2 .
