document.addEventListener('DOMContentLoaded', () => {
  const reveals = document.querySelectorAll('.reveal');
  const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.85;
    reveals.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop < triggerBottom) {
        section.classList.add('visible');
      }
    });
  };
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();

 
  const sun = document.querySelector('.pixel-sun');
  const moon = document.querySelector('.pixel-moon');
  function updateSky() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight ? scrollY / docHeight : 0;

    // Sun and moon movement
    const sunTop = 40 + (window.innerHeight * 0.8 - 40) * scrollPercent;
    const moonTop = 40 + (window.innerHeight * 0.8 - 40) * (1 - scrollPercent);
    if (sun) {
      sun.style.top = `${sunTop}px`;
      sun.style.left = `40px`;
    }
    if (moon) {
      moon.style.top = `${moonTop}px`;
      moon.style.left = `calc(100vw - 160px)`;
    }

    // Sun/Moon fade and background transition
    if (scrollPercent < 0.33) {
      // Day
      document.body.classList.add('sunset-bg');
      document.body.classList.remove('night-bg', 'sunset-transition-bg');
      if (sun) sun.style.opacity = 1;
      if (moon) moon.style.opacity = 0;
    } else if (scrollPercent < 0.66) {
      // Sunset transition
      document.body.classList.add('sunset-transition-bg');
      document.body.classList.remove('sunset-bg', 'night-bg');
      // Fade both sun and moon
      const sunsetFade = 1 - Math.abs(0.5 - scrollPercent) * 6; // max at middle
      if (sun) sun.style.opacity = 1 - (scrollPercent - 0.33) * 3;
      if (moon) moon.style.opacity = (scrollPercent - 0.33) * 3;
    } else {
      // Night
      document.body.classList.add('night-bg');
      document.body.classList.remove('sunset-bg', 'sunset-transition-bg');
      if (sun) sun.style.opacity = 0;
      if (moon) moon.style.opacity = 1;
    }
  }


  const clouds = [
    document.querySelector('.cloud1'),
    document.querySelector('.cloud2'),
    document.querySelector('.cloud3')
  ];
  function scrambleClouds(scrollPercent) {
    if (!clouds[0]) return;
    clouds.forEach((cloud, i) => {
      
      const baseTop = 60 + i * 90;
      const baseLeft = 120 + i * 320;
      const top = baseTop + Math.sin(scrollPercent * 8 + i * 2) * 60 + Math.sin(Date.now()/800 + i) * 10;
      const left = baseLeft + Math.cos(scrollPercent * 10 + i * 3) * 100 + Math.cos(Date.now()/1000 + i) * 10;
      let opacity = 0.95;
      if (document.body.classList.contains('sunset-transition-bg')) opacity = 0.7;
      if (document.body.classList.contains('night-bg')) opacity = 0.3;
      cloud.style.top = `${top}px`;
      cloud.style.left = `${left}px`;
      cloud.style.opacity = opacity;
    });
  }

  window.addEventListener('scroll', updateSky);
  updateSky();
  setInterval(() => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight ? scrollY / docHeight : 0;
    scrambleClouds(scrollPercent);
  }, 500);

  // Stars
  function createStars() {
    const starContainer = document.querySelector('.pixel-stars');
    if (!starContainer) return;
    starContainer.innerHTML = '';
    const numStars = 40;
    for (let i = 0; i < numStars; i++) {
      const star = document.createElement('div');
      star.className = 'pixel-star';
      // Random position
      star.style.top = `${Math.random() * 90}vh`;
      star.style.left = `${Math.random() * 100}vw`;
      // Random animation delay and duration for glimmer
      star.style.animationDelay = `${Math.random() * 2}s`;
      star.style.animationDuration = `${1.5 + Math.random()}s`;
      starContainer.appendChild(star);
    }
  }
  createStars();
  window.addEventListener('resize', createStars);

  // About Me Chat Box logic
  const aboutMeBtn = document.getElementById('aboutMeBtn');
  const aboutMeChat = document.getElementById('aboutMeChat');
  const closeAboutMeChat = document.getElementById('closeAboutMeChat');
  const aboutMeForm = document.getElementById('aboutMeForm');
  const aboutMeInput = document.getElementById('aboutMeInput');
  const aboutMeMessages = document.getElementById('aboutMeMessages');

  if (aboutMeBtn && aboutMeChat && closeAboutMeChat) {
    aboutMeBtn.addEventListener('click', () => {
      aboutMeChat.style.display = 'block';
      aboutMeInput && aboutMeInput.focus();
    });
    closeAboutMeChat.addEventListener('click', () => {
      aboutMeChat.style.display = 'none';
    });
    window.addEventListener('click', (e) => {
      if (aboutMeChat.style.display === 'block' && !aboutMeChat.contains(e.target) && e.target !== aboutMeBtn) {
        aboutMeChat.style.display = 'none';
      }
    });
  }

  // Simple AI logic for About Me chat
  if (aboutMeForm && aboutMeInput && aboutMeMessages) {
    aboutMeForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const userMsg = aboutMeInput.value.trim();
      if (!userMsg) return;
      appendMessage('You', userMsg);
      aboutMeInput.value = '';
      setTimeout(() => {
        appendMessage('AI', getAboutMeAIResponse(userMsg));
        aboutMeMessages.scrollTop = aboutMeMessages.scrollHeight;
      }, 500);
    });

    function appendMessage(sender, text) {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'chat-bubble ' + (sender === 'You' ? 'user' : 'ai');
      msgDiv.innerHTML = text;
      aboutMeMessages.appendChild(msgDiv);
      aboutMeMessages.scrollTop = aboutMeMessages.scrollHeight;
    }

    function getAboutMeAIResponse(msg) {
      msg = msg.toLowerCase();
      if (msg.includes('name')) return "My name is Myke Franciz Jimenez.";
      if (msg.includes('github')) return 'My GitHub is <a href="https://github.com/CakeyFudo" target="_blank">CakeyFudo</a>.';
      if (msg.includes('email')) return 'You can email me at <a href="mailto:jimenezmyke189@gmail.com">jimenezmyke189@gmail.com</a>.';
      if (msg.includes('skills') || msg.includes('stack')) return "I'm skilled in HTML, CSS, JavaScript, React, Node.js, and more!";
      if (msg.includes('project')) return "One of my projects is PetCare, a web app for pet management.";
      if (msg.includes('about')) return "I'm an aspiring web developer passionate about building creative and user-friendly web experiences.";
      if (
        msg.includes('contact') ||
        msg.includes('contacts') ||
        msg.includes('how can i reach') ||
        msg.includes('how do i reach') ||
        msg.includes('reach you')
      ) {
        return `You can contact me at:<br>
          <b>Email:</b> <a href="mailto:jimenezmyke189@gmail.com">jimenezmyke189@gmail.com</a><br>
          <b>GitHub:</b> <a href="https://github.com/CakeyFudo" target="_blank">CakeyFudo</a>`;
      }
      if (msg.includes('hello') || msg.includes('hi')) return "Hello! 👋 How can I help you?";
      return "I'm Myke's AI assistant. Ask me about Myke's skills, projects, GitHub, or contact info!";
    }
  }

  // Arcade tab switching
  document.querySelectorAll('.arcade-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.arcade-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.arcade-section').forEach(s => s.classList.remove('active'));
      this.classList.add('active');
      document.getElementById(this.dataset.tab).classList.add('active');
    });
  });
});