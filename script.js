(() => {
  'use strict'; //厳格モード　ちゃんとエラー出してくれる

  // DOM要素の取得
  const body = document.body;
  const navContainer = document.querySelector('nav ul');
  const pages = {
    home: document.getElementById('page-home'),
    timetable: document.getElementById('page-timetable'),
    map: document.getElementById('page-map'),
    contact: document.getElementById('page-contact'),
  };
  const contactForm = document.getElementById('contact-form');

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



  // --- タイムライン機能 ---
  const updateTimeline = () => {
    // とりあえず現在時刻を10時にしておく
    const currentTime = 600; // 10:00 = 10 * 60 + 0 = 600分

    const timelineItems = document.querySelectorAll('.timeline-item');

    if (!timelineItems.length) return;

    let nextEventFound = false;

    timelineItems.forEach((item, index) => {
      const timeStr = item.dataset.time;
      const [hours, minutes] = timeStr.split(':').map(Number);
      const eventTime = hours * 60 + minutes;

      // 各アイテムの状態をリセット
      item.classList.remove('completed', 'next');

      if (eventTime <= currentTime) {
        // 終了したイベント
        item.classList.add('completed');
      } else if (!nextEventFound) {
        // 次のイベント
        item.classList.add('next');
        nextEventFound = true;
      }
    });
  };

  // --- タイムラインの縦線調整機能 ---
  const adjustTimelineLine = () => {
    const timelineContainer = document.querySelector('.timeline-container');
    const timelineLine = document.querySelector('.timeline-line');

    if (!timelineContainer || !timelineLine) return;

    // コンテナの高さ全体まで縦線を延ばす
    const containerHeight = timelineContainer.scrollHeight;
    timelineLine.style.height = `${containerHeight}px`;
  };

  // --- タイムライン初期化 ---
  const initTimeline = () => {
    setTimeout(() => {
      adjustTimelineLine();
      // 次のイベントをタイムライン枠内だけスクロール
      const timelineContainer = document.querySelector('.timeline-container');
      const nextItem = timelineContainer && timelineContainer.querySelector('.timeline-item.next');
      if (timelineContainer && nextItem) {
        const offset = nextItem.offsetTop;
        const scrollTarget = offset - timelineContainer.clientHeight / 3;
        timelineContainer.scrollTo({
          top: Math.max(0, scrollTarget),
          behavior: 'smooth'
        });
      }
    }, 100);

    // リサイズ時に再調整
    window.addEventListener('resize', adjustTimelineLine);
  };

  // --- リサイズ時のナビゲーション調整 ---
  const adjustNavigationForScreenSize = () => {
  };

  window.addEventListener('resize', adjustNavigationForScreenSize);

  // 初期化
  document.addEventListener('DOMContentLoaded', () => {
    //initTimeline(); // タイムライン初期化を追加

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

    updateTimeline();
    initTimeline();

  });
})();
