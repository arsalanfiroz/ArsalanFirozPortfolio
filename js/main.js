/**
 * ARSALAN FIROZ - PORTFOLIO INTERACTIVITY
 * System Design Visualizer, Certificate Lightbox, Terminal CLI, Filters, Metrics Counter
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMetricsCounter();
  initSystemDesignLab();
  initProjectsFilter();
  initCertificates();
  initTerminalCLI();
  initCopyButtons();
  initContactForm();
});

/* ==========================================================================
   NAVBAR & SCROLL SPY
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy
    let current = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = navMenu.style.display === 'flex';
      navMenu.style.display = isExpanded ? 'none' : 'flex';
      if (!isExpanded) {
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '72px';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.background = 'rgba(7, 9, 14, 0.98)';
        navMenu.style.padding = '1.5rem';
        navMenu.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navMenu.style.display = 'none';
        }
      });
    });
  }
}

/* ==========================================================================
   METRICS COUNTER ANIMATION
   ========================================================================== */
function initMetricsCounter() {
  const metricElements = document.querySelectorAll('.metric-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        metricElements.forEach(el => {
          const target = parseFloat(el.getAttribute('data-target'));
          const suffix = el.getAttribute('data-suffix') || '';
          const prefix = el.getAttribute('data-prefix') || '';
          const isDecimal = target % 1 !== 0;
          let current = 0;
          const increment = target / 40;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
              el.textContent = `${prefix}${isDecimal ? current.toFixed(1) : Math.round(current)}${suffix}`;
            } else {
              el.textContent = `${prefix}${isDecimal ? current.toFixed(1) : Math.round(current)}${suffix}`;
            }
          }, 30);
        });
      }
    });
  }, { threshold: 0.25 });

  const metricsSection = document.querySelector('.metrics-section');
  if (metricsSection) {
    observer.observe(metricsSection);
  }
}

/* ==========================================================================
   INTERACTIVE SYSTEM DESIGN LAB & ARCHITECTURE SIMULATOR
   ========================================================================== */
const ARCHITECTURES = {
  urlshortener: {
    title: "High-Throughput URL Shortener at Scale",
    statusText: "Architecture: CQRS + Base62 + Redis Cache-Aside + Consistent Hashing",
    nodes: [
      {
        id: "client",
        name: "Client Traffic",
        tech: "HTTP / Web / Mobile",
        metric: "100k+ req/sec",
        description: "User requests arriving from global web & mobile apps. Reads outnumber writes by ~100:1.",
        tradeoff: "High read-to-write ratio mandates aggressive edge and in-memory caching layers.",
        productionNote: "Requires TLS termination, gzip/brotli compression, and Keep-Alive connection pooling."
      },
      {
        id: "gateway",
        name: "API Gateway & Limiter",
        tech: "Token Bucket / Envoy",
        metric: "Sliding Window",
        description: "Authenticates requests, enforces IP rate limiting (OTP / fraud controls), and prevents service degradation.",
        tradeoff: "Centralized rate limiting requires fast shared state (Redis) or distributed token buckets.",
        productionNote: "Prevents DDoS and scrapers; reduces fraudulent bursts by 95%."
      },
      {
        id: "cache",
        name: "Distributed Cache",
        tech: "Redis Cluster / RAM",
        metric: "1.2ms latency (99% hit)",
        description: "Cache-aside pattern. Frequently requested short codes are returned in sub-2ms directly from in-memory RAM.",
        tradeoff: "Cache stampede prevention requires probabilistic early expiration or distributed mutex locks.",
        productionNote: "Eviction policy configured with volatile-lru to maximize memory efficiency."
      },
      {
        id: "shards",
        name: "Primary DB & Shards",
        tech: "MySQL / Consistent Hash",
        metric: "Base62 Indexed",
        description: "Relational persistence with short code unique index. Distributed across shards via consistent hashing with virtual nodes.",
        tradeoff: "Sharding enables linear write scaling, but cross-shard queries become expensive.",
        productionNote: "Consistent hashing ring minimizes data remapping when adding or rebalancing shards."
      },
      {
        id: "replicas",
        name: "Read Replicas & CQRS",
        tech: "Async Binlog Sync",
        metric: "35ms read fallback",
        description: "Command Query Responsibility Segregation (CQRS) splits writes to Primary DB and routes queries across Read Replicas.",
        tradeoff: "Eventual consistency: read replicas may experience slight replication lag (~10-50ms).",
        productionNote: "Utilized read replicas to absorb peak read traffic and ensure 99.99% system availability."
      }
    ],
    defaultMetrics: {
      latency: "1.4 ms",
      cacheHit: "98.8%",
      availability: "99.99%",
      throughput: "120k RPS"
    }
  },
  ragpipeline: {
    title: "Enterprise Hybrid RAG & Knowledge Worker",
    statusText: "Architecture: Dense Embeddings + BM25 + DuckDB SQL + Local Ollama",
    nodes: [
      {
        id: "ingestion",
        name: "Multi-Format Ingestion",
        tech: "pypdf / docx / markdown",
        metric: "Paragraph Chunking",
        description: "Extracts text from unstructured PDFs, Word docs, CSVs, and markdown with recursive paragraph-aware chunking and overlap preservation.",
        tradeoff: "Smaller chunks preserve semantic precision; larger chunks retain contextual coherence.",
        productionNote: "Chunk overlap of 15% prevents contextual cliff errors during semantic lookup."
      },
      {
        id: "hybrid_search",
        name: "Hybrid Retrieval",
        tech: "FastEmbed + BM25",
        metric: "BAAI/bge-small-en-v1.5",
        description: "Combines dense vector embeddings (via ONNX runtime) with sparse lexical BM25 keyword matching using Reciprocal Rank Fusion (RRF).",
        tradeoff: "Hybrid search solves the vector out-of-vocabulary and exact code/serial-number search weakness.",
        productionNote: "Runs completely offline without external SaaS embedding latency or recurring API costs."
      },
      {
        id: "intent_router",
        name: "Heuristic Query Router",
        tech: "Intent Classification",
        metric: "Doc vs SQL Analytics",
        description: "Analyzes incoming user query: routes unstructured questions to Document RAG, and tabular aggregations to embedded DuckDB SQL.",
        tradeoff: "Lightweight rule/heuristic classifier has 0ms LLM overhead vs an LLM routing agent.",
        productionNote: "Ensures financial metrics and employee queries execute via exact SQL rather than probabilistic generation."
      },
      {
        id: "duckdb_sql",
        name: "DuckDB In-Process SQL",
        tech: "Columnar OLAP",
        metric: "Vectorized Execution",
        description: "High-speed embedded SQL database querying employee directories, financial KPIs, sales pipelines, and cloud expenditures.",
        tradeoff: "Embedded execution avoids network hops; best suited for read-heavy analytical workloads.",
        productionNote: "Processes multi-million row aggregations in single-digit milliseconds in-memory."
      },
      {
        id: "ollama_guardrail",
        name: "Local LLM & Guardrails",
        tech: "Ollama / Qwen / Llama",
        metric: "Grounding & Citations",
        description: "Synthesizes responses with anti-hallucination guardrails, attributing every claim with document title, chunk ID, and source excerpts.",
        tradeoff: "Local models provide total data privacy and zero API bills, but require modest GPU/RAM resources.",
        productionNote: "Guarantees corporate proprietary data never leaves internal infrastructure."
      }
    ],
    defaultMetrics: {
      latency: "420 ms",
      cacheHit: "94.2%",
      availability: "100% Offline",
      throughput: "Local Inference"
    }
  }
};

let currentArchKey = 'urlshortener';
let activeSimulationTimer = null;

function initSystemDesignLab() {
  const tabButtons = document.querySelectorAll('.lab-tab-btn');
  const simBtn = document.getElementById('run-sim-btn');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentArchKey = btn.getAttribute('data-arch');
      renderArchitectureStage(currentArchKey);
    });
  });

  if (simBtn) {
    simBtn.addEventListener('click', () => {
      runTrafficSimulation();
    });
  }

  // Initial render
  renderArchitectureStage(currentArchKey);
}

function renderArchitectureStage(archKey) {
  const arch = ARCHITECTURES[archKey];
  const stage = document.getElementById('architecture-flow-canvas');
  const statusTag = document.getElementById('sim-status-tag');
  
  if (statusTag) {
    statusTag.textContent = arch.statusText;
  }

  if (!stage) return;
  stage.innerHTML = '';

  arch.nodes.forEach((node, index) => {
    // Create Node element
    const nodeEl = document.createElement('div');
    nodeEl.className = 'flow-node';
    nodeEl.id = `node-${node.id}`;
    nodeEl.setAttribute('data-node-id', node.id);

    nodeEl.innerHTML = `
      <div class="node-icon-box">
        ${getNodeIcon(node.id)}
      </div>
      <div class="node-title">${node.name}</div>
      <div class="node-tech">${node.tech}</div>
      <div class="node-metric">${node.metric}</div>
    `;

    nodeEl.addEventListener('click', () => {
      selectNode(archKey, node.id);
    });

    stage.appendChild(nodeEl);

    // Add connector if not the last node
    if (index < arch.nodes.length - 1) {
      const connEl = document.createElement('div');
      connEl.className = 'flow-connector';
      connEl.id = `conn-${index}`;
      connEl.innerHTML = `
        <span>Sync</span>
        <div class="connector-line"></div>
      `;
      stage.appendChild(connEl);
    }
  });

  // Select first node by default
  selectNode(archKey, arch.nodes[0].id);

  // Update metrics panel
  updateInspectorMetrics(arch.defaultMetrics);
}

function getNodeIcon(id) {
  const icons = {
    client: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    gateway: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    cache: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
    shards: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
    replicas: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    ingestion: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
    hybrid_search: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    intent_router: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>`,
    duckdb_sql: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`,
    ollama_guardrail: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-2h2zm0-4h-2V7h2z"/></svg>`
  };
  return icons[id] || `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>`;
}

function selectNode(archKey, nodeId) {
  const arch = ARCHITECTURES[archKey];
  const node = arch.nodes.find(n => n.id === nodeId);
  if (!node) return;

  // Visual selection
  document.querySelectorAll('.flow-node').forEach(el => el.classList.remove('selected'));
  const currentEl = document.getElementById(`node-${nodeId}`);
  if (currentEl) currentEl.classList.add('selected');

  // Update Inspector Title & Content
  const titleEl = document.getElementById('inspector-title');
  const descEl = document.getElementById('inspector-desc');
  const tradeoffEl = document.getElementById('inspector-tradeoff');
  const prodNoteEl = document.getElementById('inspector-prodnote');

  if (titleEl) titleEl.innerHTML = `${node.name} <span class="tag-badge">${node.tech}</span>`;
  if (descEl) descEl.textContent = node.description;
  if (tradeoffEl) tradeoffEl.textContent = node.tradeoff;
  if (prodNoteEl) prodNoteEl.textContent = node.productionNote;
}

function updateInspectorMetrics(metrics) {
  const m1 = document.getElementById('ins-metric-1');
  const m2 = document.getElementById('ins-metric-2');
  const m3 = document.getElementById('ins-metric-3');

  if (m1) m1.textContent = metrics.latency;
  if (m2) m2.textContent = metrics.cacheHit;
  if (m3) m3.textContent = metrics.throughput;
}

function runTrafficSimulation() {
  if (activeSimulationTimer) clearTimeout(activeSimulationTimer);

  const arch = ARCHITECTURES[currentArchKey];
  const simBtn = document.getElementById('run-sim-btn');
  if (simBtn) {
    simBtn.disabled = true;
    simBtn.innerHTML = `Simulating...`;
  }

  const nodes = arch.nodes;
  let step = 0;

  function executeStep() {
    // Clear prev animations
    document.querySelectorAll('.flow-node').forEach(n => n.classList.remove('active-packet'));
    document.querySelectorAll('.connector-line').forEach(c => c.classList.remove('flowing'));

    if (step < nodes.length) {
      const nodeEl = document.getElementById(`node-${nodes[step].id}`);
      if (nodeEl) nodeEl.classList.add('active-packet');

      // Also activate connector line leading to next
      const connEl = document.querySelector(`#conn-${step} .connector-line`);
      if (connEl) connEl.classList.add('flowing');

      selectNode(currentArchKey, nodes[step].id);

      step++;
      activeSimulationTimer = setTimeout(executeStep, 750);
    } else {
      // Completed simulation
      if (simBtn) {
        simBtn.disabled = false;
        simBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          Simulate Request Flow
        `;
      }
      showToast('Simulation complete: 0 drops, optimal p99 latency verified!');
    }
  }

  executeStep();
}

/* ==========================================================================
   PROJECTS FILTER
   ========================================================================== */
function initProjectsFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   LICENSES & CERTIFICATIONS (GALLERY + LIGHTBOX MODAL)
   ========================================================================== */
const CERTIFICATES_DATA = [
  {
    id: "aws-solutions-architect",
    title: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services (AWS)",
    issueDate: "Oct 14, 2021",
    category: "cloud",
    image: "assets/certificates/aws-solutions-architect.jpg",
    credentialId: "NT4R9X1JEMBQQC3N",
    skills: "High Availability, S3, EC2, VPC, Distributed Systems, Cloud Architecture, Load Balancing"
  },
  {
    id: "oracle-cloud-architect",
    title: "Oracle Cloud Infrastructure 2021 Certified Architect Associate",
    issuer: "Oracle University",
    issueDate: "Oct 25, 2021",
    category: "cloud",
    image: "assets/certificates/oracle-cloud-architect.jpg",
    credentialId: "288049144OCIAA2021CA",
    skills: "OCI Networking, Cloud Compute, Storage Solutions, Identity & Access Management"
  },
  {
    id: "ai-engineer-core-track",
    title: "AI Engineer Core Track: LLM Engineering, RAG, QLoRA, Agents",
    issuer: "Udemy (Instructors: Ligency, Ed Donner)",
    issueDate: "Oct 26, 2026",
    category: "genai",
    image: "assets/certificates/ai-engineer-core-track-udemy.jpg",
    credentialId: "UC-901b3b35c-8b6f-4ca1-9d5e-5232d468a113",
    skills: "33.5 Hours, Retrieval-Augmented Generation, AI Agents, Fine-Tuning QLoRA, Vector Search"
  },
  {
    id: "anthropic-claude-code",
    title: "Claude Code in Action",
    issuer: "Anthropic",
    issueDate: "March 10, 2026",
    category: "genai",
    image: "assets/certificates/anthropic-claude-code.jpg",
    credentialId: "nmp9pkwz4g2e",
    skills: "AI-Assisted Engineering, Agentic Tool Use, Codebase Navigation, LLM Prompting"
  },
  {
    id: "databricks-genai",
    title: "Generative AI Fundamentals",
    issuer: "Databricks Academy",
    issueDate: "July 16, 2025",
    category: "genai",
    image: "assets/certificates/databricks-genai-fundamentals.jpg",
    credentialId: "1765_3_1027773_1752685326",
    skills: "LLM Evaluation, RAG Fundamentals, Vector Embeddings, Responsible AI"
  },
  {
    id: "chatgpt-prompt-eng",
    title: "ChatGPT Prompt Engineering for Developers",
    issuer: "DeepLearning.AI & OpenAI",
    issueDate: "July 16, 2025",
    category: "genai",
    image: "assets/certificates/chatgpt-prompt-engineering.jpg",
    credentialId: "DeepLearning-PromptEng-2025",
    skills: "Iterative Prompting, Summarization, Inferring, Transforming, Chatbot Expansion"
  },
  {
    id: "linkedin-gpts",
    title: "Hands-On AI: Build Your Own GPTs",
    issuer: "LinkedIn Learning",
    issueDate: "Oct 11, 2025",
    category: "genai",
    image: "assets/certificates/linkedin-build-your-own-gpts.jpg",
    credentialId: "PMI Registered 4101",
    skills: "Custom GPTs, System Instructions, Knowledge Uploads, Action APIs"
  },
  {
    id: "github-copilot",
    title: "GitHub Copilot Beginner to Pro: AI for Coding & Development",
    issuer: "Udemy (Instructor: Tom Phillips)",
    issueDate: "Oct 19, 2024",
    category: "genai",
    image: "assets/certificates/github-copilot-udemy.jpg",
    credentialId: "UC-fd71ff03-736c-4c4f-805e-e26e6f3c8f8b",
    skills: "Developer Velocity, AI Unit Testing, Code Refactoring, Inline AI Autocomplete"
  },
  {
    id: "hackerrank-swe",
    title: "Software Engineer Role Certification",
    issuer: "HackerRank",
    issueDate: "Apr 25, 2025",
    category: "swe",
    image: "assets/certificates/hackerrank-software-engineer.jpg",
    credentialId: "523dd0bc33d9",
    skills: "Problem Solving, Data Structures & Algorithms, Design Patterns, Code Quality"
  },
  {
    id: "hackerrank-sql",
    title: "SQL (Intermediate) Certificate",
    issuer: "HackerRank",
    issueDate: "Apr 26, 2025",
    category: "swe",
    image: "assets/certificates/hackerrank-sql-intermediate.jpg",
    credentialId: "bff80bf2fbf7",
    skills: "Complex Joins, Window Functions, Subqueries, Aggregations, Performance Tuning"
  },
  {
    id: "hackerrank-rest-api",
    title: "REST API (Intermediate) Certificate",
    issuer: "HackerRank",
    issueDate: "Apr 26, 2025",
    category: "swe",
    image: "assets/certificates/hackerrank-rest-api-intermediate.jpg",
    credentialId: "de0f702ed43e",
    skills: "HTTP Methods, Status Codes, API Pagination, Data Filtering, RESTful Best Practices"
  },
  {
    id: "hackerrank-javascript",
    title: "JavaScript (Intermediate) Certificate",
    issuer: "HackerRank",
    issueDate: "Apr 26, 2025",
    category: "swe",
    image: "assets/certificates/hackerrank-javascript-intermediate.jpg",
    credentialId: "515dcc7df8af",
    skills: "Asynchronous JS, Promises, Closures, Event Loop, Object Prototypes"
  },
  {
    id: "postman-api-expert",
    title: "Postman API Fundamentals Student Expert",
    issuer: "Postman",
    issueDate: "Jan 2025",
    category: "swe",
    image: "assets/certificates/postman-api-student-expert.jpg",
    credentialId: "67840d838beb4948d1613a30",
    skills: "API Testing, Automated Test Scripts, Mock Servers, API Documentation"
  },
  {
    id: "linux-kernel-lfd103",
    title: "LFD103: A Beginner's Guide to Linux Kernel Development",
    issuer: "The Linux Foundation",
    issueDate: "Dec 2022",
    category: "swe",
    image: "assets/certificates/linux-foundation-kernel-lfd103.jpg",
    credentialId: "LFD103-Linux-Foundation",
    skills: "Linux Kernel Subsystems, Git Patching, Low-Level Systems, OS Fundamentals"
  },
  {
    id: "sdlc-overview",
    title: "SDLC Overview - Software Development Life Cycle",
    issuer: "Udemy",
    issueDate: "May 5, 2025",
    category: "swe",
    image: "assets/certificates/sdlc-overview-udemy.jpg",
    credentialId: "UC-b02a2b31-c9d1-4cdb-8391-943826c4f00d",
    skills: "Agile, Waterfall, CI/CD Pipelines, QA Testing, Production Deployment Cycles"
  }
];

function initCertificates() {
  const certGrid = document.getElementById('cert-grid');
  const certFilterBtns = document.querySelectorAll('.cert-filter-btn');
  const modalBackdrop = document.getElementById('cert-modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  // Render cards
  if (certGrid) {
    certGrid.innerHTML = '';
    CERTIFICATES_DATA.forEach(cert => {
      const card = document.createElement('div');
      card.className = `cert-card cert-item-${cert.category}`;
      card.setAttribute('data-category', cert.category);
      card.innerHTML = `
        <div class="cert-thumb-wrap">
          <img src="${cert.image}" alt="${cert.title}" loading="lazy">
          <div class="cert-overlay">
            <span class="cert-overlay-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              View Credential
            </span>
          </div>
        </div>
        <div class="cert-info">
          <span class="cert-issuer">${cert.issuer}</span>
          <h4 class="cert-name">${cert.title}</h4>
          <div class="cert-meta-row">
            <span>${cert.issueDate}</span>
            <span class="mono">${cert.category.toUpperCase()}</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        openCertModal(cert);
      });

      certGrid.appendChild(card);
    });
  }

  // Filter functionality
  certFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      certFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat');
      const allCards = document.querySelectorAll('.cert-card');

      allCards.forEach(card => {
        const itemCat = card.getAttribute('data-category');
        if (cat === 'all' || itemCat === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal close listeners
  if (modalCloseBtn && modalBackdrop) {
    modalCloseBtn.addEventListener('click', () => {
      modalBackdrop.classList.remove('open');
    });

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        modalBackdrop.classList.remove('open');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
        modalBackdrop.classList.remove('open');
      }
    });
  }
}

function openCertModal(cert) {
  const modalBackdrop = document.getElementById('cert-modal-backdrop');
  const modalImg = document.getElementById('modal-cert-img');
  const modalTitle = document.getElementById('modal-cert-title');
  const modalIssuer = document.getElementById('modal-cert-issuer');
  const modalSkills = document.getElementById('modal-cert-skills');
  const modalId = document.getElementById('modal-cert-id');

  if (modalImg) modalImg.src = cert.image;
  if (modalTitle) modalTitle.textContent = cert.title;
  if (modalIssuer) modalIssuer.textContent = `${cert.issuer} • Issued: ${cert.issueDate}`;
  if (modalSkills) modalSkills.textContent = `Skills: ${cert.skills}`;
  if (modalId) modalId.textContent = cert.credentialId ? `ID: ${cert.credentialId}` : 'Verified Credential';

  if (modalBackdrop) {
    modalBackdrop.classList.add('open');
  }
}

/* ==========================================================================
   INTERACTIVE CLI TERMINAL EMULATOR
   ========================================================================== */
function initTerminalCLI() {
  const cliInput = document.getElementById('cli-input');
  const cliHistory = document.getElementById('cli-history');
  const terminalWindow = document.querySelector('.terminal-window');

  if (!cliInput || !cliHistory) return;

  const commandHistoryList = [];
  let historyIdx = -1;

  cliInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const command = cliInput.value.trim().toLowerCase();
      if (command) {
        commandHistoryList.push(command);
        historyIdx = commandHistoryList.length;
        processTerminalCommand(command, cliHistory);
      }
      cliInput.value = '';
      terminalWindow.scrollTop = terminalWindow.scrollHeight;
    } else if (e.key === 'ArrowUp') {
      if (historyIdx > 0) {
        historyIdx--;
        cliInput.value = commandHistoryList[historyIdx];
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIdx < commandHistoryList.length - 1) {
        historyIdx++;
        cliInput.value = commandHistoryList[historyIdx];
      } else {
        historyIdx = commandHistoryList.length;
        cliInput.value = '';
      }
    }
  });
}

function processTerminalCommand(cmd, container) {
  // Add input row to history
  const promptRow = document.createElement('div');
  promptRow.className = 'terminal-line';
  promptRow.innerHTML = `<span class="cli-prompt">arsalan@engine:~$</span> <span>${escapeHtml(cmd)}</span>`;
  container.appendChild(promptRow);

  const responseRow = document.createElement('div');
  responseRow.className = 'terminal-output';

  switch (cmd) {
    case 'help':
      responseRow.innerHTML = `
        <div style="color: #38bdf8; margin-bottom: 0.35rem;">Available CLI Commands:</div>
        <div>▸ <span class="metric-highlight">skills</span>       : View languages, backend, databases, GenAI stack</div>
        <div>▸ <span class="metric-highlight">experience</span>   : View tenure at FPLE SDN BHD & Cognizant</div>
        <div>▸ <span class="metric-highlight">projects</span>     : Deep dive into RAG, BrandSynth AI & Microservices</div>
        <div>▸ <span class="metric-highlight">certs</span>        : Overview of 15 industry certifications</div>
        <div>▸ <span class="metric-highlight">system-design</span>: Breakdown of URL Shortener & RAG architecture</div>
        <div>▸ <span class="metric-highlight">links</span>        : LeetCode, GitHub, LinkedIn profiles</div>
        <div>▸ <span class="metric-highlight">resume</span>       : Download Arsalan's official PDF resume</div>
        <div>▸ <span class="metric-highlight">contact</span>      : Email, phone, and Bengaluru coordinates</div>
        <div>▸ <span class="metric-highlight">sudo hire</span>    : Run automated hiring pipeline</div>
        <div>▸ <span class="metric-highlight">clear</span>        : Wipe terminal scrollback</div>
      `;
      break;

    case 'skills':
      responseRow.innerHTML = `
        <div><strong style="color:#60a5fa">Languages:</strong> TypeScript, JavaScript, Python, Java, SQL</div>
        <div><strong style="color:#34d399">Backend:</strong> Node.js, Express, FastAPI, REST, GraphQL, gRPC, WebSocket</div>
        <div><strong style="color:#fbbf24">Distributed:</strong> System Design, Kafka, Message Queues, CQRS, Sharding, Caching</div>
        <div><strong style="color:#a78bfa">Databases:</strong> MySQL, PostgreSQL, MongoDB, Redis, DuckDB</div>
        <div><strong style="color:#f472b6">GenAI/LLM:</strong> RAG, LangChain, LangGraph, Ollama, ONNX, Embeddings, Claude/GPT APIs</div>
        <div><strong style="color:#38bdf8">DevOps:</strong> AWS, Docker, Kubernetes, Jenkins, GitHub Actions, Linux</div>
      `;
      break;

    case 'experience':
      responseRow.innerHTML = `
        <div><strong style="color:#34d399">FPLE SDN BHD</strong> (May 2024 - Present) | Software Engineer</div>
        <div style="padding-left:10px">▸ Scaled backend microservices across 50+ domains in 10+ countries</div>
        <div style="padding-left:10px">▸ Payment gateway integrations: +30% payment success rate</div>
        <div style="padding-left:10px">▸ Fraud prevention controls: -95% fraudulent transaction attempts</div>
        <div style="padding-left:10px">▸ DB optimization: -50% failures, -35% query response times</div>
        <div style="margin-top:0.4rem"><strong style="color:#60a5fa">Cognizant</strong> (Jan 2022 - Apr 2024) | Software Engineer (Promoted)</div>
        <div style="padding-left:10px">▸ Built Trainee Management System & client-facing production REST APIs</div>
      `;
      break;

    case 'projects':
      responseRow.innerHTML = `
        <div>1. <strong style="color:#38bdf8">Enterprise RAG Knowledge Worker</strong>: Offline-first hybrid vector + BM25 + DuckDB SQL analytics + local Ollama inference.</div>
        <div>2. <strong style="color:#34d399">BrandSynth AI</strong>: Multi-LLM (OpenAI, Gemini, Claude, Groq) B2B brochure synthesizer and web scraper.</div>
        <div>3. <strong style="color:#fbbf24">Ticket Booking Microservices</strong>: Event-driven architecture with Kafka/Event Bus, Docker, Kubernetes, and JWT auth.</div>
      `;
      break;

    case 'certs':
      responseRow.innerHTML = `
        <div>Total: 15 Certified Credentials</div>
        <div>▸ AWS Solutions Architect – Associate (AWS)</div>
        <div>▸ Oracle Cloud Infrastructure Architect Associate (Oracle)</div>
        <div>▸ AI Engineer Core Track: LLM, RAG, QLoRA, Agents (Udemy - 33.5 hrs)</div>
        <div>▸ Claude Code in Action (Anthropic)</div>
        <div>▸ HackerRank: Software Engineer, SQL, REST API, JavaScript</div>
        <div>▸ Databricks GenAI Fundamentals & DeepLearning.AI Prompt Engineering</div>
      `;
      break;

    case 'system-design':
      responseRow.innerHTML = `
        <div style="color:#34d399">System Design Spotlight: URL Shortener at Scale (100k+ RPS)</div>
        <div>▸ <strong>Short Code Generator:</strong> Base62 encoding ([a-z, A-Z, 0-9])</div>
        <div>▸ <strong>Caching:</strong> Redis Cache-Aside pattern (sub-2ms reads)</div>
        <div>▸ <strong>CQRS:</strong> Separate read/write workloads with primary DB & read replicas</div>
        <div>▸ <strong>Sharding:</strong> Consistent hashing ring with virtual nodes for uniform distribution</div>
        <div>▸ <strong>Abuse Prevention:</strong> Token bucket rate limiter & IP reputation checks</div>
      `;
      break;

    case 'links':
    case 'socials':
      responseRow.innerHTML = `
        <div>▸ LeetCode : <a href="https://leetcode.com/u/arsalanfiroz/" target="_blank" style="color:#f59e0b">https://leetcode.com/u/arsalanfiroz/</a></div>
        <div>▸ GitHub   : <a href="https://github.com/arsalanfiroz" target="_blank" style="color:#cbd5e1">https://github.com/arsalanfiroz</a></div>
        <div>▸ LinkedIn : <a href="https://www.linkedin.com/in/arsalan-firoz/" target="_blank" style="color:#60a5fa">https://www.linkedin.com/in/arsalan-firoz/</a></div>
      `;
      break;

    case 'resume':
      responseRow.innerHTML = `<div>Initiating resume download... <a href="Arsalan_Firoz_Resume.pdf" download class="metric-highlight">Click here if download does not trigger</a>.</div>`;
      const link = document.createElement('a');
      link.href = 'Arsalan_Firoz_Resume.pdf';
      link.download = 'Arsalan_Firoz_Resume.pdf';
      link.click();
      break;

    case 'contact':
      responseRow.innerHTML = `
        <div>Email    : arsalanfiroz.work@gmail.com</div>
        <div>Phone    : +91 9060303684</div>
        <div>Location : Bengaluru, Karnataka, India</div>
      `;
      break;

    case 'sudo hire':
    case 'sudo hire arsalan':
      responseRow.innerHTML = `
        <div style="color:#34d399">SUCCESS: Offer generated with infinite upside! 🚀</div>
        <div>Matched Qualifications:</div>
        <div>[✓] High-throughput distributed systems experience (4.5+ years)</div>
        <div>[✓] Production fintech & payment gateway track record (50+ domains)</div>
        <div>[✓] GenAI / RAG / LLM agent practical engineering</div>
        <div>[✓] Clean code, system design ownership & mentorship mindset</div>
        <div>Sending calendar invitation to arsalanfiroz.work@gmail.com...</div>
      `;
      break;

    case 'clear':
      container.innerHTML = '';
      return;

    default:
      responseRow.innerHTML = `Command not recognized: "${escapeHtml(cmd)}". Type <span class="metric-highlight">help</span> for a list of available commands.`;
      break;
  }

  container.appendChild(responseRow);
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ==========================================================================
   COPY TO CLIPBOARD & TOAST
   ========================================================================== */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-trigger');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: "${textToCopy}"`);
        }).catch(() => {
          // Fallback
          showToast(`Copied: ${textToCopy}`);
        });
      }
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('portfolio-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'portfolio-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   CONTACT FORM HANDLER
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const msgInput = document.getElementById('form-message');

    if (!nameInput.value.trim() || !emailInput.value.trim() || !msgInput.value.trim()) {
      showToast('Please fill out all required fields.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Opening mail client...';
    }

    // Direct mailto link fallback
    const subject = encodeURIComponent(`Portfolio Inquiry from ${nameInput.value}`);
    const body = encodeURIComponent(`Hi Arsalan,\n\n${msgInput.value}\n\nBest regards,\n${nameInput.value} (${emailInput.value})`);
    
    window.location.href = `mailto:arsalanfiroz.work@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Message Prepared';
      }
      showToast('Opening default email client to send your message!');
      form.reset();
    }, 800);
  });
}
