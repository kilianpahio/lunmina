// LUMARA - JavaScript

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Fade-in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-answer').style.maxHeight = '0';
    });

    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// Contact form validation
const form = document.getElementById('contactForm');

const rules = {
  name: { validate: v => v.trim().length >= 2, message: 'Veuillez entrer votre nom (2 caractères minimum).' },
  email: { validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Adresse email invalide.' },
  project: { validate: v => v !== '', message: 'Veuillez choisir une formule.' },
  message: { validate: v => v.trim().length >= 10, message: 'Décrivez votre activité (10 caractères minimum).' }
};

function validateField(id) {
  const input = document.getElementById(id);
  const error = document.getElementById(id + 'Error');
  const rule = rules[id];
  if (!rule) return true;

  const valid = rule.validate(input.value);
  error.textContent = valid ? '' : rule.message;
  input.classList.toggle('error', !valid);
  return valid;
}

Object.keys(rules).forEach(id => {
  const input = document.getElementById(id);
  if (input) input.addEventListener('blur', () => validateField(id));
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const valid = Object.keys(rules).map(validateField).every(Boolean);
  if (!valid) return;

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.querySelector('.btn-text').textContent = 'Envoi en cours...';

  setTimeout(() => {
    form.reset();
    btn.disabled = false;
    btn.querySelector('.btn-text').textContent = 'Envoyer ma demande';
    document.getElementById('formSuccess').style.display = 'block';
    setTimeout(() => {
      document.getElementById('formSuccess').style.display = 'none';
    }, 5000);
  }, 1200);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});
