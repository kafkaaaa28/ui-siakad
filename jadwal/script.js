// ============================================
// SCHEDULE PAGE - JAVASCRIPT
// ============================================

// Tab Switching Functionality
document.addEventListener('DOMContentLoaded', function () {
  // Initialize all tabs
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach((tab) => {
    tab.addEventListener('click', function () {
      const tabId = this.getAttribute('data-tab');

      // Remove active class from all tabs
      tabs.forEach((t) => t.classList.remove('active'));

      // Add active class to clicked tab
      this.classList.add('active');

      // Hide all tab contents
      tabContents.forEach((content) => {
        content.classList.remove('active');
      });

      // Show selected tab content
      document.getElementById(`${tabId}-content`).classList.add('active');

      // Reset to weekly view when switching to kuliah tab
      if (tabId === 'kuliah') {
        switchView('week');
      }
    });
  });

  // View Toggle Functionality
  const viewButtons = document.querySelectorAll('.view-btn');
  const viewContents = document.querySelectorAll('.view-content');

  viewButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const view = this.getAttribute('data-view');

      // Remove active class from all view buttons
      viewButtons.forEach((btn) => btn.classList.remove('active'));

      // Add active class to clicked button
      this.classList.add('active');

      // Switch view
      switchView(view);
    });
  });

  function switchView(view) {
    // Hide all view contents
    viewContents.forEach((content) => {
      content.classList.remove('active');
    });

    // Show selected view
    document.getElementById(`${view}-view`).classList.add('active');
  }

  // Week Navigation
  let currentWeek = 12; // Start at week 12 (Jan 15-21, 2025)

  document.getElementById('prev-week').addEventListener('click', function () {
    currentWeek--;
    updateWeekDisplay();
  });

  document.getElementById('next-week').addEventListener('click', function () {
    currentWeek++;
    updateWeekDisplay();
  });

  document.getElementById('today-btn').addEventListener('click', function () {
    currentWeek = 12; // Reset to current week
    updateWeekDisplay();
  });

  function updateWeekDisplay() {
    const weekDisplay = document.getElementById('current-week');

    // Calculate dates for the week
    const baseDate = new Date(2025, 0, 15); // Jan 15, 2025
    const weekOffset = (currentWeek - 12) * 7;
    const startDate = new Date(baseDate);
    startDate.setDate(startDate.getDate() + weekOffset);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    // Format dates
    const startStr = startDate.toLocaleDateString('id-ID', { day: 'numeric' });
    const endStr = endDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    // Update display
    weekDisplay.textContent = `Minggu ${currentWeek}, ${startStr}-${endStr}`;

    // Update calendar events for the week
    updateCalendarEvents(startDate);
  }

  // Update calendar events based on week
  function updateCalendarEvents(startDate) {
    // In a real app, this would fetch events from an API
    // For demo, we'll just update some visual indicators

    const events = document.querySelectorAll('.event-card');
    events.forEach((event) => {
      // Add subtle animation to show update
      event.style.transform = 'scale(0.98)';
      setTimeout(() => {
        event.style.transform = '';
      }, 200);
    });
  }

  // Update countdown timers
  function updateCountdowns() {
    // UTS Countdown (March 10, 2025)
    const utsDate = new Date('2025-03-10');
    const today = new Date();
    const utsDiff = utsDate - today;
    const utsDays = Math.ceil(utsDiff / (1000 * 60 * 60 * 24));

    const utsDaysElement = document.getElementById('uts-days');
    if (utsDaysElement) {
      utsDaysElement.textContent = utsDays;

      // Update color based on urgency
      if (utsDays <= 7) {
        utsDaysElement.style.color = 'var(--danger)';
      } else if (utsDays <= 14) {
        utsDaysElement.style.color = 'var(--warning)';
      } else {
        utsDaysElement.style.color = 'var(--success)';
      }
    }

    // UAS Countdown (June 2, 2025)
    const uasDate = new Date('2025-06-02');
    const uasDiff = uasDate - today;
    const uasDays = Math.ceil(uasDiff / (1000 * 60 * 60 * 24));

    const uasDaysElement = document.getElementById('uas-days');
    if (uasDaysElement) {
      uasDaysElement.textContent = uasDays;

      // Update color based on urgency
      if (uasDays <= 30) {
        uasDaysElement.style.color = 'var(--warning)';
      } else {
        uasDaysElement.style.color = 'var(--success)';
      }
    }
  }

  // Event card interactions
  const eventCards = document.querySelectorAll('.event-card');
  eventCards.forEach((card) => {
    card.addEventListener('click', function () {
      // Add visual feedback
      this.style.transform = 'scale(0.98)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);

      // Show event details (in a real app, this would open a modal)
      const eventTitle = this.querySelector('.event-title').textContent;
      const eventTime = this.querySelector('.event-time').textContent;
      const eventLocation = this.querySelector('.event-location').textContent;

      alert(`Detail Jadwal:\n\n${eventTitle}\n${eventTime}\n${eventLocation}\n\nKlik "OK" untuk menutup.`);
    });

    // Hover effects
    card.addEventListener('mouseenter', function () {
      this.style.zIndex = '100';
    });

    card.addEventListener('mouseleave', function () {
      this.style.zIndex = '1';
    });
  });

  // Exam card interactions
  const examCards = document.querySelectorAll('.exam-card');
  examCards.forEach((card) => {
    card.addEventListener('click', function () {
      const examTitle = this.querySelector('h4').textContent;
      const examTime = this.querySelector('.exam-time').textContent;

      // Show exam details
      alert(`Detail Ujian:\n\n${examTitle}\n${examTime}\n\nKlik "OK" untuk menutup.`);
    });
  });

  // Print functionality
  document.getElementById('print-btn').addEventListener('click', function () {
    // Get current tab
    const activeTab = document.querySelector('.tab.active').getAttribute('data-tab');
    const activeView = document.querySelector('.view-btn.active').getAttribute('data-view');

    alert(`Mencetak jadwal ${activeTab.toUpperCase()} (${activeView} view)...\n\nBuka developer console (F12) untuk melihat preview.`);

    // In a real app, you would use:
    // window.print();

    // For demo, just log to console
    console.log(`Printing: ${activeTab} - ${activeView} view`);
  });

  // Export functionality
  document.getElementById('export-btn').addEventListener('click', function () {
    const activeTab = document.querySelector('.tab.active').getAttribute('data-tab');

    // Show export options
    const format = prompt(`Ekspor jadwal ${activeTab.toUpperCase()} sebagai:\n\n1. PDF\n2. Excel\n3. Kalender (ICS)\n\nMasukkan angka pilihan (1-3):`);

    if (format) {
      let formatName = '';
      switch (format) {
        case '1':
          formatName = 'PDF';
          break;
        case '2':
          formatName = 'Excel';
          break;
        case '3':
          formatName = 'Kalender (ICS)';
          break;
        default:
          formatName = 'PDF';
      }

      alert(`Mengekspor jadwal sebagai ${formatName}...\n\nFile akan diunduh otomatis.`);

      // In a real app, this would trigger file download
      console.log(`Exporting ${activeTab} as ${formatName}`);

      // Simulate download
      setTimeout(() => {
        alert(`Jadwal ${activeTab.toUpperCase()} berhasil diekspor sebagai ${formatName}!`);
      }, 1000);
    }
  });

  // Semester selector change
  document.getElementById('semester-select').addEventListener('change', function () {
    const selectedSemester = this.value;
    alert(`Memuat jadwal untuk: ${selectedSemester}`);

    // In a real app, this would fetch data for the selected semester
    console.log(`Loading schedule for: ${selectedSemester}`);

    // Update UI to show loading state
    const loadingText = document.createElement('div');
    loadingText.className = 'loading-text';
    loadingText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memuat jadwal...';
    loadingText.style.textAlign = 'center';
    loadingText.style.padding = '20px';
    loadingText.style.color = 'var(--text-secondary)';

    // Add loading indicator
    const tabContent = document.querySelector('.tab-content.active');
    const oldContent = tabContent.innerHTML;
    tabContent.innerHTML = '';
    tabContent.appendChild(loadingText);

    // Simulate API call delay
    setTimeout(() => {
      tabContent.innerHTML = oldContent;
      alert(`Jadwal ${selectedSemester} berhasil dimuat!`);

      // Re-attach event listeners for the new content
      initializeEventListeners();
    }, 1500);
  });

  // Initialize event listeners for dynamic content
  function initializeEventListeners() {
    // Re-attach event listeners for event cards
    const newEventCards = document.querySelectorAll('.event-card');
    newEventCards.forEach((card) => {
      card.addEventListener('click', function () {
        const eventTitle = this.querySelector('.event-title').textContent;
        alert(`Detail: ${eventTitle}`);
      });
    });

    // Re-attach event listeners for exam cards
    const newExamCards = document.querySelectorAll('.exam-card');
    newExamCards.forEach((card) => {
      card.addEventListener('click', function () {
        const examTitle = this.querySelector('h4').textContent;
        alert(`Detail Ujian: ${examTitle}`);
      });
    });
  }

  // Current time indicator for weekly view
  function updateCurrentTimeIndicator() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Only show if within calendar hours (7-17)
    if (currentHour >= 7 && currentHour <= 17) {
      // Calculate position (7:00 = 0%, 17:00 = 100%)
      const hourPosition = ((currentHour - 7 + currentMinute / 60) / 10) * 100;

      // Create or update indicator
      let indicator = document.querySelector('.time-indicator');
      if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'time-indicator';
        indicator.style.cssText = `
                    position: absolute;
                    left: 100px;
                    right: 0;
                    height: 2px;
                    background-color: var(--danger);
                    z-index: 50;
                    pointer-events: none;
                `;
        document.querySelector('.calendar').appendChild(indicator);
      }

      indicator.style.top = `calc(${hourPosition}% + 40px)`;
    }
  }

  // Add CSS for time indicator
  const style = document.createElement('style');
  style.textContent = `
        .time-indicator::before {
            content: '';
            position: absolute;
            top: -4px;
            left: -6px;
            width: 10px;
            height: 10px;
            background-color: var(--danger);
            border-radius: 50%;
        }
        
        .time-indicator::after {
            content: 'Sekarang';
            position: absolute;
            top: -30px;
            left: 10px;
            background-color: var(--danger);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            white-space: nowrap;
        }
    `;
  document.head.appendChild(style);

  // Initialize everything
  updateWeekDisplay();
  updateCountdowns();
  updateCurrentTimeIndicator();

  // Update countdowns every hour
  setInterval(updateCountdowns, 3600000);

  // Update time indicator every minute
  setInterval(updateCurrentTimeIndicator, 60000);

  // Add keyboard shortcuts
  document.addEventListener('keydown', function (e) {
    // Ctrl+P for print
    if (e.ctrlKey && e.key === 'p') {
      e.preventDefault();
      document.getElementById('print-btn').click();
    }

    // Ctrl+E for export
    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      document.getElementById('export-btn').click();
    }

    // Arrow keys for week navigation
    if (e.key === 'ArrowLeft') {
      document.getElementById('prev-week').click();
    }

    if (e.key === 'ArrowRight') {
      document.getElementById('next-week').click();
    }

    // Numbers 1-3 for view switching
    if (e.key >= '1' && e.key <= '3') {
      const viewIndex = parseInt(e.key) - 1;
      const viewButtons = document.querySelectorAll('.view-btn');
      if (viewButtons[viewIndex]) {
        viewButtons[viewIndex].click();
      }
    }

    // Tab keys 1-3 for tab switching
    if (e.altKey && e.key >= '1' && e.key <= '3') {
      const tabIndex = parseInt(e.key) - 1;
      const tabs = document.querySelectorAll('.tab');
      if (tabs[tabIndex]) {
        tabs[tabIndex].click();
      }
    }
  });

  console.log('Schedule page initialized successfully!');

  // Add loading animation for better UX
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s ease';

  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});
