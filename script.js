(() => {
  'use strict'; // 厳格モード　ちゃんとエラー出してくれる

  // DOM要素の取得
  const body = document.body; // ページ全体のbody要素
  const navContainer = document.querySelector('nav ul'); // ナビゲーションのリスト要素
  const pages = {
    home: document.getElementById('page-home'),
    timetable: document.getElementById('page-timetable'),
    map: document.getElementById('page-map'),
    contact: document.getElementById('page-contact'),
  }; // 各ページセクションの要素を取得
  const contactForm = document.getElementById('contact-form'); // お問い合わせフォーム

  // --- ページ切り替えアニメーション ---
  const showPageWithAnimation = (page) => {
    // 最初は透明にして少し下にずらす
    page.style.opacity = '0';
    page.style.transform = 'translateY(20px)';
    page.style.display = ''; // displayをリセット

    // 次のフレームでアニメーション開始（スムーズに表示するため）
    requestAnimationFrame(() => {
      page.style.transition = 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      page.style.opacity = '1';
      page.style.transform = 'translateY(0)'; // 元の位置に戻す
    });
  };

  // --- ナビゲーション機能 ---
  const handleNavigation = (e) => {
    const targetBtn = e.target.closest('button'); // クリックされたボタン要素を取得
    const targetPageId = targetBtn.id.replace('nav-', ''); // ボタンIDからページIDを抽出

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

    Object.values(pages).forEach(page => page.style.display = 'none'); // 全ページを非表示

    // 少し遅延してからアクティブ化（アニメーション効果のため）
    const delay = isMobile ? 50 : 100;
    setTimeout(() => {
      // 対象のボタンとページをアクティブ化
      targetBtn.classList.add('active');
      targetBtn.setAttribute('aria-current', 'page'); // アクセシビリティ対応

      showPageWithAnimation(pages[targetPageId]); // ページを表示
    }, delay);

    window.scrollTo({ top: 0, behavior: 'smooth' }); // ページトップにスムーズスクロール
  };

  navContainer.addEventListener('click', handleNavigation); // ナビゲーションクリック時の処理を登録

  // ナビゲーション外のクリックでフォーカスを管理
  document.addEventListener('click', (e) => {
    if (!e.target.closest('nav')) {
      // ナビゲーション外をクリックした場合、全てのナビボタンからフォーカスを外す（キーボード操作の整理）
      navContainer.querySelectorAll('button').forEach(btn => {
        btn.blur();
      });
    }
  });



  // --- タイムライン機能 ---
  const updateTimeline = () => {
    // とりあえず現在時刻を10時45分にしておく
    const currentTime = 645; // 10:45 = 10 * 60 + 45 = 645分

    const timelineItems = document.querySelectorAll('.timeline-item'); // 全タイムラインアイテムを取得

    if (!timelineItems.length) return; // タイムラインがなければ何もしない

    let nextEventFound = false; // 次のイベントが見つかったかのフラグ

    timelineItems.forEach((item, index) => {
      const timeStr = item.dataset.time; // data-time属性から時刻文字列を取得
      const [hours, minutes] = timeStr.split(':').map(Number); // "10:00"を10と0に分割
      const eventTime = hours * 60 + minutes; // 分単位に変換

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

  // タイムラインの縦線を調整
  const adjustTimelineLine = () => {
    const timelineContainer = document.querySelector('.timeline-container');
    const timelineLine = document.querySelector('.timeline-line');

    // コンテナの高さ全体まで縦線を延ばす
    const containerHeight = timelineContainer.scrollHeight;
    timelineLine.style.height = `${containerHeight}px`;
  };

  // --- タイムライン初期化 ---
  const initTimeline = () => {
    setTimeout(() => {
      adjustTimelineLine(); // 縦線の高さを調整
      // 現在時刻のとこまでスクロール
      const timelineContainer = document.querySelector('.timeline-container');
      const currentTimeLine = timelineContainer && timelineContainer.querySelector('.timeline-current-time');
      if (timelineContainer && currentTimeLine) {
        // 現在時刻ラインのtopがコンテナのtopからどれだけ離れているか
        const offset = currentTimeLine.offsetTop;
        // 少しだけ余裕を持たせてスクロール
        timelineContainer.scrollTo({
          top: Math.max(0, offset - 20),
          behavior: 'smooth'
        });
      }
    }, 100); // DOM描画完了を待つ

    // リサイズ時に再調整（レスポンシブ対応）
    window.addEventListener('resize', adjustTimelineLine);
  };

  // 初期化
  document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    main.style.opacity = '0'; // 最初は透明
    main.style.transform = 'translateY(30px)'; // 少し下にずらす
    setTimeout(() => {
      main.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      main.style.opacity = '1'; // 表示
      main.style.transform = 'translateY(0)'; // 元の位置に
    }, 100);

    const elements = document.querySelectorAll('.welcome-card, .map-feature, .timetable tr');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 画面に入ったらアニメーション開始
          entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
          observer.unobserve(entry.target); // 一度だけ実行
        }
      });
    }, { threshold: 0.1 }); // 10%表示されたら発火

    elements.forEach(el => observer.observe(el)); // 各要素を監視対象に追加

    updateTimeline();
    initTimeline();
  });
})();
