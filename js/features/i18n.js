// Multi-language support (translation dictionary + language switcher).
/* ============================================================
   UPGRADE: Multi-Language Support
============================================================ */
(function i18n() {
  const translations = {
    en: {
      'nav.about': 'About',
      'nav.experience': 'Experience',
      'nav.work': 'Work',
      'nav.skills': 'Skills',
      'nav.contact': 'Contact',
      'nav.download_cv': 'Download CV',
      'nav.lets_talk': "Let's talk",
      'hero.badge': 'Available for new opportunities',
      'hero.sub': 'End-to-end machine learning for real businesses — predictive models, forecasting and analytics that change <em>pricing, scheduling and risk decisions</em>.',
      'hero.view_projects': 'View projects',
      'hero.get_in_touch': 'Get in touch',
      'stats.pricing': 'Pricing forecast accuracy',
      'stats.scheduling': 'Scheduling gaps closed',
      'stats.churn': 'Churn-model precision',
      'stats.benefit': 'Net benefit identified',
      'stats.revenue': 'Revenue drivers · ARPU ≈ R596',
      'stats.experience': 'Years of experience',
      'about.tag': 'Profile',
      'about.lead': 'Consultant-grade data science, end to end — <em>from raw SQL pulls to models that ship</em> and change how a business prices, schedules and manages risk.',
      'about.p1': "I've built predictive models, time-series forecasts and classifiers for real operations — a music-studio revenue platform on Databricks, telecom data-consumption intelligence, an A/B testing programme for retail, healthcare wait-time prediction with a full cost–benefit case, and fraud detection in banking.",
      'about.p2': 'My core stack is Python, SQL and PySpark, with Streamlit, Power BI and Plotly for the storytelling layer. Right now I\'m pushing deeper into advanced machine learning and production-level deployment — models that don\'t just score well, but stay useful in the real world.',
      'experience.tag': 'Experience & Consulting',
      'exp.studio.1': 'Led end-to-end development of an ML platform on <b>Databricks and Python</b> to optimise music-studio revenue and operations.',
      'exp.studio.2': 'Designed and shipped three production-minded predictive models — forecasting, demand and churn — each tied to a decision the business could act on.',
      'exp.studio.3': 'Built <b>Power BI dashboards</b> translating model outputs into concrete pricing and scheduling decisions.',
      'exp.studio.stat1': 'pricing-accuracy gain, peak vs off-peak rates',
      'exp.studio.stat2': 'scheduling gaps — higher studio utilisation',
      'exp.studio.stat3': 'precision flagging high-risk churn clients',
      'exp.butcher.1': 'Designed and executed an <b>A/B testing framework</b> that proved product bundling lifted conversions by 15%.',
      'exp.butcher.2': 'Analysed sales data with <b>SQL and Python</b>, producing data-driven inventory recommendations the shop acted on immediately.',
      'work.tag': 'Selected Work',
      'work.read_case': '📊 Read the full case study',
      'work.telecom.summary': 'Simulated telecom analytics engagement — decoding data consumption, customer behaviour, revenue opportunity and network demand.',
      'work.telecom.p1': 'End-to-end analytics solution spanning mobile data consumption, customer behaviour, revenue opportunities and network demand.',
      'work.telecom.p2': 'Quantified <b>R32.8K</b> in revenue upside from under-predicted data usage and <b>R44.9K</b> in network over-allocation costs from over-predicted demand.',
      'work.telecom.p3': 'Showed forecasting error spikes <b>+255.7%</b> under congestion — the business case for <b>congestion-aware demand forecasting</b>.',
      'work.telecom.p4': 'Segmented customers across service usage, subscription plans, devices and network types to target bundles, upselling and plan optimisation.',
      'work.telecom.p5': 'Built an interactive <b>Streamlit dashboard</b> uniting customer, revenue, network and predictive views.',
      'work.telecom.stat1': 'high-value revenue drivers identified',
      'work.telecom.stat2': 'average ARPU in the high-value segment',
      'work.telecom.stat3': 'average data consumption per driver',
      'work.ubuntu.summary': 'Predicting patient wait times — and pricing the cost of getting it wrong.',
      'work.ubuntu.p1': 'XGBoost forecaster reaching <b>R² = 0.61, MAE = 134 min</b> against a target range of 1–1,088 min (mean 348).',
      'work.ubuntu.p2': 'Expected-value framework quantified a <b>R54.1M net benefit opportunity</b> across under-forecast, over-forecast and correct-prediction scenarios.',
      'work.ubuntu.p3': 'Feature analysis surfaced the true demand drivers: demographics, facility capacity and clinical risk factors.',
      'work.ubuntu.p4': '<b>66% precision</b> on the high-risk triage flag — urgent patients surface earlier.',
      'work.fraud.summary': 'A real-time fraud screen that cuts false positives without letting more fraud through.',
      'work.fraud.p1': 'Real-time scoring <b>improved customer transaction-approval rates</b> and minimised revenue lost to fraud.',
      'work.fraud.p2': 'Risk segmentation isolated the sharpest exposures — see Fig. 06 — instead of treating all traffic equally.',
      'work.fraud.p3': 'Findings fed <b>targeted verification flows and device-based security tiers</b>: friction only where the risk actually lives.',
      'github.tag': 'Open Source',
      'skills.tag': 'Skills Index',
      'education.tag': 'Education & Certification',
      'edu.unisa': 'Relevant coursework: data structures, statistics, database systems, programming.',
      'edu.ibm': 'Python project for data science · data analysis with Python · data visualisation · machine learning with Python.',
      'analytics.tag': 'Analytics',
      'contact.tag': 'Contact',
      'contact.sub': 'Open to data-science roles, analytics consulting and genuinely interesting problems. Based in Pretoria, South Africa — remote-friendly.',
      'ols.title': 'FIG. 01 — Live ordinary least squares',
      'ols.hint': 'Glide across the plot — the model retrains on every frame',
    },
    af: {
      'nav.about': 'Oor',
      'nav.experience': 'Ervaring',
      'nav.work': 'Werk',
      'nav.skills': 'Vaardighede',
      'nav.contact': 'Kontak',
      'nav.download_cv': 'Laai CV Af',
      'nav.lets_talk': "Kom ons gesels",
      'hero.badge': 'Beskikbaar vir nuwe geleenthede',
      'hero.sub': 'End-tot-end masjienleer vir regte besighede — voorspellende modelle, vooruitskatting en ontleding wat <em>prysbepaling, skedulering en risiko-besluite</em> verander.',
      'hero.view_projects': 'Bekyk projekte',
      'hero.get_in_touch': 'Kontak my',
      'about.tag': 'Profiel',
      'experience.tag': 'Ervaring & Konsultasie',
      'work.tag': 'Geselekteerde Werk',
      'github.tag': 'Oop Bron',
      'skills.tag': 'Vaardigheidsindeks',
      'education.tag': 'Onderwys & Sertifisering',
      'analytics.tag': 'Analise',
      'contact.tag': 'Kontak',
      'contact.sub': 'Oop vir data-wetenskap rolle, analise konsultasie en werklik interessante probleme. Gebaseer in Pretoria, Suid-Afrika — afstand-vriendelik.',
    },
    zu: {
      'nav.about': 'Mayelana',
      'nav.experience': 'Isipiliyoni',
      'nav.work': 'Umsebenzi',
      'nav.skills': 'Amakhono',
      'nav.contact': 'Oxhumana nami',
      'nav.download_cv': 'Landa iCV',
      'nav.lets_talk': "Asikhulume",
      'hero.badge': 'Itholakala emathubeni amasha',
      'hero.sub': 'Ukufunda ngomshini okuphela kokuphela kwamabhizinisi — amamodeli okubikezela, ukubikezela kanye nokuhlaziya okushintsha <em>izinqumo zokubeka amanani, ukuhlela kanye nengozi</em>.',
      'hero.view_projects': 'Buka amaphrojekthi',
      'hero.get_in_touch': 'Xhumana nami',
      'about.tag': 'Umlando',
      'experience.tag': 'Isipiliyoni & Ukweluleka',
      'work.tag': 'Imisebenzi Ekhethiwe',
      'github.tag': 'Umthombo Ovulekile',
      'skills.tag': 'Inkomba Yamakhono',
      'education.tag': 'Imfundo & Izitifiketi',
      'analytics.tag': 'Ukuhlaziya',
      'contact.tag': 'Oxhumana nami',
      'contact.sub': 'Ngivulelekile ezindimeni zesayensi yedatha, ukweluleka ngokuhlaziya kanye nezinkinga ezithakazelisayo. Ngizinze ePretoria, eNingizimu Afrika — ngivumelana nokusebenza kude.',
    }
  };

  let currentLang = localStorage.getItem('portfolio-lang') || 'en';

  function applyLanguage(lang) {
    const t = translations[lang] || translations.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        el.innerHTML = t[key];
      }
    });
    document.documentElement.lang = lang;
    localStorage.setItem('portfolio-lang', lang);

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    document.querySelectorAll('.scr[data-text]').forEach(el => {
      const text = el.getAttribute('data-text');
      if (text) el.textContent = text;
    });
  }

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      currentLang = lang;
      applyLanguage(lang);
    });
  });

  applyLanguage(currentLang);
})();
