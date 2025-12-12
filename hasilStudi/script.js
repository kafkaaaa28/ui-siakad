// ============================================
// HASIL STUDI PAGE - JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function () {
  // Initialize all functionality
  initTabs();
  initFilters();
  initScoreCalculators();
  initModals();
  initAttendanceCalendar();
  initTranscriptActions();
  initProgressViews();

  console.log('Hasil Studi page initialized successfully!');

  // Add smooth loading
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s ease';

  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

// Tab Switching
function initTabs() {
  const tabs = document.querySelectorAll('.study-tab');
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
    });
  });
}

// Filter Functionality
function initFilters() {
  // Grade filters
  const semesterFilter = document.getElementById('semester-filter');
  const typeFilter = document.getElementById('type-filter');

  if (semesterFilter) {
    semesterFilter.addEventListener('change', function () {
      const semester = this.value;
      filterGrades(semester, typeFilter ? typeFilter.value : 'all');
    });
  }

  if (typeFilter) {
    typeFilter.addEventListener('change', function () {
      const type = this.value;
      filterGrades(semesterFilter ? semesterFilter.value : '6', type);
    });
  }

  // KHS semester selector
  const khsSemester = document.getElementById('khs-semester');
  if (khsSemester) {
    khsSemester.addEventListener('change', function () {
      loadKHS(this.value);
    });
  }

  // Attendance filters
  const presensiMonth = document.getElementById('presensi-month');
  const presensiCourse = document.getElementById('presensi-course');

  if (presensiMonth) {
    presensiMonth.addEventListener('change', function () {
      filterAttendance(this.value, presensiCourse ? presensiCourse.value : 'all');
    });
  }

  if (presensiCourse) {
    presensiCourse.addEventListener('change', function () {
      filterAttendance(presensiMonth ? presensiMonth.value : '1', this.value);
    });
  }
}

function filterGrades(semester, type) {
  console.log(`Filtering grades - Semester: ${semester}, Type: ${type}`);

  // In a real app, this would fetch filtered data from API
  // For demo, we'll just show a loading message
  const gradeTables = document.querySelectorAll('.grades-table');

  if (semester !== '6' || type !== 'all') {
    gradeTables.forEach((table) => {
      const tbody = table.querySelector('tbody');
      const originalContent = tbody.innerHTML;

      // Show loading
      tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px;">
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
                            <div class="spinner"></div>
                            <span style="color: var(--text-secondary);">Memuat data...</span>
                        </div>
                    </td>
                </tr>
            `;

      // Add spinner CSS
      const style = document.createElement('style');
      style.textContent = `
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid var(--light);
                    border-top-color: var(--primary);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
      document.head.appendChild(style);

      // Simulate API call
      setTimeout(() => {
        tbody.innerHTML = originalContent;
        showNotification(`Data semester ${semester} (${type}) berhasil dimuat`, 'success');
      }, 1000);
    });
  }
}

function filterAttendance(month, course) {
  console.log(`Filtering attendance - Month: ${month}, Course: ${course}`);

  // Update calendar based on month
  updateAttendanceCalendar(month);

  // Update course attendance based on filter
  updateCourseAttendance(course);
}

function updateAttendanceCalendar(month) {
  const calendarTitle = document.querySelector('.attendance-calendar h3');
  const monthNames = {
    1: 'Januari 2025',
    2: 'Februari 2025',
    3: 'Maret 2025',
    4: 'April 2025',
  };

  if (calendarTitle) {
    calendarTitle.innerHTML = `<i class="fas fa-calendar-alt"></i> Kalender Kehadiran - ${monthNames[month] || 'Januari 2025'}`;
  }

  // Update overview period
  const overviewPeriod = document.querySelector('.overview-period');
  if (overviewPeriod) {
    overviewPeriod.textContent = monthNames[month] || 'Januari 2025';
  }
}

function updateCourseAttendance(course) {
  const attendanceCards = document.querySelectorAll('.attendance-card');

  attendanceCards.forEach((card) => {
    const courseName = card.querySelector('h4').textContent;
    const courseCode = getCourseCode(courseName);

    if (course === 'all' || course === courseCode) {
      card.style.display = 'block';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100);
    } else {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.display = 'none';
      }, 300);
    }
  });
}

function getCourseCode(courseName) {
  const courseMap = {
    'Basis Data': 'TI301',
    'Web Development': 'TI302',
    'UI/UX Design': 'TI303',
    'Mobile Programming': 'TI304',
  };

  return courseMap[courseName] || '';
}

// Score Calculators
function initScoreCalculators() {
  // GPA Calculator
  const calculateBtn = document.querySelector('.calculate-btn');
  if (calculateBtn) {
    calculateBtn.addEventListener('click', calculateRequiredGPA);
  }

  // Auto-calculate on input change
  const targetGPAInput = document.getElementById('target-ipk');
  if (targetGPAInput) {
    targetGPAInput.addEventListener('input', calculateRequiredGPA);
  }

  // Initialize grade distribution animation
  animateGradeDistribution();
}

function calculateRequiredGPA() {
  const targetGPA = parseFloat(document.getElementById('target-ipk').value) || 3.8;
  const currentGPA = 3.68; // Fixed for demo
  const totalCredits = 144;
  const remainingCredits = 24; // 6 semesters * average 4 courses * 3 SKS

  // Calculate required GPA for remaining credits
  const requiredTotal = targetGPA * (totalCredits + remainingCredits);
  const currentTotal = currentGPA * totalCredits;
  const requiredRemaining = requiredTotal - currentTotal;
  const requiredGPA = requiredRemaining / remainingCredits;

  // Update result
  const resultElement = document.querySelector('.result-value');
  if (resultElement) {
    resultElement.textContent = requiredGPA.toFixed(2);

    // Color code based on difficulty
    if (requiredGPA <= 3.0) {
      resultElement.className = 'result-value success';
    } else if (requiredGPA <= 3.5) {
      resultElement.className = 'result-value warning';
    } else {
      resultElement.className = 'result-value danger';
    }
  }

  // Update progress bar
  const progressFill = document.querySelector('.target-progress .progress-fill');
  if (progressFill) {
    const progressPercent = (currentGPA / targetGPA) * 100;
    progressFill.style.width = `${Math.min(progressPercent, 100)}%`;

    // Update progress text
    const progressText = document.querySelector('.target-progress .progress-header span:last-child');
    if (progressText) {
      progressText.textContent = `${Math.round(progressPercent)}%`;
    }
  }
}

function animateGradeDistribution() {
  const gradeBars = document.querySelectorAll('.grade-bar');

  gradeBars.forEach((bar, index) => {
    // Reset width to 0 for animation
    const originalWidth = bar.style.getPropertyValue('--percentage');
    bar.style.setProperty('--percentage', '0%');

    // Animate after delay
    setTimeout(() => {
      bar.style.setProperty('--percentage', originalWidth);
    }, index * 300);
  });
}

// Modal Functions
function initModals() {
  const gradeModal = document.getElementById('grade-modal');
  const closeButtons = document.querySelectorAll('.close-modal');

  // Close modal when clicking close button
  closeButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const modal = this.closest('.modal');
      modal.classList.remove('active');
    });
  });

  // Close modal when clicking outside
  window.addEventListener('click', function (event) {
    if (event.target.classList.contains('modal')) {
      event.target.classList.remove('active');
    }
  });

  // Grade detail buttons
  const detailButtons = document.querySelectorAll('.action-btn[data-course]');
  detailButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const courseCode = this.getAttribute('data-course');
      showGradeDetails(courseCode);
    });
  });

  // Export buttons
  const exportButtons = document.querySelectorAll('.export-btn');
  exportButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const buttonText = this.textContent.trim();
      handleExport(buttonText);
    });
  });
}

function showGradeDetails(courseCode) {
  const modal = document.getElementById('grade-modal');
  const modalContent = document.getElementById('grade-content');

  // Mock course data
  const courses = {
    TI301: {
      name: 'Basis Data',
      code: 'TI301',
      credits: '3 SKS',
      lecturer: 'Dr. Budi Santoso',
      uts: { score: 85, weight: '30%', grade: 'A' },
      uas: { score: 88, weight: '40%', grade: 'A' },
      tugas: { score: 85, weight: '30%', grade: 'A' },
      final: { grade: 'A', points: 4.0 },
      trend: 'Stable',
      rank: 'Top 20%',
    },
    TI302: {
      name: 'Web Development',
      code: 'TI302',
      credits: '3 SKS',
      lecturer: 'Prof. Ani Wijaya',
      uts: { score: 78, weight: '30%', grade: 'B' },
      uas: { score: 82, weight: '40%', grade: 'B+' },
      tugas: { score: 80, weight: '30%', grade: 'B' },
      final: { grade: 'B+', points: 3.3 },
      trend: 'Improving',
      rank: 'Top 40%',
    },
    TI303: {
      name: 'UI/UX Design',
      code: 'TI303',
      credits: '3 SKS',
      lecturer: 'Prof. Sari Dewi',
      uts: { score: 92, weight: '30%', grade: 'A' },
      uas: { score: 90, weight: '40%', grade: 'A' },
      tugas: { score: 90, weight: '30%', grade: 'A' },
      final: { grade: 'A', points: 4.0 },
      trend: 'Excellent',
      rank: 'Top 10%',
    },
    TI304: {
      name: 'Mobile Programming',
      code: 'TI304',
      credits: '3 SKS',
      lecturer: 'Dr. Ahmad Fauzi',
      uts: { score: 65, weight: '30%', grade: 'C' },
      uas: { score: 70, weight: '40%', grade: 'C+' },
      tugas: { score: 65, weight: '30%', grade: 'C' },
      final: { grade: 'C+', points: 2.3 },
      trend: 'Needs Improvement',
      rank: 'Bottom 30%',
    },
  };

  const course = courses[courseCode] || courses['TI301'];

  // Populate modal content
  modalContent.innerHTML = `
        <div class="grade-detail">
            <div class="course-header">
                <h4>${course.name} (${course.code})</h4>
                <div class="course-meta">
                    <span>${course.credits}</span>
                    <span>•</span>
                    <span>Dosen: ${course.lecturer}</span>
                </div>
            </div>
            
            <div class="grade-breakdown">
                <h5><i class="fas fa-chart-pie"></i> Breakdown Nilai</h5>
                <div class="breakdown-grid">
                    <div class="breakdown-item">
                        <span class="breakdown-label">UTS</span>
                        <div class="breakdown-value">
                            <span class="score">${course.uts.score}</span>
                            <span class="weight">(${course.uts.weight})</span>
                        </div>
                        <span class="grade-badge small ${course.uts.grade}">${course.uts.grade}</span>
                    </div>
                    
                    <div class="breakdown-item">
                        <span class="breakdown-label">UAS</span>
                        <div class="breakdown-value">
                            <span class="score">${course.uas.score}</span>
                            <span class="weight">(${course.uas.weight})</span>
                        </div>
                        <span class="grade-badge small ${course.uas.grade}">${course.uas.grade}</span>
                    </div>
                    
                    <div class="breakdown-item">
                        <span class="breakdown-label">Tugas</span>
                        <div class="breakdown-value">
                            <span class="score">${course.tugas.score}</span>
                            <span class="weight">(${course.tugas.weight})</span>
                        </div>
                        <span class="grade-badge small ${course.tugas.grade}">${course.tugas.grade}</span>
                    </div>
                </div>
            </div>
            
            <div class="grade-summary">
                <div class="summary-item">
                    <span class="summary-label">Nilai Akhir:</span>
                    <div class="summary-value">
                        <span class="final-grade ${course.final.grade}">${course.final.grade}</span>
                        <span class="final-points">(${course.final.points})</span>
                    </div>
                </div>
                
                <div class="summary-item">
                    <span class="summary-label">Trend:</span>
                    <span class="summary-value ${getTrendClass(course.trend)}">${course.trend}</span>
                </div>
                
                <div class="summary-item">
                    <span class="summary-label">Ranking Kelas:</span>
                    <span class="summary-value">${course.rank}</span>
                </div>
            </div>
            
            <div class="grade-chart">
                <h5><i class="fas fa-chart-line"></i> Progress Nilai</h5>
                <div class="chart-placeholder">
                    <div class="chart-line">
                        <div class="chart-point" style="left: 20%;" data-value="65" data-label="Tugas"></div>
                        <div class="chart-point" style="left: 50%;" data-value="${course.uts.score}" data-label="UTS"></div>
                        <div class="chart-point" style="left: 80%;" data-value="${course.uas.score}" data-label="UAS"></div>
                    </div>
                    <div class="chart-axis">
                        <div class="axis-label">Tugas</div>
                        <div class="axis-label">UTS</div>
                        <div class="axis-label">UAS</div>
                    </div>
                </div>
            </div>
            
            <div class="grade-actions">
                <button class="action-btn" onclick="downloadGradeReport('${courseCode}')">
                    <i class="fas fa-download"></i> Download Report
                </button>
                <button class="action-btn" onclick="showGradeAnalysis('${courseCode}')">
                    <i class="fas fa-chart-bar"></i> Lihat Analisis
                </button>
            </div>
        </div>
    `;

  // Add CSS for grade detail
  const style = document.createElement('style');
  style.textContent = `
        .grade-detail {
            padding: 20px;
        }
        
        .course-header {
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--border);
        }
        
        .course-header h4 {
            font-size: 24px;
            color: var(--dark);
            margin-bottom: 8px;
        }
        
        .course-meta {
            display: flex;
            gap: 12px;
            color: var(--text-secondary);
            font-size: 14px;
        }
        
        .grade-breakdown {
            margin-bottom: 24px;
        }
        
        .grade-breakdown h5 {
            font-size: 16px;
            color: var(--dark);
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .breakdown-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
        }
        
        .breakdown-item {
            background-color: var(--light);
            border-radius: var(--radius);
            padding: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        }
        
        .breakdown-label {
            font-size: 14px;
            color: var(--text-secondary);
        }
        
        .breakdown-value {
            display: flex;
            align-items: baseline;
            gap: 4px;
        }
        
        .breakdown-value .score {
            font-size: 24px;
            font-weight: 700;
            color: var(--dark);
        }
        
        .breakdown-value .weight {
            font-size: 14px;
            color: var(--text-secondary);
        }
        
        .grade-badge.small {
            width: 24px;
            height: 24px;
            line-height: 24px;
            font-size: 12px;
        }
        
        .grade-summary {
            background-color: var(--light);
            border-radius: var(--radius);
            padding: 20px;
            margin-bottom: 24px;
        }
        
        .summary-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid var(--border);
        }
        
        .summary-item:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }
        
        .summary-label {
            font-size: 14px;
            color: var(--text-secondary);
        }
        
        .summary-value {
            font-weight: 600;
            color: var(--dark);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .final-grade {
            font-size: 20px;
            font-weight: 700;
        }
        
        .final-grade.A, .final-grade.B, .final-grade.C {
            padding: 4px 12px;
            border-radius: 20px;
            color: white;
        }
        
        .final-grade.A { background-color: var(--grade-a); }
        .final-grade.B { background-color: var(--grade-b); }
        .final-grade.C { background-color: var(--grade-c); }
        
        .final-points {
            font-size: 14px;
            color: var(--text-secondary);
        }
        
        .grade-chart {
            margin-bottom: 24px;
        }
        
        .grade-chart h5 {
            font-size: 16px;
            color: var(--dark);
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .chart-placeholder {
            height: 200px;
            background-color: var(--light);
            border-radius: var(--radius);
            position: relative;
            padding: 20px;
        }
        
        .chart-line {
            height: 2px;
            background-color: var(--primary);
            position: relative;
            margin-top: 100px;
        }
        
        .chart-point {
            position: absolute;
            width: 16px;
            height: 16px;
            background-color: var(--primary);
            border-radius: 50%;
            border: 3px solid white;
            transform: translate(-50%, -50%);
            cursor: pointer;
        }
        
        .chart-point::after {
            content: attr(data-value);
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--dark);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            white-space: nowrap;
        }
        
        .chart-point::before {
            content: attr(data-label);
            position: absolute;
            bottom: -25px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 12px;
            color: var(--text-secondary);
        }
        
        .chart-axis {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
        }
        
        .axis-label {
            font-size: 12px;
            color: var(--text-secondary);
        }
        
        .grade-actions {
            display: flex;
            gap: 12px;
        }
        
        .grade-actions .action-btn {
            flex: 1;
            justify-content: center;
        }
    `;

  // Remove existing style if any
  const existingStyle = document.querySelector('#grade-detail-style');
  if (existingStyle) existingStyle.remove();

  style.id = 'grade-detail-style';
  document.head.appendChild(style);

  // Show modal
  modal.classList.add('active');
}

function getTrendClass(trend) {
  const trendClasses = {
    Stable: 'info',
    Improving: 'success',
    Excellent: 'success',
    'Needs Improvement': 'warning',
    Declining: 'danger',
  };

  return trendClasses[trend] || 'info';
}

function handleExport(action) {
  let message = '';

  switch (action) {
    case 'Export PDF':
      message = 'Mengekspor nilai ke PDF...';
      break;
    case 'Cetak KHS':
      message = 'Mencetak Kartu Hasil Studi...';
      break;
    case 'Download PDF':
      message = 'Mengunduh transkrip nilai...';
      break;
    case 'Export Data':
      message = 'Mengekspor data presensi...';
      break;
    case 'Cetak Transkrip':
      message = 'Mencetak transkrip nilai...';
      break;
    case 'Verifikasi Legal':
      message = 'Memverifikasi legalitas transkrip...';
      break;
    default:
      message = 'Memproses ekspor...';
  }

  showNotification(message, 'info');

  // Simulate export process
  setTimeout(() => {
    showNotification('Ekspor berhasil! File telah siap diunduh.', 'success');
  }, 1500);
}

// Attendance Calendar
function initAttendanceCalendar() {
  const calendarDays = document.querySelectorAll('.calendar-body .day');

  calendarDays.forEach((day) => {
    const dayStatus = day.querySelector('.day-status');
    if (dayStatus && !dayStatus.classList.contains('holiday') && !dayStatus.classList.contains('future')) {
      day.addEventListener('click', function () {
        const dayNumber = this.querySelector('.day-number').textContent;
        const status = dayStatus.textContent;
        const statusText = getAttendanceStatusText(status);

        showAttendanceDetail(dayNumber, statusText);
      });
    }
  });
}

function getAttendanceStatusText(status) {
  const statusMap = {
    H: 'Hadir',
    I: 'Izin',
    S: 'Sakit',
    A: 'Alpha',
  };

  return statusMap[status] || 'Tidak ada kelas';
}

function showAttendanceDetail(dayNumber, status) {
  alert(`Detail Kehadiran - Tanggal ${dayNumber} Januari 2025:\n\nStatus: ${status}\n\nKeterangan: ${getAttendanceDescription(status)}`);
}

function getAttendanceDescription(status) {
  const descriptions = {
    Hadir: 'Mahasiswa hadir mengikuti perkuliahan sesuai jadwal.',
    Izin: 'Mahasiswa izin dengan alasan yang dapat diterima.',
    Sakit: 'Mahasiswa tidak hadir karena sakit dengan bukti surat dokter.',
    Alpha: 'Mahasiswa tidak hadir tanpa keterangan.',
  };

  return descriptions[status] || 'Tidak ada keterangan.';
}

// Transcript Actions
function initTranscriptActions() {
  const verifyBtn = document.getElementById('verify-transcript');
  if (verifyBtn) {
    verifyBtn.addEventListener('click', verifyTranscript);
  }

  const actionBtns = document.querySelectorAll('.transcript-actions .action-btn');
  actionBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      const action = this.textContent.trim();
      handleTranscriptAction(action);
    });
  });
}

function verifyTranscript() {
  // Simulate verification process
  showNotification('Memverifikasi transkrip dengan blockchain...', 'info');

  setTimeout(() => {
    const modalContent = `
            <div class="verification-result">
                <div class="verification-header">
                    <i class="fas fa-shield-alt success"></i>
                    <h4>Transkrip Terverifikasi</h4>
                </div>
                
                <div class="verification-details">
                    <div class="detail-item">
                        <span class="detail-label">Nomor Transkrip:</span>
                        <span class="detail-value">TRX-2025-001234</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Nama:</span>
                        <span class="detail-value">Andi Suryanto</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">NIM:</span>
                        <span class="detail-value">23012345</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Universitas:</span>
                        <span class="detail-value">Universitas Contoh</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">IPK:</span>
                        <span class="detail-value">3.68</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Status Verifikasi:</span>
                        <span class="detail-value success">SAH</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Waktu Verifikasi:</span>
                        <span class="detail-value">${new Date().toLocaleString('id-ID')}</span>
                    </div>
                </div>
                
                <div class="verification-qr">
                    <div class="qr-placeholder">
                        <div class="qr-text">QR Code</div>
                        <div class="qr-note">Scan untuk verifikasi digital</div>
                    </div>
                </div>
                
                <div class="verification-actions">
                    <button class="action-btn primary" onclick="downloadVerification()">
                        <i class="fas fa-download"></i> Sertifikat Verifikasi
                    </button>
                    <button class="action-btn" onclick="closeVerification()">
                        <i class="fas fa-times"></i> Tutup
                    </button>
                </div>
            </div>
        `;

    // Create modal for verification result
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-shield-alt"></i> Hasil Verifikasi</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">${modalContent}</div>
            </div>
        `;

    document.body.appendChild(modal);

    // Add close functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
      modal.remove();
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }, 2000);
}

function handleTranscriptAction(action) {
  switch (action) {
    case 'Buat Surat':
      showNotification('Membuat surat keterangan nilai...', 'info');
      break;
    case 'Lihat Analisis':
      showNotification('Membuka analisis performa akademik...', 'info');
      break;
    case 'Verifikasi':
      verifyTranscript();
      break;
  }
}

// Progress Views
function initProgressViews() {
  const viewButtons = document.querySelectorAll('.view-btn[data-view]');
  const progressViews = document.querySelectorAll('.progress-view');

  viewButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const view = this.getAttribute('data-view');

      // Remove active class from all view buttons
      viewButtons.forEach((btn) => btn.classList.remove('active'));

      // Add active class to clicked button
      this.classList.add('active');

      // Hide all progress views
      progressViews.forEach((view) => view.classList.remove('active'));

      // Show selected view
      document.getElementById(`${view}-view`).classList.add('active');
    });
  });

  // Animate performance chart bars on hover
  const chartBars = document.querySelectorAll('.chart-bar');
  chartBars.forEach((bar) => {
    bar.addEventListener('mouseenter', function () {
      const tooltip = this.querySelector('.bar-tooltip');
      tooltip.style.opacity = '1';
      tooltip.style.visibility = 'visible';
    });

    bar.addEventListener('mouseleave', function () {
      const tooltip = this.querySelector('.bar-tooltip');
      tooltip.style.opacity = '0';
      tooltip.style.visibility = 'hidden';
    });
  });
}

// Helper Functions
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;

  // Add to body
  document.body.appendChild(notification);

  // Add CSS for notification
  const style = document.createElement('style');
  style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background-color: white;
            border-radius: var(--radius);
            box-shadow: var(--shadow-lg);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            min-width: 300px;
            max-width: 400px;
            z-index: 2000;
            animation: slideIn 0.3s ease;
            border-left: 4px solid;
        }
        
        .notification.info {
            border-left-color: var(--info);
        }
        
        .notification.success {
            border-left-color: var(--success);
        }
        
        .notification.warning {
            border-left-color: var(--warning);
        }
        
        .notification.error {
            border-left-color: var(--danger);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
        }
        
        .notification-content i {
            font-size: 20px;
        }
        
        .notification.info .notification-content i {
            color: var(--info);
        }
        
        .notification.success .notification-content i {
            color: var(--success);
        }
        
        .notification.warning .notification-content i {
            color: var(--warning);
        }
        
        .notification.error .notification-content i {
            color: var(--danger);
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 20px;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 4px;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;

  // Remove existing style if any
  const existingStyle = document.querySelector('#notification-style');
  if (existingStyle) existingStyle.remove();

  style.id = 'notification-style';
  document.head.appendChild(style);

  // Close notification when close button is clicked
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      notification.remove();
    }, 300);
  });

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }
  }, 5000);
}

function getNotificationIcon(type) {
  const icons = {
    info: 'info-circle',
    success: 'check-circle',
    warning: 'exclamation-triangle',
    error: 'exclamation-circle',
  };

  return icons[type] || 'info-circle';
}

// Mock functions for demo
function downloadGradeReport(courseCode) {
  showNotification(`Mengunduh report untuk ${courseCode}...`, 'info');
}

function showGradeAnalysis(courseCode) {
  showNotification(`Membuka analisis detail untuk ${courseCode}...`, 'info');
}

function downloadVerification() {
  showNotification('Mengunduh sertifikat verifikasi...', 'success');
}

function closeVerification() {
  const modal = document.querySelector('.modal.active');
  if (modal) {
    modal.remove();
  }
}

// Load KHS data (mock)
function loadKHS(semester) {
  showNotification(`Memuat KHS Semester ${semester}...`, 'info');

  // In a real app, this would fetch data from API
  setTimeout(() => {
    showNotification(`KHS Semester ${semester} berhasil dimuat`, 'success');
  }, 1000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function (e) {
  // Ctrl+E for export
  if (e.ctrlKey && e.key === 'e') {
    e.preventDefault();
    const exportBtn = document.querySelector('.export-btn');
    if (exportBtn) exportBtn.click();
  }

  // Numbers 1-5 for tab switching
  if (e.altKey && e.key >= '1' && e.key <= '5') {
    e.preventDefault();
    const tabIndex = parseInt(e.key) - 1;
    const tabs = document.querySelectorAll('.study-tab');
    if (tabs[tabIndex]) {
      tabs[tabIndex].click();
    }
  }
});
