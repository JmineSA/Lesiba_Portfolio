// Embedded AI chatbot assistant.
/* ============================================================
   FEATURE: Enhanced AI Chatbot
============================================================ */
(function chatbot() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChat);
  } else {
    initChat();
  }

  function initChat() {
    const toggle = document.getElementById('chatToggle');
    const widget = document.getElementById('chatWidget');
    const close = document.getElementById('chatClose');
    const clear = document.getElementById('chatClear');
    const input = document.getElementById('chatInput');
    const send = document.getElementById('chatSend');
    const messages = document.getElementById('chatMessages');
    const notification = document.getElementById('chatNotification');
    const suggestions = document.querySelectorAll('.suggestion-chip');

    if (!toggle || !widget) {
      console.warn('Chat elements not found.');
      return;
    }

    if (window.__chatInitialized) {
      console.log('Chat already initialized.');
      return;
    }
    window.__chatInitialized = true;

    console.log('🤖 Chat initialized!');

    setTimeout(() => {
      if (!widget.classList.contains('open')) {
        if (notification) notification.classList.add('visible');
      }
    }, 3000);

    const knowledge = {
      'project': [
        "📊 **Projects Lesiba has built:**\n\n1. **Mobile Data Consumption Intelligence** — Telecom analytics with Gradient Boosting, identifying 573 revenue drivers with R596 ARPU.\n\n2. **UbuntuCare Wait-Time System** — XGBoost model achieving R²=0.61, MAE=134 min, with R54.1M net benefit.\n\n3. **Fraud Detection in Banking** — Real-time classification with 95% accuracy, reducing false positives by 42%.",
        "Lesiba's projects focus on real business impact with measurable ROI."
      ],
      'skills': [
        "🛠️ **Core Skills:** Python, SQL, PySpark, Scikit-learn, XGBoost\n\n📊 **Specialties:** Regression, Classification, Time-Series Forecasting\n\n📈 **Tools:** Power BI, Streamlit, Plotly, Databricks",
        "Lesiba is proficient in the full ML lifecycle."
      ],
      'experience': [
        "💼 **Experience:**\n\n**Studio Intelligence AI** (2024-2025)\nData Science Consultant\n→ Built 3 production ML models\n→ Power BI dashboards\n\n**Local Butcher Shop** (2024)\nData Analytics Consultant\n→ A/B testing with 15% conversion lift",
        "Lesiba has 3+ years of experience."
      ],
      'education': [
        "🎓 **Education:**\n\n**BSc in Informatics** — UNISA (2024)\n**IBM Data Science Certificate** (2024)",
        "Lesiba combines formal education with hands-on experience."
      ],
      'contact': [
        "📧 **Email:** lesibajmine@gmail.com\n📱 **Phone:** +27 72 863 3144\n📍 **Location:** Pretoria, South Africa\n\n🔗 **GitHub:** github.com/JmineSA\n💼 **LinkedIn:** linkedin.com/in/lesiba-kganyago",
        "Ready to collaborate! Just reach out."
      ],
      'cv': [
        "📄 **Download Lesiba's CV** from the Download CV button.",
        "Available in the navigation or Contact section."
      ],
      'work': [
        "🔬 **Recent Work:**\n\n1. Telecom Consumption Intelligence\n2. UbuntuCare Wait-Time Prediction\n3. Fraud Detection in Banking",
        "Check the Work section for detailed case studies!"
      ],
      'achievement': [
        "🏆 **Key Achievements:**\n\n✅ +8% pricing forecast accuracy\n✅ -15% scheduling gaps\n✅ 84% churn-model precision\n✅ R54.1M net benefit identified"
      ],
      'default': [
        "👋 I'm Lesiba's AI assistant! Ask me about:\n📊 Projects\n🛠️ Skills\n💼 Experience\n🎓 Education\n📧 Contact",
        "Try asking: 'What projects has Lesiba built?'"
      ]
    };

    function getResponse(inputText) {
      const lower = inputText.toLowerCase();

      if (lower.includes('project') || lower.includes('build') || lower.includes('made') || lower.includes('work')) {
        return knowledge.project[Math.floor(Math.random() * knowledge.project.length)];
      }
      if (lower.includes('skill') || lower.includes('tool') || lower.includes('tech') || lower.includes('stack')) {
        return knowledge.skills[Math.floor(Math.random() * knowledge.skills.length)];
      }
      if (lower.includes('experience') || lower.includes('job') || lower.includes('consult') || lower.includes('career')) {
        return knowledge.experience[Math.floor(Math.random() * knowledge.experience.length)];
      }
      if (lower.includes('education') || lower.includes('study') || lower.includes('degree') || lower.includes('certif')) {
        return knowledge.education[Math.floor(Math.random() * knowledge.education.length)];
      }
      if (lower.includes('contact') || lower.includes('email') || lower.includes('phone') || lower.includes('reach')) {
        return knowledge.contact[Math.floor(Math.random() * knowledge.contact.length)];
      }
      if (lower.includes('cv') || lower.includes('resume') || lower.includes('download')) {
        return knowledge.cv[Math.floor(Math.random() * knowledge.cv.length)];
      }
      if (lower.includes('achievement') || lower.includes('award') || lower.includes('success')) {
        return knowledge.achievement[Math.floor(Math.random() * knowledge.achievement.length)];
      }
      if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        return "👋 Hello! Ask me about Lesiba's projects, skills, experience, or contact details.";
      }
      if (lower.includes('thanks') || lower.includes('thank you')) {
        return "You're welcome! 😊 Anything else you'd like to know?";
      }
      if (lower.includes('bye') || lower.includes('goodbye')) {
        return "👋 Goodbye! Feel free to come back anytime.";
      }

      return knowledge.default[Math.floor(Math.random() * knowledge.default.length)];
    }

    function addMessage(text, type) {
      const div = document.createElement('div');
      div.className = `message ${type}`;
      div.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function showTyping() {
      const div = document.createElement('div');
      div.className = 'message bot typing';
      div.innerHTML = '<span></span><span></span><span></span>';
      div.id = 'typingIndicator';
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function hideTyping() {
      const indicator = document.getElementById('typingIndicator');
      if (indicator) indicator.remove();
    }

    function handleSend() {
      const text = input.value.trim();
      if (!text) return;

      addMessage(text, 'user');
      input.value = '';
      input.placeholder = 'Thinking...';

      showTyping();

      const delay = 600 + Math.random() * 500;

      setTimeout(() => {
        hideTyping();
        const response = getResponse(text);
        addMessage(response, 'bot');
        input.placeholder = 'Ask a question...';

        if (notification) notification.classList.remove('visible');
      }, delay);
    }

    function clearChat() {
      messages.innerHTML = `
        <div class="message bot">🗑️ Chat cleared. Ask me anything!</div>
      `;
    }

    toggle.addEventListener('click', function(e) {
      e.stopPropagation();
      widget.classList.toggle('open');
      if (widget.classList.contains('open')) {
        if (notification) notification.classList.remove('visible');
        setTimeout(() => input.focus(), 300);
      }
    });

    if (close) {
      close.addEventListener('click', function(e) {
        e.stopPropagation();
        widget.classList.remove('open');
      });
    }

    if (clear) {
      clear.addEventListener('click', clearChat);
    }

    if (send) {
      send.addEventListener('click', handleSend);
    }

    if (input) {
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') handleSend();
      });
    }

    suggestions.forEach(chip => {
      chip.addEventListener('click', function() {
        const question = this.dataset.question;
        if (question) {
          input.value = question;
          handleSend();
        }
      });
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && widget.classList.contains('open')) {
        widget.classList.remove('open');
      }
    });

    document.addEventListener('click', function(e) {
      if (widget.classList.contains('open')) {
        const isWidget = widget.contains(e.target);
        const isToggle = toggle.contains(e.target);
        if (!isWidget && !isToggle) {
          widget.classList.remove('open');
        }
      }
    });

    const observer = new MutationObserver(function() {
      if (widget.classList.contains('open')) {
        if (notification) notification.classList.remove('visible');
      }
    });
    observer.observe(widget, { attributes: true, attributeFilter: ['class'] });

    console.log('🤖 Chat is ready!');
  }
})();
