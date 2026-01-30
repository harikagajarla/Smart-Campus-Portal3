/*
 * UniPulse Smart Campus 2026 - HACKATHON EDITION
 * Main Application Engine
 * Features: Complete Auth Flow, Real-time Updates, localStorage State Management
 */

// ============================================
// GLOBAL STATE MANAGEMENT - Central Engine
// ============================================
const classroomsGrid = document.getElementById("classroomsGrid");
var availableRoomsEl = document.getElementById("availableRooms");
var occupiedRoomsEl = document.getElementById("occupiedRooms");
const csvUpload = document.getElementById("csvUpload");

const State = {

    user: null,
    users: [],
    complaints: [],
    lostAndFound: [],
  // User Authentication
  user: JSON.parse(localStorage.getItem('uniPulse_user')) || null,
  
  // Registered Users Database (simulating backend)
  users: JSON.parse(localStorage.getItem('uniPulse_users')) || [],
  
  // Smart Classrooms Data with Live Updates
  classrooms: JSON.parse(localStorage.getItem("uniPulse_classrooms")) || [],


  
  // Campus Complaints Data
  complaints: JSON.parse(localStorage.getItem('uniPulse_complaints')) || [
    {
      id: 1,
      title: 'Broken AC in Library',
      category: 'Facilities',
      location: 'Central Library, 3rd Floor',
      description: 'The air conditioning unit has been malfunctioning for the past two days, making it uncomfortable to study.',
      priority: 'High',
      status: 'pending',
      createdAt: new Date('2026-01-28').toISOString(),
      createdBy: 'STU2026001'
    },
    {
      id: 2,
      title: 'WiFi Connectivity Issues',
      category: 'Technology',
      location: 'Engineering Block B',
      description: 'Students are experiencing frequent disconnections and slow internet speeds in the entire building.',
      priority: 'Medium',
      status: 'pending',
      createdAt: new Date('2026-01-29').toISOString(),
      createdBy: 'STU2026045'
    },
    {
      id: 3,
      title: 'Cafeteria Hygiene Concern',
      category: 'Hygiene',
      location: 'Main Cafeteria',
      description: 'The dining area needs more frequent cleaning, especially during peak hours.',
      priority: 'Medium',
      status: 'pending',
      createdAt: new Date('2026-01-30').toISOString(),
      createdBy: 'STU2026089'
    }
  ],
  
  // Lost & Found Items
  lostAndFound: JSON.parse(localStorage.getItem('uniPulse_lostAndFound')) || [
    {
      id: 1,
      name: 'Blue Backpack',
      category: 'Clothing',
      location: 'Library Reading Hall',
      description: 'Navy blue backpack with laptop compartment and university logo patch',
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
      contactInfo: 'john.doe@university.edu',
      foundDate: new Date('2026-01-28').toISOString(),
      foundBy: 'STU2026012'
    },
    {
      id: 2,
      name: 'iPhone 13 Pro',
      category: 'Electronics',
      location: 'Cafeteria Table 5',
      description: 'Black iPhone 13 Pro with a clear case and popsocket on the back',
      imageUrl: 'https://images.unsplash.com/photo-1592286927505-e4e6d7ab8c90?w=400&h=300&fit=crop',
      contactInfo: 'sarah.smith@university.edu',
      foundDate: new Date('2026-01-29').toISOString(),
      foundBy: 'STU2026034'
    },
    {
      id: 3,
      name: 'Calculus Textbook',
      category: 'Books',
      location: 'Mathematics Department',
      description: 'Advanced Calculus textbook with handwritten notes inside front cover',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop',
      contactInfo: 'mike.wilson@university.edu',
      foundDate: new Date('2026-01-30').toISOString(),
      foundBy: 'STU2026067'
    }
  ],
  
  // Save state to localStorage
  save() {
    localStorage.setItem('uniPulse_user', JSON.stringify(this.user));
    localStorage.setItem('uniPulse_users', JSON.stringify(this.users));
    localStorage.setItem('uniPulse_complaints', JSON.stringify(this.complaints));
    localStorage.setItem('uniPulse_lostAndFound', JSON.stringify(this.lostAndFound));
    localStorage.setItem("uniPulse_state", JSON.stringify(this));
    localStorage.setItem("uniPulse_classrooms", JSON.stringify(this.classrooms));
  },
  
  // Clear all data
  reset() {
    localStorage.clear();
    this.user = null;
    this.users = [];
    this.classrooms = [];
    this.complaints = [];
    this.lostAndFound = [];
  }
};

// ============================================
// TOAST NOTIFICATION SYSTEM
// ============================================

const Toast = {
  show(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
      success: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      error: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      warning: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      info: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };
    
    const titles = {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info'
    };
    
    toast.innerHTML = `
      <div class="toast-icon">${icons[type]}</div>
      <div class="toast-content">
        <div class="toast-title">${titles[type]}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'toastSlideOut 0.3s ease-out forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

// ============================================
// AUTHENTICATION SYSTEM - FIXED & COMPLETE
// ============================================

// Signup Form Handler
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('signupBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    // Get form data
    const formData = {
      fullName: document.getElementById('fullName').value.trim(),
      email: document.getElementById('email').value.trim(),
      studentId: document.getElementById('studentId').value.trim(),
      department: document.getElementById('department').value,
      password: document.getElementById('password').value,
      confirmPassword: document.getElementById('confirmPassword').value,
      agreeTerms: document.getElementById('agreeTerms').checked
    };
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));
    
    // Validation
    let hasError = false;
    
    if (!formData.fullName || formData.fullName.length < 3) {
      showError('fullNameError', 'Please enter your full name (min 3 characters)');
      hasError = true;
    }
    
    if (!formData.email || !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      showError('emailError', 'Please enter a valid university email');
      hasError = true;
    }
    
    // Check if email already exists
    if (State.users.some(u => u.email === formData.email)) {
      showError('emailError', 'This email is already registered');
      hasError = true;
    }
    
    // Validate Student ID format: STU + Year + 3 digits
    const studentIdRegex = /^STU\d{7}$/;
    if (!formData.studentId || !studentIdRegex.test(formData.studentId)) {
      showError('studentIdError', 'Invalid format. Use: STU + Year + 3 digits (e.g., STU2026001)');
      hasError = true;
    }
    
    // Check if student ID already exists
    if (State.users.some(u => u.studentId === formData.studentId)) {
      showError('studentIdError', 'This Student ID is already registered');
      hasError = true;
    }
    
    if (!formData.department) {
      showError('departmentError', 'Please select your department');
      hasError = true;
    }
    
    if (!formData.password || formData.password.length < 8) {
      showError('passwordError', 'Password must be at least 8 characters');
      hasError = true;
    }
    
    if (formData.password !== formData.confirmPassword) {
      showError('confirmPasswordError', 'Passwords do not match');
      hasError = true;
    }
    
    if (!formData.agreeTerms) {
      showError('agreeTermsError', 'You must agree to the terms and conditions');
      hasError = true;
    }
    
    if (hasError) {
      Toast.show('Please fix the errors in the form', 'error');
      return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.opacity = '0';
    btnLoader.style.display = 'block';
    
    // Simulate API call (replace with actual backend call in production)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create new user
    const newUser = {
      id: Date.now(),
      fullName: formData.fullName,
      email: formData.email,
      studentId: formData.studentId,
      department: formData.department,
      password: formData.password, // In production, hash this!
      createdAt: new Date().toISOString(),
      role: 'student'
    };
    
    // Add to users array
    State.users.push(newUser);
    
    // Set as current user (auto-login)
    State.user = {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      studentId: newUser.studentId,
      department: newUser.department,
      role: newUser.role
    };
    
    // Save to localStorage
    State.save();
    
    Toast.show('Account created successfully! Redirecting...', 'success');
    
    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = 'features.html';
    }, 1000);
  });
  
  // Real-time validation for Student ID
  const studentIdInput = document.getElementById('studentId');
  const studentIdValidation = document.getElementById('studentIdValidation');
  
  if (studentIdInput) {
    studentIdInput.addEventListener('input', (e) => {
      const value = e.target.value.trim();
      const regex = /^STU\d{7}$/;
      
      if (value && regex.test(value)) {
        studentIdValidation.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
        studentIdInput.classList.remove('error');
      } else if (value) {
        studentIdValidation.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
      } else {
        studentIdValidation.innerHTML = '';
      }
    });
  }
  
  // Password strength indicator
  const passwordInput = document.getElementById('password');
  const strengthFill = document.getElementById('strengthFill');
  const strengthText = document.getElementById('strengthText');
  
  if (passwordInput) {
    passwordInput.addEventListener('input', (e) => {
      const password = e.target.value;
      const strength = calculatePasswordStrength(password);
      
      strengthFill.style.width = `${strength.score}%`;
      strengthFill.className = `strength-fill strength-${strength.level}`;
      strengthText.textContent = strength.text;
    });
  }
  
  // Confirm password validation
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const confirmPasswordValidation = document.getElementById('confirmPasswordValidation');
  
  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', (e) => {
      const password = document.getElementById('password').value;
      const confirmPassword = e.target.value;
      
      if (confirmPassword && password === confirmPassword) {
        confirmPasswordValidation.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
        confirmPasswordInput.classList.remove('error');
      } else if (confirmPassword) {
        confirmPasswordValidation.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
      } else {
        confirmPasswordValidation.innerHTML = '';
      }
    });
  }
  
  // Password visibility toggle
  const togglePasswordBtns = document.querySelectorAll('.toggle-password');
  togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      const type = input.type === 'password' ? 'text' : 'password';
      input.type = type;
      
      btn.innerHTML = type === 'password' 
        ? '<svg class="eye-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'
        : '<svg class="eye-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
    });
  });
}

// Login Form Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('loginBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    // Get form data
    const studentId = document.getElementById('studentId').value.trim();
    const password = document.getElementById('password').value;
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));
    
    // Validation
    if (!studentId) {
      showError('studentIdError', 'Please enter your Student ID');
      return;
    }
    
    if (!password) {
      showError('passwordError', 'Please enter your password');
      return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.opacity = '0';
    btnLoader.style.display = 'block';
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user
    const user = State.users.find(u => u.studentId === studentId && u.password === password);
    
    if (!user) {
      // Reset button
      submitBtn.disabled = false;
      btnText.style.opacity = '1';
      btnLoader.style.display = 'none';
      
      Toast.show('Invalid Student ID or password', 'error');
      showError('studentIdError', 'Invalid credentials');
      return;
    }
    
    // Set current user
    State.user = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      studentId: user.studentId,
      department: user.department,
      role: user.role
    };
    
    // Save to localStorage
    State.save();
    
    Toast.show(`Welcome back, ${user.fullName}!`, 'success');
    
    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = 'features.html';
    }, 1000);
  });
  
  // Password visibility toggle for login
  const togglePasswordBtn = document.getElementById('togglePassword');
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', () => {
      const passwordInput = document.getElementById('password');
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;
      
      togglePasswordBtn.innerHTML = type === 'password'
        ? '<svg class="eye-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'
        : '<svg class="eye-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
    });
  }
  
  // Forgot password modal
  const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
  const forgotPasswordModal = document.getElementById('forgotPasswordModal');
  const closeModal = document.getElementById('closeModal');
  
  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener('click', () => {
      forgotPasswordModal.classList.add('active');
    });
  }
  
  if (closeModal) {
    closeModal.addEventListener('click', () => {
      forgotPasswordModal.classList.remove('active');
    });
  }
  
  forgotPasswordModal?.addEventListener('click', (e) => {
    if (e.target === forgotPasswordModal) {
      forgotPasswordModal.classList.remove('active');
    }
  });
}

// Helper function to show errors
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    const input = errorElement.previousElementSibling?.querySelector('.form-input');
    if (input) input.classList.add('error');
  }
}

// Password strength calculator
function calculatePasswordStrength(password) {
  let score = 0;
  
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 25;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 20;
  if (/\d/.test(password)) score += 15;
  if (/[^a-zA-Z\d]/.test(password)) score += 15;
  
  let level = 'weak';
  let text = 'Weak password';
  
  if (score >= 75) {
    level = 'strong';
    text = 'Strong password';
  } else if (score >= 50) {
    level = 'medium';
    text = 'Medium strength';
  }
  
  return { score, level, text };
}

// ============================================
// DASHBOARD - AUTHENTICATION CHECK
// ============================================

// Check if user is logged in on dashboard pages
if (window.location.pathname.includes('features.html')) {
  if (!State.user) {
    Toast.show('Please login to access the dashboard', 'warning');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
  } else {
    initializeDashboard();
  }
}

// Initialize Dashboard
function initializeDashboard() {
  // Set user name
  const userNameEl = document.getElementById('userName');
  if (userNameEl) {
    userNameEl.textContent = `Welcome, ${State.user.fullName.split(' ')[0]}`;
  }
  
  // Logout functionality
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      State.user = null;
      State.save();
      Toast.show('Logged out successfully', 'success');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1000);
    });
  }
  
  // Initialize all dashboard features
  initializeSmartClassrooms();
  initializeCampusComplaints();
  initializeLostAndFound();
  initializeTabs();
}

// ============================================
// SMART CLASSROOMS - WITH LIVE INDICATOR & BOOKING
// ============================================

function initializeSmartClassrooms() {
  renderClassrooms();
  
  // Update classroom status every 30 seconds
  setInterval(() => {
    updateClassroomStatus();
    renderClassrooms();
  }, 30000);
  
  // Search functionality
  const searchInput = document.getElementById('classroomSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filteredClassrooms = State.classrooms.filter(room => 
        room.name.toLowerCase().includes(searchTerm) ||
        room.building.toLowerCase().includes(searchTerm)
      );
      renderClassrooms(filteredClassrooms);
    });
  }
}

function renderClassrooms(classrooms = State.classrooms) {
  if (!grid) return;
  
  // Update stats
  const available = classrooms.filter(r => r.status === 'available').length;
  const occupied = classrooms.filter(r => r.status === 'occupied').length;
  
 
  
  if (availableRoomsEl) availableEl.textContent = available;
  if (occupiedRoomsEl) occupiedEl.textContent = occupied;
  
  // Render classroom cards
  grid.innerHTML = classrooms.map(room => {
    const isAvailable = room.status === 'available';
    const timeRemaining = room.endTime ? getTimeRemaining(room.endTime) : null;
    
    return `
      <div class="classroom-card ${isAvailable ? 'available' : 'occupied'} id="cardRoom"">
        <div class="classroom-header">
          <div class="classroom-info">
            <h3 class="classroom-name">${room.name}</h3>
            <p class="classroom-location">${room.building} • ${room.floor}</p>
          </div>
          <div class="classroom-status-badge ${isAvailable ? 'status-available' : 'status-occupied'}">
            <span class="status-dot ${isAvailable ? '' : 'pulse'}"></span>
            <span>${isAvailable ? 'Available' : 'Occupied'}</span>
          </div>
        </div>
        
        <div class="classroom-details">
          <div class="detail-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>Capacity: ${room.capacity}</span>
          </div>
        </div>
        
        ${!isAvailable ? `
          <div class="current-class">
            <div class="current-class-header">
              <span class="live-indicator">
                <span class="live-dot"></span>
                LIVE
              </span>
            </div>
            <h4 class="current-class-subject">${room.currentClass.subject}</h4>
            <p class="current-class-instructor">${room.currentClass.instructor}</p>
            ${timeRemaining ? `
              <div class="time-remaining">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>Ends in ${timeRemaining}</span>
              </div>
            ` : ''}
          </div>
        ` : ''}
        
        ${room.nextClass ? `
          <div class="next-class">
            <div class="next-class-label">Next Class</div>
            <div class="next-class-info">
              <span class="next-class-subject">${room.nextClass.subject}</span>
              <span class="next-class-time">${room.nextClass.time}</span>
            </div>
          </div>
        ` : ''}
        
        ${isAvailable ? `
          <button class="btn-book" onclick="bookClassroom(${room.id})">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Book Now
          </button>
        ` : ''}
      </div>
    `;
  }).join('');
}

// Calculate time remaining
function getTimeRemaining(endTime) {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end - now;
  
  if (diff <= 0) return null;
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

// Update classroom status (simulate real-time changes)
function updateClassroomStatus() {
  State.classrooms.forEach(room => {
    if (room.endTime) {
      const now = new Date();
      const end = new Date(room.endTime);
      
      if (now >= end) {
        room.status = 'available';
        room.currentClass = null;
        room.endTime = null;
      }
    }
  });
  State.save();
}

// Book classroom
window.bookClassroom = function(roomId) {
  const room = State.classrooms.find(r => r.id === roomId);
  if (!room) return;
  
  Toast.show(`Booking request sent for ${room.name}`, 'success');
  
  // In production, this would make an API call
  setTimeout(() => {
    Toast.show('Booking confirmed! Check your email for details.', 'info', 5000);
  }, 2000);

};

// ============================================
// CAMPUS COMPLAINTS - WITH RESOLVE FUNCTION
// ============================================

function initializeCampusComplaints() {
  renderComplaints();
  
  // New complaint modal
  const newComplaintBtn = document.getElementById('newComplaintBtn');
  const complaintModal = document.getElementById('complaintModal');
  const closeComplaintModal = document.getElementById('closeComplaintModal');
  const complaintForm = document.getElementById('complaintForm');
  
  if (newComplaintBtn) {
    newComplaintBtn.addEventListener('click', () => {
      complaintModal.classList.add('active');
    });
  }
  
  if (closeComplaintModal) {
    closeComplaintModal.addEventListener('click', () => {
      complaintModal.classList.remove('active');
    });
  }
  
  complaintModal?.addEventListener('click', (e) => {
    if (e.target === complaintModal) {
      complaintModal.classList.remove('active');
    }
  });
  
  if (complaintForm) {
    complaintForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form values
      const title = document.getElementById('complaintTitle').value.trim();
      const category = document.getElementById('complaintCategory').value;
      const location = document.getElementById('complaintLocation').value.trim();
      const description = document.getElementById('complaintDescription').value.trim();
      const priority = document.getElementById('complaintPriority').value;
      
      // Validate form
      if (!title || !category || !location || !description) {
        Toast.show('Please fill in all required fields', 'error');
        return;
      }
      
      // Create new complaint
      const newComplaint = {
        id: Date.now(),
        title: title,
        category: category,
        location: location,
        description: description,
        priority: priority,
        status: 'pending',
        createdAt: new Date().toISOString(),
        createdBy: State.user ? State.user.studentId : 'GUEST'
      };
      
      console.log('Adding new complaint:', newComplaint);
      
      // Add to complaints array at the beginning
      State.complaints.unshift(newComplaint);
      
      // Save to localStorage
      State.save();
      
      console.log('Total complaints after adding:', State.complaints.length);
      
      // Close modal
      complaintModal.classList.remove('active');
      
      // Reset form
      complaintForm.reset();
      
      // Re-render the complaints list
      renderComplaints();
      
      // Show success message
      Toast.show('Complaint submitted successfully!', 'success');
    });
  }
}

function renderComplaints() {
  const list = document.getElementById('complaintsContainer');
  const badge = document.getElementById('complaintsBadge');
  
  if (!list) {
    console.error('Complaints container not found!');
    return;
  }
  
  console.log('Rendering complaints. Total count:', State.complaints.length);
  
  // Update badge
  const pendingCount = State.complaints.filter(c => c.status === 'pending').length;
  if (badge) badge.textContent = pendingCount;
  
  // Update stats
  const totalComplaintsEl = document.getElementById('totalComplaints');
  const pendingComplaintsEl = document.getElementById('pendingComplaints');
  const resolvedComplaintsEl = document.getElementById('resolvedComplaints');
  
  if (totalComplaintsEl) totalComplaintsEl.textContent = State.complaints.length;
  if (pendingComplaintsEl) pendingComplaintsEl.textContent = pendingCount;
  if (resolvedComplaintsEl) {
    const resolved = State.complaints.filter(c => c.status === 'resolved').length;
    resolvedComplaintsEl.textContent = resolved;
  }
  
  if (State.complaints.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 1rem">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
          <line x1="9" y1="9" x2="9.01" y2="9"/>
          <line x1="15" y1="9" x2="15.01" y2="9"/>
        </svg>
        <h3>No complaints yet</h3>
        <p>Campus is running smoothly!</p>
      </div>
    `;
    return;
  }
  
  list.innerHTML = State.complaints.map(complaint => {
    const date = new Date(complaint.createdAt);
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const priorityColors = {
      High: 'priority-high',
      Medium: 'priority-medium',
      Low: 'priority-low'
    };
    
    return `
      <div class="complaint-card" data-complaint-id="${complaint.id}">
        <div class="complaint-header">
          <div class="complaint-info">
            <h3 class="complaint-title">${complaint.title}</h3>
            <div class="complaint-meta">
              <span class="complaint-category">${complaint.category}</span>
              <span class="complaint-priority ${priorityColors[complaint.priority]}">${complaint.priority}</span>
              <span class="complaint-date">${formattedDate}</span>
            </div>
          </div>
          <div class="complaint-status status-${complaint.status}">
            ${complaint.status}
          </div>
        </div>
        
        <div class="complaint-location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>${complaint.location}</span>
        </div>
        
        <p class="complaint-description">${complaint.description}</p>
        
        ${complaint.status === 'pending' ? `
          <button class="btn-resolve" onclick="resolveComplaint(${complaint.id})">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Mark as Resolved
          </button>
        ` : ''}
      </div>
    `;
  }).join('');
}

// RESOLVE COMPLAINT FUNCTION - HACKATHON FEATURE
window.resolveComplaint = function(complaintId) {
  const complaintCard = document.querySelector(`[data-complaint-id="${complaintId}"]`);
  
  if (!complaintCard) return;
  
  // Add slide-out animation
  complaintCard.style.animation = 'slideOutRight 0.5s ease-out forwards';
  
  // Wait for animation to complete
  setTimeout(() => {
    // Remove from State
    State.complaints = State.complaints.filter(c => c.id !== complaintId);
    State.save();
    
    // Re-render
    renderComplaints();
    
    Toast.show('Complaint resolved successfully!', 'success');
  }, 500);
};

// ============================================
// LOST & FOUND - WITH IMAGE PREVIEW & CLAIM
// ============================================

function initializeLostAndFound() {
  renderLostAndFound();
  
  const reportItemBtn = document.getElementById('reportItemBtn');
  const reportItemModal = document.getElementById('reportItemModal');
  const closeReportModal = document.getElementById('closeReportModal');
  const reportItemForm = document.getElementById('reportItemForm');
  const itemImageInput = document.getElementById('itemImage');
  const imagePreview = document.getElementById('imagePreview');
  const fileUploadArea = document.getElementById('fileUploadArea');
  
  if (reportItemBtn) {
    reportItemBtn.addEventListener('click', () => {
      reportItemModal.classList.add('active');
    });
  }
  
  if (closeReportModal) {
    closeReportModal.addEventListener('click', () => {
      reportItemModal.classList.remove('active');
    });
  }
  
  reportItemModal?.addEventListener('click', (e) => {
    if (e.target === reportItemModal) {
      reportItemModal.classList.remove('active');
    }
  });
  
  // IMAGE PREVIEW WITH FILEREADER - HACKATHON FEATURE
  if (itemImageInput) {
    itemImageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        Toast.show('Please select an image file', 'error');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        Toast.show('Image must be less than 5MB', 'error');
        return;
      }
      
      // Use FileReader for instant preview
      const reader = new FileReader();
      
      reader.onload = function(event) {
        imagePreview.innerHTML = `
          <div style="position: relative;">
            <img src="${event.target.result}" alt="Preview" style="width: 100%; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
            <div style="position: absolute; top: 10px; right: 10px; background: rgba(16, 185, 129, 0.9); color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
              ✓ Ready to upload
            </div>
          </div>
        `;
        imagePreview.classList.add('active');
        imagePreview.style.marginTop = '1rem';
      };
      
      reader.onerror = function() {
        Toast.show('Failed to read image file', 'error');
      };
      
      reader.readAsDataURL(file);
    });
  }
  
  // Drag and drop support
  if (fileUploadArea) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      fileUploadArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
      fileUploadArea.addEventListener(eventName, () => {
        fileUploadArea.style.borderColor = '#6366f1';
        fileUploadArea.style.background = 'rgba(99, 102, 241, 0.1)';
      });
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
      fileUploadArea.addEventListener(eventName, () => {
        fileUploadArea.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        fileUploadArea.style.background = 'transparent';
      });
    });
    
    fileUploadArea.addEventListener('drop', (e) => {
      const file = e.dataTransfer.files[0];
      if (file) {
        itemImageInput.files = e.dataTransfer.files;
        itemImageInput.dispatchEvent(new Event('change'));
      }
    });
  }
  
  if (reportItemForm) {
    reportItemForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const file = itemImageInput.files[0];
      if (!file) {
        Toast.show('Please upload an image', 'error');
        return;
      }
      
      // Use FileReader to convert image to base64
      const reader = new FileReader();
      reader.onload = function(event) {
        const newItem = {
          id: Date.now(),
          name: document.getElementById('itemName').value,
          category: document.getElementById('itemCategory').value,
          location: document.getElementById('itemLocation').value,
          description: document.getElementById('itemDescription').value,
          imageUrl: event.target.result, // Base64 image data
          contactInfo: document.getElementById('contactInfo').value,
          foundDate: new Date().toISOString(),
          foundBy: State.user.studentId,
          finderName: State.user.fullName
        };
        
        State.lostAndFound.unshift(newItem);
        State.save();
        
        reportItemModal.classList.remove('active');
        reportItemForm.reset();
        imagePreview.classList.remove('active');
        imagePreview.innerHTML = '';
        renderLostAndFound();
        
        Toast.show('Item reported successfully! Other students can now see it.', 'success');
      };
      
      reader.readAsDataURL(file);
    });
  }
}

function renderLostAndFound() {
  const gallery = document.getElementById('lostFoundGallery');
  
  if (!gallery) return;
  
  // Update stats
  const totalItemsEl = document.getElementById('totalItems');
  const helpedStudentsEl = document.getElementById('helpedStudents');
  
  if (totalItemsEl) totalItemsEl.textContent = State.lostAndFound.length;
  if (helpedStudentsEl) {
    // Simulate helped students count
    helpedStudentsEl.textContent = Math.floor(State.lostAndFound.length * 0.75);
  }
  
  if (State.lostAndFound.length === 0) {
    gallery.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 1rem">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <h3>No items reported yet</h3>
        <p>Be the first to help someone find their lost item!</p>
      </div>
    `;
    return;
  }
  
  gallery.innerHTML = State.lostAndFound.map(item => {
    const date = new Date(item.foundDate);
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
    
    return `
      <div class="lost-item-card">
        <div class="item-image-wrapper">
          <img src="${item.imageUrl}" alt="${item.name}" class="item-image" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
          <div class="item-category-badge">${item.category}</div>
        </div>
        <div class="item-content">
          <h3 class="item-title">${item.name}</h3>
          <p class="item-description">${item.description}</p>
          
          <div class="item-details">
            <div class="item-location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>${item.location}</span>
            </div>
            <div class="item-date">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>${formattedDate}</span>
            </div>
          </div>
          
          <button class="btn-claim" onclick="claimItem(${item.id})">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            Claim This Item
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// CLAIM ITEM FUNCTION - HACKATHON FEATURE
window.claimItem = function(itemId) {
  const item = State.lostAndFound.find(i => i.id === itemId);
  if (!item) return;
  
  // Create modal for claim confirmation
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Claim Item: ${item.name}</h3>
        <button class="modal-close" onclick="this.closest('.modal').remove()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <div style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #6366f1;">Contact Information</h4>
          <p style="margin: 0 0 8px 0;"><strong>Found by:</strong> ${item.finderName || 'Student'}</p>
          <p style="margin: 0;"><strong>Contact:</strong> ${item.contactInfo}</p>
        </div>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">
          Please reach out to the finder to arrange a pickup. Make sure to describe the item accurately to verify ownership.
        </p>
        <div style="display: flex; gap: 10px;">
          <a href="mailto:${item.contactInfo}" class="btn-primary" style="flex: 1; text-align: center; text-decoration: none;">
            Send Email
          </a>
          <button class="btn-secondary" style="flex: 1;" onclick="this.closest('.modal').remove()">
            Close
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  Toast.show('Contact details revealed! Reach out to claim your item.', 'info', 4000);
};

// ============================================
// TAB NAVIGATION
// ============================================

function initializeTabs() {
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  const tabContents = document.querySelectorAll('.tab-content');
  
  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabName = item.getAttribute('data-tab');
      
      // Remove active class from all
      sidebarItems.forEach(i => i.classList.remove('active'));
      tabContents.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked
      item.classList.add('active');
      document.getElementById(`${tabName}Tab`).classList.add('active');
    });
  });
}

// ============================================
// MOBILE MENU (for home page)
// ============================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
}

// ============================================
// SMOOTH SCROLL (for home page)
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Close mobile menu if open
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          hamburger.classList.remove('active');
        }
      }
    }
  });
});

// ============================================
// ANIMATIONS ON SCROLL
// ============================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'all 0.6s ease-out';
  observer.observe(el);
});

// ============================================
// CONSOLE BRANDING
// ============================================

console.log('%c🎓 UniPulse Smart Campus 2026 - HACKATHON EDITION', 'background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 12px 24px; border-radius: 8px; font-size: 18px; font-weight: bold;');
console.log('%c✨ Complete Auth Flow | Live Classroom Status | Complaint Resolution | Image Preview', 'color: #94a3b8; font-size: 13px; font-weight: 600; margin-top: 8px;');
console.log('%c🚀 State-Driven Architecture with localStorage Persistence', 'color: #10b981; font-size: 12px;');

// ===== CSV Classroom Upload =====

csvUpload.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        const text = event.target.result;
        loadClassroomsFromCSV(text);
    };
    reader.readAsText(file);
});

function loadClassroomsFromCSV(csvText) {
    const lines = csvText.trim().split("\n");
    const headers = lines[0].split(",");

    const classrooms = [];

    for (let i = 1; i < lines.length; i++) {
        const data = lines[i].split(",");
        const classroom = {
            room: data[0],
            capacity: data[1],
            status: data[2]
        };
        classrooms.push(classroom);
    }

    renderClassrooms(classrooms);
    updateClassroomStats(classrooms);
}

function renderClassrooms(classrooms) {
    classroomsGrid.innerHTML = "";

    classrooms.forEach(c => {
        const card = document.createElement("div");
        card.className = "classroom-card";

        card.innerHTML = `
            <h3>${c.room}</h3>
            <p>Capacity: ${c.capacity}</p>
            <span class="status ${c.status === "Available" ? "status-available" : "status-occupied"}">
                ${c.status}
            </span>
        `;

        classroomsGrid.appendChild(card);
    });
}
/* ===============================
   SMART CLASSROOM CSV FEATURE
================================ */

if (csvUpload) {
    csvUpload.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            parseClassroomCSV(event.target.result);
        };
        reader.readAsText(file);
    });
}

function parseClassroomCSV(csvText) {
    const lines = csvText.trim().split("\n");
    const headers = lines[0].split(",").map(h => h.trim());

    const classrooms = lines.slice(1).map((line, index) => {
        const values = line.split(",").map(v => v.trim());
        const row = {};

        headers.forEach((h, i) => row[h] = values[i]);

        return {
            id: Date.now() + index,
            room: row.room,
            capacity: Number(row.capacity),
            status: row.status
        };
    });

    State.classrooms = classrooms;
    State.save();

    renderClassrooms();
    updateClassroomStats();
}

function renderClassrooms() {
      classroomsGrid.innerHTML = "";
    if (!classroomsGrid) return;

    classroomsGrid.innerHTML = "";

    if (State.classrooms.length === 0) {
        classroomsGrid.innerHTML = "<p>No classroom data uploaded.</p>";
        return;
    }

    State.classrooms.forEach(c => {
        const card = document.createElement("div");
        card.className = "classroom-card";

        card.innerHTML = `
            <h3>${c.room}</h3>
            <p>Capacity: ${c.capacity}</p>
            <span class="status ${
                c.status === "Available"
                    ? "status-available"
                    : "status-occupied"
            }">${c.status}</span>
        `;

        classroomsGrid.appendChild(card);
    });
}

function updateClassroomStats() {
    const available = State.classrooms.filter(c => c.status === "Available").length;
    const occupied = State.classrooms.filter(c => c.status === "Occupied").length;

    if (availableRoomsEl) availableRoomsEl.innerText = available;
    if (occupiedRoomsEl) occupiedRoomsEl.innerText = occupied;
}


