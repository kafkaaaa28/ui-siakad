// ============================================
// ADMINISTRATION PAGE - JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function () {
  // Initialize all functionality
  initTabs();
  initFilters();
  initPaymentMethods();
  initModals();
  initFormHandlers();
  initEventListeners();

  console.log('Administration page initialized successfully!');
});

// Tab Switching
function initTabs() {
  const tabs = document.querySelectorAll('.admin-tab');
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

// Filter History
function initFilters() {
  const historyFilter = document.getElementById('history-filter');
  const historyMonth = document.getElementById('history-month');
  const historyItems = document.querySelectorAll('.history-item');

  function filterHistory() {
    const typeFilter = historyFilter.value;
    const monthFilter = historyMonth.value;

    historyItems.forEach((item) => {
      const itemType = item.getAttribute('data-type');
      const itemDate = item.querySelector('.history-date').textContent;

      let typeMatch = typeFilter === 'all' || itemType === typeFilter;
      let monthMatch = true;

      if (monthFilter) {
        const itemDateObj = parseDate(itemDate);
        const filterDate = new Date(monthFilter + '-01');
        const filterYear = filterDate.getFullYear();
        const filterMonth = filterDate.getMonth() + 1;

        monthMatch = itemDateObj.year === filterYear && itemDateObj.month === filterMonth;
      }

      item.style.display = typeMatch && monthMatch ? 'flex' : 'none';
    });
  }

  historyFilter.addEventListener('change', filterHistory);
  historyMonth.addEventListener('change', filterHistory);

  // Helper function to parse date string
  function parseDate(dateStr) {
    const months = {
      Jan: 1,
      Feb: 2,
      Mar: 3,
      Apr: 4,
      Mei: 5,
      Jun: 6,
      Jul: 7,
      Agu: 8,
      Sep: 9,
      Okt: 10,
      Nov: 11,
      Des: 12,
    };

    const parts = dateStr.split(' ');
    const day = parseInt(parts[0]);
    const month = months[parts[1]];
    const year = parseInt(parts[2]);

    return { day, month, year };
  }
}

// Payment Methods Selection
function initPaymentMethods() {
  const methodCards = document.querySelectorAll('.method-card');

  methodCards.forEach((card) => {
    card.addEventListener('click', function () {
      // Remove active class from all cards
      methodCards.forEach((c) => c.classList.remove('active'));

      // Add active class to clicked card
      this.classList.add('active');

      const method = this.getAttribute('data-method');
      showPaymentInstructions(method);
    });
  });

  function showPaymentInstructions(method) {
    const instructions = {
      bca: {
        title: 'Transfer Bank BCA',
        steps: ['Login ke internet/mobile banking BCA', 'Pilih menu Transfer ke Rekening BCA', 'Masukkan nomor rekening: 1234567890', 'Atas nama: UNIVERSITAS CONTOH', 'Masukkan nominal: Rp 1.100.000', 'Konfirmasi dan selesaikan transaksi'],
        note: 'Harap transfer tepat sesuai nominal untuk proses otomatis',
      },
      bri: {
        title: 'Virtual Account BRI',
        steps: ['Dapatkan kode VA: 888801234567890', 'Bayar via ATM BRI, Mobile Banking, atau internet banking', 'Pilih menu Pembayaran > Pendidikan', 'Masukkan kode VA yang diberikan', 'Konfirmasi pembayaran', 'Simpan bukti transaksi'],
        note: 'Kode VA berlaku 24 jam sejak invoice dibuat',
      },
      dana: {
        title: 'E-Wallet (DANA)',
        steps: ['Buka aplikasi DANA', 'Pilih menu Bayar > Scan QR', 'Scan QR code yang tersedia', 'Masukkan nominal: Rp 1.100.000', 'Konfirmasi pembayaran', 'Screenshot bukti pembayaran'],
        note: 'Pembayaran via DANA diproses instan',
      },
    };

    const instruction = instructions[method] || instructions['bca'];

    // Show payment instructions in console (in real app, show in UI)
    console.log(`Payment Method: ${instruction.title}`);
    console.log('Steps:', instruction.steps);
    console.log('Note:', instruction.note);
  }
}

// Modal Functions
function initModals() {
  const receiptModal = document.getElementById('receipt-modal');
  const paymentModal = document.getElementById('payment-modal');
  const closeButtons = document.querySelectorAll('.close-modal');
  const detailButtons = document.querySelectorAll('.detail-btn');

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

  // Show receipt when detail button is clicked
  detailButtons.forEach((button) => {
    if (button.hasAttribute('data-id')) {
      button.addEventListener('click', function () {
        const receiptId = this.getAttribute('data-id');
        showReceipt(receiptId);
      });
    }
  });

  // Show payment modal
  const payButton = document.getElementById('pay-invoice');
  if (payButton) {
    payButton.addEventListener('click', function () {
      showPaymentModal();
    });
  }

  // Print invoice
  const printButton = document.getElementById('print-invoice');
  if (printButton) {
    printButton.addEventListener('click', function () {
      printInvoice();
    });
  }
}

function showReceipt(receiptId) {
  const receiptModal = document.getElementById('receipt-modal');
  const receiptContent = document.getElementById('receipt-content');

  // Mock receipt data
  const receipts = {
    1: {
      invoiceNo: 'TRX-20250115-00123',
      date: '15 Januari 2025',
      description: 'UKT Semester 6',
      amount: 'Rp 2.500.000',
      method: 'Transfer Bank BCA',
      status: 'LUNAS',
      reference: 'BCA1234567890',
    },
    2: {
      invoiceNo: 'VA-20250110-04567',
      date: '10 Januari 2025',
      description: 'SPP Bulan Januari',
      amount: 'Rp 500.000',
      method: 'Virtual Account BRI',
      status: 'LUNAS',
      reference: '888801234567890',
    },
    3: {
      invoiceNo: 'EW-20240805-07891',
      date: '5 Agustus 2024',
      description: 'Semester Pendek 2024',
      amount: 'Rp 1.500.000',
      method: 'E-Wallet (DANA)',
      status: 'LUNAS',
      reference: 'DANA2024080507891',
    },
    4: {
      invoiceNo: 'TRX-20240820-03456',
      date: '20 Agustus 2024',
      description: 'UKT Semester 5',
      amount: 'Rp 2.500.000',
      method: 'Transfer Bank Mandiri',
      status: 'LUNAS',
      reference: 'MANDIRI0987654321',
    },
    5: {
      invoiceNo: 'CSH-20241215-001',
      date: '15 Desember 2024',
      description: 'Wisuda & Alumni',
      amount: 'Rp 500.000',
      method: 'Tunai di Bendahara',
      status: 'LUNAS',
      reference: 'KASIR001',
    },
  };

  const receipt = receipts[receiptId] || receipts['1'];

  // Populate receipt content
  receiptContent.innerHTML = `
        <div class="receipt">
            <div class="receipt-header">
                <h4>KWITANSI PEMBAYARAN</h4>
                <div class="receipt-number">No: ${receipt.invoiceNo}</div>
            </div>
            
            <div class="receipt-body">
                <div class="receipt-info">
                    <div class="info-row">
                        <span>Tanggal:</span>
                        <strong>${receipt.date}</strong>
                    </div>
                    <div class="info-row">
                        <span>Deskripsi:</span>
                        <strong>${receipt.description}</strong>
                    </div>
                    <div class="info-row">
                        <span>Jumlah:</span>
                        <strong class="amount">${receipt.amount}</strong>
                    </div>
                    <div class="info-row">
                        <span>Metode:</span>
                        <span>${receipt.method}</span>
                    </div>
                    <div class="info-row">
                        <span>Referensi:</span>
                        <code>${receipt.reference}</code>
                    </div>
                    <div class="info-row">
                        <span>Status:</span>
                        <span class="status-badge success">${receipt.status}</span>
                    </div>
                </div>
                
                <div class="receipt-footer">
                    <div class="signature">
                        <div class="signature-line"></div>
                        <div class="signature-label">Tanda Tangan Bendahara</div>
                    </div>
                    <div class="stamp">
                        <div class="stamp-circle">LUNAS</div>
                    </div>
                </div>
            </div>
            
            <div class="receipt-actions">
                <button class="action-btn primary" onclick="downloadReceipt('${receiptId}')">
                    <i class="fas fa-download"></i> Unduh PDF
                </button>
                <button class="action-btn" onclick="printReceipt('${receiptId}')">
                    <i class="fas fa-print"></i> Cetak
                </button>
            </div>
        </div>
    `;

  // Add receipt CSS
  const style = document.createElement('style');
  style.textContent = `
        .receipt {
            padding: 20px;
        }
        
        .receipt-header {
            text-align: center;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 2px dashed var(--border);
        }
        
        .receipt-header h4 {
            font-size: 20px;
            color: var(--dark);
            margin-bottom: 8px;
        }
        
        .receipt-number {
            font-size: 14px;
            color: var(--text-secondary);
        }
        
        .receipt-body {
            margin-bottom: 24px;
        }
        
        .receipt-info {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 24px;
        }
        
        .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid var(--border);
        }
        
        .info-row:last-child {
            border-bottom: none;
        }
        
        .amount {
            font-size: 20px;
            color: var(--dark);
            font-weight: 700;
        }
        
        code {
            background-color: var(--light);
            padding: 4px 8px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 13px;
        }
        
        .receipt-footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 32px;
            padding-top: 16px;
            border-top: 2px dashed var(--border);
        }
        
        .signature {
            text-align: center;
        }
        
        .signature-line {
            width: 200px;
            height: 1px;
            background-color: var(--dark);
            margin-bottom: 8px;
        }
        
        .signature-label {
            font-size: 12px;
            color: var(--text-secondary);
        }
        
        .stamp-circle {
            width: 80px;
            height: 80px;
            border: 3px solid var(--success);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            color: var(--success);
            transform: rotate(-15deg);
        }
        
        .receipt-actions {
            display: flex;
            gap: 12px;
            margin-top: 24px;
        }
    `;

  // Remove existing style if any
  const existingStyle = document.querySelector('#receipt-style');
  if (existingStyle) existingStyle.remove();

  style.id = 'receipt-style';
  document.head.appendChild(style);

  // Show modal
  receiptModal.classList.add('active');
}

function showPaymentModal() {
  const paymentModal = document.getElementById('payment-modal');
  const paymentContent = document.getElementById('payment-content');

  paymentContent.innerHTML = `
        <div class="payment-instructions">
            <h4><i class="fas fa-credit-card"></i> Instruksi Pembayaran</h4>
            
            <div class="alert-card info">
                <i class="fas fa-info-circle"></i>
                <div class="alert-content">
                    <p>Pilih metode pembayaran terlebih dahulu pada halaman tagihan sebelum melanjutkan.</p>
                </div>
            </div>
            
            <div class="payment-steps">
                <h5>Langkah-langkah:</h5>
                <ol>
                    <li>Pilih metode pembayaran yang diinginkan</li>
                    <li>Ikuti instruksi pembayaran sesuai metode yang dipilih</li>
                    <li>Simpan bukti pembayaran (screenshot/PDF)</li>
                    <li>Status pembayaran akan diperbarui dalam 1x24 jam</li>
                </ol>
            </div>
            
            <div class="payment-note">
                <h5><i class="fas fa-exclamation-circle"></i> Catatan Penting:</h5>
                <ul>
                    <li>Transfer harus sesuai nominal tagihan</li>
                    <li>Pembayaran akan diverifikasi oleh bendahara</li>
                    <li>Hubungi keuangan jika status belum berubah dalam 24 jam</li>
                </ul>
            </div>
            
            <div class="payment-actions">
                <button class="action-btn primary" onclick="simulatePayment()">
                    <i class="fas fa-check"></i> Saya Sudah Bayar
                </button>
                <button class="action-btn" onclick="closePaymentModal()">
                    <i class="fas fa-times"></i> Tutup
                </button>
            </div>
        </div>
    `;

  // Add payment CSS
  const style = document.createElement('style');
  style.textContent = `
        .payment-instructions {
            padding: 20px;
        }
        
        .payment-instructions h4 {
            font-size: 18px;
            color: var(--dark);
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .payment-steps, .payment-note {
            margin-top: 20px;
        }
        
        .payment-steps h5, .payment-note h5 {
            font-size: 16px;
            color: var(--dark);
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .payment-steps ol, .payment-note ul {
            padding-left: 20px;
            margin-bottom: 16px;
        }
        
        .payment-steps li, .payment-note li {
            margin-bottom: 8px;
            color: var(--text-primary);
        }
        
        .payment-actions {
            display: flex;
            gap: 12px;
            margin-top: 24px;
        }
    `;

  // Remove existing style if any
  const existingStyle = document.querySelector('#payment-style');
  if (existingStyle) existingStyle.remove();

  style.id = 'payment-style';
  document.head.appendChild(style);

  // Show modal
  paymentModal.classList.add('active');
}

function printInvoice() {
  alert('Mencetak invoice...');
  console.log('Printing invoice');
  // In real app: window.print();
}

function simulatePayment() {
  alert('Terima kasih! Pembayaran Anda telah dicatat.\nStatus akan diperbarui dalam 1x24 jam.');
  const paymentModal = document.getElementById('payment-modal');
  paymentModal.classList.remove('active');
}

function closePaymentModal() {
  const paymentModal = document.getElementById('payment-modal');
  paymentModal.classList.remove('active');
}

// Form Handlers
function initFormHandlers() {
  const letterForm = document.getElementById('letter-form');
  const cancelForm = document.getElementById('cancel-form');
  const generateButton = document.getElementById('generate-letter');

  if (letterForm) {
    letterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      generateLetter();
    });
  }

  if (cancelForm) {
    cancelForm.addEventListener('click', function () {
      letterForm.reset();
    });
  }

  if (generateButton) {
    generateButton.addEventListener('click', function () {
      // Scroll to form
      document.querySelector('.letter-form').scrollIntoView({
        behavior: 'smooth',
      });
    });
  }

  // Letter action buttons
  const letterActions = document.querySelectorAll('.letter-actions .action-btn');
  letterActions.forEach((button) => {
    button.addEventListener('click', function () {
      const action = this.textContent.trim();
      const letterId = this.getAttribute('data-letter');

      switch (action) {
        case 'Unduh PDF':
          downloadLetter(letterId);
          break;
        case 'Cetak':
          printLetter(letterId);
          break;
        case 'Preview':
          previewLetter(letterId);
          break;
      }
    });
  });

  // Add course buttons
  const addButtons = document.querySelectorAll('.add-btn');
  addButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const courseItem = this.closest('.course-item');
      const courseName = courseItem.querySelector('h4').textContent;

      // Confirm add course
      if (confirm(`Tambahkan ${courseName} ke semester pendek?`)) {
        // Update UI
        const courseStatus = courseItem.querySelector('.course-status');
        courseStatus.innerHTML = '<span class="status-badge info">TERDAFTAR</span>';

        const courseAction = courseItem.querySelector('.course-action');
        courseAction.remove();

        // Update total
        updateInvoiceTotal();
      }
    });
  });
}

function generateLetter() {
  const type = document.getElementById('letter-type').value;
  const purpose = document.getElementById('letter-purpose').value;
  const period = document.getElementById('letter-period').value;
  const duration = document.getElementById('letter-duration').value;
  const note = document.getElementById('letter-note').value;

  if (!type || !purpose || !period || !duration) {
    alert('Harap lengkapi semua field yang diperlukan!');
    return;
  }

  const typeNames = {
    ukt: 'Surat Keterangan Lunas UKT',
    spp: 'Surat Keterangan Lunas SPP',
    bebas: 'Surat Bebas Perpustakaan',
    beasiswa: 'Surat Keterangan Beasiswa',
    lain: 'Surat Keterangan Keuangan',
  };

  const purposeNames = {
    beasiswa: 'Beasiswa',
    perpustakaan: 'Peminjaman Perpustakaan',
    transkrip: 'Pengambilan Transkrip',
    kampus: 'Kebutuhan Internal Kampus',
    instansi: 'Pengajuan ke Instansi',
  };

  const periodNames = {
    6: 'Semester 6 (Genap 2024/2025)',
    5: 'Semester 5 (Ganjil 2023/2024)',
    4: 'Semester 4 (Genap 2022/2023)',
    all: 'Semua Semester',
  };

  // Generate letter number
  const letterNo = `SP/${new Date().getFullYear()}/${Math.floor(Math.random() * 10000)}`;

  // Show success message
  alert(`Surat berhasil dibuat!\n\nNomor Surat: ${letterNo}\nJenis: ${typeNames[type]}\nTujuan: ${purposeNames[purpose]}\nPeriode: ${periodNames[period]}\n\nSurat akan tersedia dalam 1x24 jam.`);

  // Reset form
  document.getElementById('letter-form').reset();

  // Simulate adding to grid
  addLetterToGrid({
    id: Date.now(),
    type: typeNames[type],
    purpose: purposeNames[purpose],
    period: periodNames[period],
    number: letterNo,
    date: new Date().toLocaleDateString('id-ID'),
    duration: `${duration} hari`,
  });
}

function addLetterToGrid(letter) {
  const lettersGrid = document.querySelector('.letters-grid');

  const letterCard = document.createElement('div');
  letterCard.className = 'letter-card';
  letterCard.innerHTML = `
        <div class="letter-header">
            <div class="letter-icon">
                <i class="fas fa-file-contract"></i>
            </div>
            <div class="letter-title">
                <h3>${letter.type}</h3>
                <span class="letter-date">Dibuat: ${letter.date}</span>
            </div>
            <span class="status-badge info">BARU</span>
        </div>
        
        <div class="letter-body">
            <div class="letter-info">
                <div class="info-row">
                    <span class="info-label">Nomor Surat:</span>
                    <span class="info-value">${letter.number}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Periode:</span>
                    <span class="info-value">${letter.period}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Tujuan:</span>
                    <span class="info-value">${letter.purpose}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Masa Berlaku:</span>
                    <span class="info-value">${letter.duration}</span>
                </div>
            </div>
        </div>
        
        <div class="letter-actions">
            <button class="action-btn" data-letter="${letter.id}">
                <i class="fas fa-download"></i> Unduh PDF
            </button>
            <button class="action-btn" data-letter="${letter.id}">
                <i class="fas fa-eye"></i> Preview
            </button>
        </div>
    `;

  // Add to beginning of grid
  lettersGrid.insertBefore(letterCard, lettersGrid.firstChild);
}

function updateInvoiceTotal() {
  // Simulate updating invoice total when courses are added
  const subtotal = document.querySelector('.invoice-total .total-row:first-child .total-value');
  const grandTotal = document.querySelector('.invoice-total .total-row.grand .total-value');

  // Update totals (in real app, calculate based on added courses)
  subtotal.textContent = 'Rp 1.750.000';
  grandTotal.textContent = 'Rp 1.925.000';
}

// Download/Print functions
function downloadReceipt(receiptId) {
  alert(`Mengunduh kwitansi ${receiptId}...`);
  console.log(`Downloading receipt ${receiptId}`);
}

function printReceipt(receiptId) {
  alert(`Mencetak kwitansi ${receiptId}...`);
  console.log(`Printing receipt ${receiptId}`);
}

function downloadLetter(letterId) {
  alert(`Mengunduh surat ${letterId}...`);
  console.log(`Downloading letter ${letterId}`);
}

function printLetter(letterId) {
  alert(`Mencetak surat ${letterId}...`);
  console.log(`Printing letter ${letterId}`);
}

function previewLetter(letterId) {
  alert(`Preview surat ${letterId}...`);
  console.log(`Previewing letter ${letterId}`);
}

// Export History
function initEventListeners() {
  const exportHistory = document.getElementById('export-history');
  if (exportHistory) {
    exportHistory.addEventListener('click', function () {
      alert('Mengekspor history pembayaran ke PDF...');
      console.log('Exporting payment history');
    });
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', function (e) {
    // Ctrl+E for export
    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      exportHistory?.click();
    }

    // Numbers 1-3 for tab switching
    if (e.altKey && e.key >= '1' && e.key <= '3') {
      e.preventDefault();
      const tabIndex = parseInt(e.key) - 1;
      const tabs = document.querySelectorAll('.admin-tab');
      if (tabs[tabIndex]) {
        tabs[tabIndex].click();
      }
    }
  });
}
