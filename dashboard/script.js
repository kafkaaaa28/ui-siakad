// Sidebar submenu toggle
document.querySelectorAll('.has-submenu > a').forEach((item) => {
  item.addEventListener('click', function (e) {
    e.preventDefault();
    const parent = this.parentElement;
    parent.classList.toggle('active');
  });
});

// Notification badge animation
const notificationBtn = document.querySelector('.notification');
if (notificationBtn) {
  notificationBtn.addEventListener('click', function () {
    const badge = this.querySelector('.badge');
    if (badge && badge.textContent !== '0') {
      // Animate the badge
      badge.style.transform = 'scale(1.2)';
      setTimeout(() => {
        badge.style.transform = 'scale(1)';
        // Simulate marking notifications as read
        badge.textContent = '0';
        badge.style.backgroundColor = '#64748B';
      }, 200);
    }
  });
}

// Progress circle animation
function animateProgressCircles() {
  const circles = document.querySelectorAll('.circle');
  circles.forEach((circle) => {
    const percent = circle.getAttribute('data-percent');
    if (percent) {
      circle.style.background = `conic-gradient(var(--secondary) ${percent}%, #E5E7EB 0%)`;
    }
  });
}

// Filter courses by status
document.querySelectorAll('.filter-btn').forEach((btn) => {
  btn.addEventListener('click', function () {
    // Remove active class from all buttons
    document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));

    // Add active class to clicked button
    this.classList.add('active');

    const filter = this.textContent.toLowerCase();
    const rows = document.querySelectorAll('.course-table tbody tr');

    rows.forEach((row) => {
      const statusBadge = row.querySelector('.status-badge');
      const status = statusBadge ? statusBadge.textContent.toLowerCase() : '';

      if (filter === 'semua (6)' || filter === 'semua') {
        row.style.display = '';
      } else if (filter === 'on track' && status.includes('on track')) {
        row.style.display = '';
      } else if (filter === 'perhatian' && (status.includes('warning') || status.includes('at risk'))) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
});

// Schedule item click handler
document.querySelectorAll('.schedule-item').forEach((item) => {
  item.addEventListener('click', function () {
    // Toggle active state
    this.classList.toggle('active');

    // Add visual feedback
    if (this.classList.contains('active')) {
      this.style.backgroundColor = 'rgba(40, 22, 111, 0.05)';
    } else {
      this.style.backgroundColor = '';
    }
  });
});

// Quick action buttons
document.querySelectorAll('.action-btn').forEach((btn) => {
  btn.addEventListener('click', function () {
    const action = this.querySelector('span').textContent;

    // Visual feedback
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.style.transform = '';
    }, 150);

    // Simulate action
    let message = '';
    switch (action) {
      case 'Ambil KRS':
        message = 'Membuka halaman KRS...';
        break;
      case 'Unduh Transkrip':
        message = 'Mengunduh transkrip nilai...';
        break;
      case 'Cek Pembayaran':
        message = 'Membuka informasi keuangan...';
        break;
    }

    console.log(message);
    // In a real app, you would navigate or show a modal
  });
});

// User profile dropdown
const userProfile = document.querySelector('.user-profile');
if (userProfile) {
  userProfile.addEventListener('click', function () {
    // Create dropdown menu
    let dropdown = document.querySelector('.user-dropdown');

    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.className = 'user-dropdown';
      dropdown.innerHTML = `
                <div class="dropdown-item">
                    <i class="fas fa-user"></i>
                    <span>Profil Saya</span>
                </div>
                <div class="dropdown-item">
                    <i class="fas fa-cog"></i>
                    <span>Pengaturan</span>
                </div>
                <div class="dropdown-item">
                    <i class="fas fa-question-circle"></i>
                    <span>Bantuan</span>
                </div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item logout">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Keluar</span>
                </div>
            `;

      // Style the dropdown
      dropdown.style.position = 'absolute';
      dropdown.style.top = '60px';
      dropdown.style.right = '20px';
      dropdown.style.backgroundColor = 'white';
      dropdown.style.borderRadius = '12px';
      dropdown.style.boxShadow = '0px 8px 24px rgba(0, 0, 0, 0.15)';
      dropdown.style.padding = '8px 0';
      dropdown.style.minWidth = '200px';
      dropdown.style.zIndex = '1000';

      document.body.appendChild(dropdown);

      // Add event listeners to dropdown items
      dropdown.querySelectorAll('.dropdown-item').forEach((item) => {
        item.addEventListener('click', function () {
          if (this.classList.contains('logout')) {
            alert('Anda telah keluar dari sistem');
            // In real app: window.location.href = '/logout';
          } else {
            console.log('Clicked:', this.querySelector('span').textContent);
          }
          document.body.removeChild(dropdown);
        });
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', function closeDropdown(e) {
        if (!userProfile.contains(e.target) && !dropdown.contains(e.target)) {
          document.body.removeChild(dropdown);
          document.removeEventListener('click', closeDropdown);
        }
      });
    } else {
      document.body.removeChild(dropdown);
    }
  });
}

// Simulate real-time updates
function updateDashboardData() {
  // Update time in schedule card
  const now = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const dateString = now.toLocaleDateString('id-ID', options);

  const scheduleTitle = document.querySelector('.schedule-card .card-header h3');
  if (scheduleTitle) {
    scheduleTitle.innerHTML = `<i class="fas fa-calendar-day"></i> Jadwal Hari Ini - ${dateString}`;
  }

  // Randomly update one of the schedule statuses (for demo)
  const scheduleItems = document.querySelectorAll('.schedule-item');
  if (scheduleItems.length > 0) {
    const randomIndex = Math.floor(Math.random() * scheduleItems.length);
    const statusSpan = scheduleItems[randomIndex].querySelector('.schedule-status');

    if (statusSpan && Math.random() > 0.7) {
      // 30% chance to change
      const statuses = ['ongoing', 'upcoming', 'completed'];
      const currentStatus = statusSpan.className.split(' ')[1];
      let newStatus = statuses[Math.floor(Math.random() * statuses.length)];

      // Make sure we don't pick the same status
      while (newStatus === currentStatus) {
        newStatus = statuses[Math.floor(Math.random() * statuses.length)];
      }

      // Update classes
      statusSpan.className = 'schedule-status';
      statusSpan.classList.add(newStatus);

      // Update text
      const statusText = {
        ongoing: 'Berlangsung',
        upcoming: 'Selanjutnya',
        completed: 'Selesai',
      };
      statusSpan.textContent = statusText[newStatus];
    }
  }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function () {
  animateProgressCircles();

  // Update dashboard every 30 seconds
  setInterval(updateDashboardData, 30000);

  // Add hover effects to cards
  const cards = document.querySelectorAll('.card');
  cards.forEach((card) => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-4px)';
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)';
    });
  });

  // Table row click handler
  const tableRows = document.querySelectorAll('.course-table tbody tr');
  tableRows.forEach((row) => {
    row.addEventListener('click', function (e) {
      if (!e.target.closest('.table-btn')) {
        this.classList.toggle('selected');
      }
    });
  });

  console.log('Dashboard Siakad loaded successfully!');
});
