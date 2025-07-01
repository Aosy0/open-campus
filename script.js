(() => {
  'use strict';

  // DOM要素の取得
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;
  const navContainer = document.querySelector('nav ul');
  const pages = {
    home: document.getElementById('page-home'),
    timetable: document.getElementById('page-timetable'),
    map: document.getElementById('page-map'),
    contact: document.getElementById('page-contact'),
  };
  const contactForm = document.getElementById('contact-form');

  // --- テーマ切り替え機能 ---
  const setTheme = (isDark) => {
    body.classList.toggle('dark-mode', isDark);
    themeToggleBtn.textContent = isDark ? '☀️ ライトモード' : '🌙 ダークモード';
    themeToggleBtn.setAttribute('aria-pressed', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(savedTheme === 'dark' || (!savedTheme && prefersDark));
  };

  themeToggleBtn.addEventListener('click', () => setTheme(!body.classList.contains('dark-mode')));
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches);
    }
  });

  // --- ページ切り替えアニメーション ---
  const showPageWithAnimation = (page) => {
    page.style.opacity = '0';
    page.style.transform = 'translateY(20px)';
    page.style.display = '';

    // 次のフレームでアニメーション開始
    requestAnimationFrame(() => {
      page.style.transition = 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      page.style.opacity = '1';
      page.style.transform = 'translateY(0)';
    });
  };

  // --- ナビゲーション機能 ---
  const handleNavigation = (e) => {
    const targetBtn = e.target.closest('button');
    if (!targetBtn) return;

    const targetPageId = targetBtn.id.replace('nav-', '');

    // モバイルではクリック時のアニメーションを簡略化
    const isMobile = window.innerWidth < 768;

    if (!isMobile) {
      // PC版のクリックエフェクト
      targetBtn.classList.add('clicking');
      targetBtn.style.transform = 'translateY(1px) scale(0.98)';
      setTimeout(() => {
        targetBtn.style.transform = '';
        targetBtn.classList.remove('clicking');
      }, 150);
    }

    // 全てのボタンとページを非アクティブ化
    navContainer.querySelectorAll('button').forEach(btn => {
      btn.classList.remove('active');
      btn.removeAttribute('aria-current');
      btn.blur(); // フォーカスを外す
    });

    Object.values(pages).forEach(page => page.style.display = 'none');

    // 少し遅延してからアクティブ化（アニメーション効果のため）
    const delay = isMobile ? 50 : 100;
    setTimeout(() => {
      // 対象のボタンとページをアクティブ化
      targetBtn.classList.add('active');
      targetBtn.setAttribute('aria-current', 'page');

      showPageWithAnimation(pages[targetPageId]);
    }, delay);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  navContainer.addEventListener('click', handleNavigation);

  // ナビゲーション外のクリックでフォーカスを管理
  document.addEventListener('click', (e) => {
    if (!e.target.closest('nav')) {
      // ナビゲーション外をクリックした場合、全てのナビボタンからフォーカスを外す
      navContainer.querySelectorAll('button').forEach(btn => {
        btn.blur();
      });
    }
  });

  // --- フォーム送信処理 ---
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const submitBtn = this.querySelector('button[type="submit"]');
    const thanksMessage = document.getElementById('thanks-message');

    // 簡単なバリデーション
    if (this.checkValidity() === false) {
      // モダンなブラウザはデフォルトでバリデーションUIを表示
      return;
    }

    const originalText = submitBtn.textContent;
    submitBtn.textContent = '送信中...';
    submitBtn.disabled = true;

    // 送信処理のシミュレーション
    setTimeout(() => {
      thanksMessage.style.display = 'block';
      this.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;

      setTimeout(() => {
        thanksMessage.style.display = 'none';
      }, 5000);
    }, 1500);
  });

  // --- 初期化処理 ---
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();

    // 初期状態でのナビゲーション調整
    adjustNavigationForScreenSize();

    // ページロード時のアニメーション
    const main = document.querySelector('main');
    main.style.opacity = '0';
    main.style.transform = 'translateY(30px)';
    setTimeout(() => {
      main.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      main.style.opacity = '1';
      main.style.transform = 'translateY(0)';
    }, 100);

    // 要素のフェードインアニメーション
    const elements = document.querySelectorAll('.welcome-card, .map-feature, .timetable tr');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
  });

  // --- リサイズ時のナビゲーション調整 ---
  const adjustNavigationForScreenSize = () => {
    // ボトムナビゲーション方式では特別な調整は不要
    // アクティブ状態は維持される
  };

  window.addEventListener('resize', adjustNavigationForScreenSize);
})();
