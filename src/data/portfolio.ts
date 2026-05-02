export type SocialLink = {
  label: string;
  href: string;
};

export type FeaturedProject = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  links: {
    live?: string;
    repo?: string;
    caseStudy?: string;
  };
  highlights: string[];
  detail?: {
    problemOrGoal: string;
    whatIBuilt: string[];
    technicalDecisions: string[];
  };
  longform?: {
    summary: string;
    sections: Array<{ label: string; body: string }>;
  };
};

export type SkillItem = {
  icon?: string;
  label: string;
};

export type TimelineItem = {
  title: string;
  org: string;
  date: string;
  details: string[];
};

export const portfolio = {
  person: {
    name: "Omesh Sana",
    role: "Full stack developer and AI/ML engineer",
    location: "Prosper, TX (Dallas area)",
    tagline:
      "Computer Science student at UT Dallas building across frontend, backend, graphics/rendering, and database systems — with a bias for performance, interaction design, and technically deep delivery.",
  },
  contact: {
    email: "omesh.reddy18@gmail.com",
    calendly: "",
  },
  socials: [
    { label: "GitHub", href: "https://github.com/omesh-s" },
    { label: "LinkedIn", href: "https://linkedin.com/in/omesh-reddy-sana" },
  ] satisfies SocialLink[],
  about: {
    title: "About",
    paragraphs: [
      "I’m a Computer Science student at the University of Texas at Dallas (B.S., Aug 2023 – Dec 2026). I like problems that reward technical depth: fast user experiences, clean backend contracts, and systems that hold up under real usage.",
      "My work spans full-stack product builds, AI/ML integration, computer vision pipelines, and rendering/graphics concepts. I care about performance, interaction design, and building polished systems end-to-end.",
    ],
    bullets: [
      "Full-stack engineering: React/Next.js + FastAPI/Flask + SQLAlchemy + REST contracts",
      "AI/ML + CV: NLP classification, pose estimation (OpenPose/MediaPipe), time-series scoring",
      "Systems mindset: profiling, latency reduction, caching, and validation pipelines",
      "Graphics/rendering coursework + pipeline concepts applied in projects",
    ],
  },
  skills: {
    title: "Skills / Stack / Tools",
    groups: [
      {
        label: "Frameworks & UI",
        items: [
          { icon: "nextjs", label: "Next.js" },
          { icon: "react", label: "React" },
          { icon: "typescript", label: "TypeScript" },
          { icon: "tailwind", label: "Tailwind" },
          { icon: "gsap", label: "GSAP" },
          { icon: "framermotion", label: "Framer Motion" },
        ],
      },
      {
        label: "AI / ML",
        items: [
          { icon: "tensorflow", label: "TensorFlow" },
          { icon: "scikitlearn", label: "scikit-learn" },
          { icon: "opencv", label: "OpenCV" },
          { icon: "jupyter", label: "Jupyter" },
          { icon: "python", label: "NLP / CV Pipelines" },
        ],
      },
      {
        label: "Backend & APIs",
        items: [
          { icon: "fastapi", label: "FastAPI" },
          { icon: "flask", label: "Flask" },
          { icon: "spring", label: "Spring Boot" },
          { icon: "nodejs", label: "Node.js" },
        ],
      },
      {
        label: "Databases",
        items: [
          { icon: "postgres", label: "PostgreSQL" },
          { icon: "mysql", label: "MySQL" },
          { icon: "sqlite", label: "SQLite" },
        ],
      },
      {
        label: "Languages",
        items: [
          { icon: "python", label: "Python" },
          { icon: "typescript", label: "TypeScript" },
          { icon: "javascript", label: "JavaScript" },
          { icon: "java", label: "Java" },
          { icon: "cpp", label: "C++" },
          { icon: "c", label: "C" },
          { icon: "csharp", label: "C#" },
          { icon: "swift", label: "Swift" },
          { icon: "sql", label: "SQL" },
        ],
      },
      {
        label: "Tools & Platforms",
        items: [
          { icon: "git", label: "Git" },
          { icon: "github", label: "GitHub" },
          { icon: "docker", label: "Docker" },
          { icon: "linux", label: "Linux" },
          { icon: "vscode", label: "VS Code" },
          { icon: "figma", label: "Figma" },
          { icon: "gcp", label: "GCP" },
          { icon: "aws", label: "AWS" },
        ],
      },
    ],
  },
  projects: {
    title: "Featured projects",
    items: [
      {
        slug: "retail-data-quality-ai-agent",
        title: "Retail Data Quality AI Agent",
        description:
          "Agentic workflows on Google ADK and Gemini with BigQuery-backed facts, explainable anomaly handling, and evaluation loops for latency and cost.",
        tags: ["Python", "Google ADK", "Gemini", "BigQuery", "SQL"],
        links: {},
        highlights: [
          "Coupled agentic reasoning with deterministic validation for high-trust retail environments.",
          "Optimized the connective layer between frontier models and enterprise data warehouses.",
        ],
        detail: {
          problemOrGoal:
            "Retailers lose money when store-level data anomalies go unnoticed, which makes it hard to prove ROI from data pipelines.",
          whatIBuilt: [
            "Architected agentic workflows using Google ADK and Gemini function-calling for explainable anomaly handling.",
            "Integrated BigQuery facts and built evaluation loops to tune latency and cost-per-request.",
          ],
          technicalDecisions: [
            "Paired LLM reasoning with deterministic checks so outputs stay auditable in regulated retail contexts.",
            "Measured warehouse and model layers together to improve end-to-end pipeline economics, not just model quality.",
          ],
        },
        longform: {
          summary:
            "An agentic system that surfaces and explains retail data anomalies using Gemini and ADK, grounded in BigQuery and tuned with explicit latency and cost evaluation.",
          sections: [
            {
              label: "Agent design",
              body: "Used Google ADK and Gemini tool use to automate investigation and explanation of anomalies while keeping steps inspectable for operators.",
            },
            {
              label: "Data plane",
              body: "Connected enterprise facts in BigQuery so agents reason over the same warehouse metrics the business trusts, with SQL-backed validation where needed.",
            },
            {
              label: "Evaluation",
              body: "Ran evaluation loops targeting latency and cost per request so the stack stayed practical at production traffic and spend.",
            },
          ],
        },
      },
      {
        slug: "duck-pond-3d-engine",
        title: "The Duck Pond — 3D Graphics Engine",
        description:
          "Custom C++20 renderer demonstrating the full graphics pipeline with Gerstner waves, Snell refraction, buoyancy, and four rendering modes up to ray-traced scenes.",
        tags: ["C++20", "Eigen", "Numerical Methods", "Performance Optimization"],
        links: {},
        highlights: [
          "High-fidelity visuals via cache-aligned linear algebra and low-level performance tuning.",
          "Four rendering “lenses” from wireframes through complex ray-traced environments.",
        ],
        detail: {
          problemOrGoal:
            "Build a from-scratch 3D engine that shows the complete graphics pipeline with realistic water, refraction, and lighting.",
          whatIBuilt: [
            "High-performance C++20 renderer with stable wave and refraction solves using Eigen.",
            "Gerstner-wave dynamics, Snell’s Law refraction kernels, and buoyancy for 3D meshes.",
          ],
          technicalDecisions: [
            "Focused on numerical stability and SIMD-friendly, cache-aligned data layouts for hot math paths.",
            "Progressive complexity: four distinct rendering modes to validate each pipeline stage before adding costlier effects.",
          ],
        },
        longform: {
          summary:
            "A ground-up C++20 graphics engine emphasizing physically motivated water, refraction, and mesh interaction, optimized with Eigen and careful memory layout.",
          sections: [
            {
              label: "Rendering pipeline",
              body: "Implemented the full path from geometry through shading, evolving four distinct modes from wireframe to advanced ray-traced views.",
            },
            {
              label: "Simulation",
              body: "Built Gerstner waves, Snell refraction, and buoyancy so scenes behave convincingly rather than relying on baked approximations alone.",
            },
            {
              label: "Performance",
              body: "Tuned cache-aligned algebra and low-level details so numerical solves stay stable without sacrificing frame budget.",
            },
          ],
        },
      },
      {
        slug: "sentence-builder",
        title: "Sentence Builder",
        description:
          "JavaFX desktop app with SQLite-backed n-gram statistics and stochastic state transitions for interactive, model-style text generation from raw corpora.",
        tags: ["Java", "JavaFX", "SQLite", "Stochastic Models"],
        links: {},
        highlights: [
          "Persistent SQLite layer for n-gram transitions, aligned with how larger language models represent sequence statistics.",
          "Bridged raw text ingestion with interactive, state-driven generation in the UI.",
        ],
        detail: {
          problemOrGoal:
            "Parse unstructured text and simulate probabilistic language generation from learned statistics in a usable desktop tool.",
          whatIBuilt: [
            "JavaFX application with SQLite storage for word frequencies and transition counts.",
            "Stochastic transition model using state matrices to drive generation from parsed corpora.",
          ],
          technicalDecisions: [
            "Separated persistence (SQLite) from generation logic so corpora can grow without rewriting the Markov/n-gram core.",
            "Chose explicit transition matrices to make the statistical behavior inspectable and debuggable.",
          ],
        },
        longform: {
          summary:
            "A desktop generator that treats language as a stochastic process over n-grams, with SQLite as the durable store between parsing and interactive output.",
          sections: [
            {
              label: "Ingestion",
              body: "Parsed unstructured files into frequency and transition structures suitable for fast lookup during generation.",
            },
            {
              label: "Model",
              body: "Represented language transitions as stochastic processes with state matrices, echoing the statistical core of modern LM tooling at a smaller scale.",
            },
            {
              label: "Product",
              body: "Wrapped the pipeline in JavaFX so users can load text, inspect behavior, and generate new sentences interactively.",
            },
          ],
        },
      },
      {
        slug: "serenity",
        title: "Serenity — Intelligent Productivity & Wellness Assistant",
        description:
          "Full-stack scheduling + wellness assistant with multi-agent automation, Calendar + Notion integrations, and a real-time dashboard.",
        tags: [
          "React",
          "TypeScript",
          "FastAPI",
          "SQLAlchemy",
          "SQLite",
          "Gemini API",
          "Google Calendar API",
          "Notion API",
        ],
        links: {
          repo: "https://github.com/omesh-s/serenityflow",
        },
        highlights: [
          "Built an 8+ agent automation system for research, planning, audits, and retrospectives from integrated data.",
        ],
        detail: {
          problemOrGoal:
            "Unify scheduling, planning, and wellness into one system that turns real calendar + workspace context into actionable insights and automation.",
          whatIBuilt: [
            "React + TypeScript frontend with a real-time dashboard UX",
            "FastAPI backend with documented REST contracts and structured validation",
            "SQLAlchemy persistence (SQLite, designed to be PostgreSQL-compatible)",
            "Google Calendar + Notion integrations through a unified API layer",
          ],
          technicalDecisions: [
            "Agent-style automation designed as modular workflows, not one giant prompt",
            "Consistent request validation + error contracts to keep debugging predictable",
            "Backend designed to evolve from SQLite → Postgres without schema pain",
          ],
        },
        longform: {
          summary:
            "Serenity is a full-stack assistant that unifies planning, wellness, and automation. It combines structured APIs with agent-style workflows and a polished UI built for daily use.",
          sections: [
            {
              label: "System",
              body: "TypeScript/React frontend paired with a FastAPI backend and SQLAlchemy persistence (SQLite, designed to be PostgreSQL-compatible).",
            },
            {
              label: "Integrations",
              body: "Integrated Google Calendar + Notion through a unified REST layer to surface planning insights, dashboards, and notifications from real user context.",
            },
            {
              label: "Reliability",
              body: "Added structured request validation and consistent error handling across endpoints to improve debuggability and production readiness.",
            },
          ],
        },
      },
      {
        slug: "truthlens",
        title: "TruthLens — AI-generated content detection extension",
        description:
          "Chrome extension + FastAPI backend that flags AI-generated e-commerce listings and reviews using NLP classification.",
        tags: ["Python", "FastAPI", "NLP", "Chrome Extension APIs", "REST APIs", "Docker"],
        links: {
          repo: "https://github.com/AI-Mentorship/TruthLens",
        },
        highlights: [
          "Reduced median API response latency by 45% through profiling, cache optimization, and validation pipeline tightening.",
        ],
        detail: {
          problemOrGoal:
            "Detect and flag AI-generated product listings and reviews to protect consumers from deceptive e-commerce content.",
          whatIBuilt: [
            "FastAPI backend services with documented REST APIs and JSON contracts",
            "NLP-based classification integration and reliable inference endpoints",
            "Delivery leadership: weekly releases, reviews, regression testing habits",
          ],
          technicalDecisions: [
            "Profiled request hot paths and improved latency via cache + validation pipeline optimizations",
            "Stable contracts first: JSON schemas and predictable error shapes",
            "Optimized median latency by 45% without sacrificing correctness",
          ],
        },
        longform: {
          summary:
            "TruthLens protects consumers from deceptive AI-generated e-commerce content. I led a 6-student team and delivered production-ready backend services.",
          sections: [
            {
              label: "Leadership",
              body: "Mentored students on model integration, extension development, and agile delivery cycles with weekly release checkpoints.",
            },
            {
              label: "Backend",
              body: "Shipped FastAPI services with documented REST contracts handling 1,000+ daily requests and predictable response behavior.",
            },
            {
              label: "Performance",
              body: "Reduced latency by profiling request hot paths, tightening cache invalidation, and optimizing validation pipelines.",
            },
          ],
        },
      },
      {
        slug: "stepsync",
        title: "StepSync — AI dance performance analysis tool",
        description:
          "Full-stack AI tool that compares instructor/student videos using pose estimation pipelines and temporal scoring to generate feedback.",
        tags: [
          "Python",
          "OpenPose",
          "MediaPipe",
          "TensorFlow",
          "Computer Vision",
          "Kalman Filtering",
          "Flask",
        ],
        links: {
          // Add repo later if/when public
        },
        highlights: [
          "Achieved 92% synchronization accuracy across 300+ processed videos via smoothing + joint normalization.",
        ],
        detail: {
          problemOrGoal:
            "Compare instructor vs student dance videos and produce accurate movement scores with actionable feedback, despite noisy pose detections.",
          whatIBuilt: [
            "Pose estimation pipeline using OpenPose + MediaPipe for 2D/3D keypoints/angles",
            "Normalization + joint-tracking strategy for fair comparisons",
            "Temporal weighted scoring combining static features + time-series similarity",
          ],
          technicalDecisions: [
            "Kalman filter smoothing to stabilize keypoints under motion blur and occlusion",
            "Normalization to align reference frames between instructor and student",
            "Accuracy tuned for real video variance across 300+ processed pairs",
          ],
        },
        longform: {
          summary:
            "StepSync processes paired .mp4 videos, extracts 2D/3D pose keypoints, and produces nuanced movement accuracy scores with actionable feedback.",
          sections: [
            {
              label: "Pose pipeline",
              body: "Engineered pose estimation using OpenPose + MediaPipe to extract joint keypoints/angles and normalize between instructor and student frames.",
            },
            {
              label: "Stability",
              body: "Applied Kalman filter smoothing and joint-tracking normalization to reduce noise and improve scoring reliability.",
            },
            {
              label: "Scoring",
              body: "Designed a temporal weighted scoring system combining static feature extraction and time-series comparison for nuanced spatial accuracy evaluation.",
            },
          ],
        },
      },
      {
        slug: "calendrai",
        title: "CalendrAI — AI-powered smart calendar",
        description:
          "TypeScript-first calendar app using NLP + OpenAI API for natural-language scheduling, conflict detection, and recurring event management.",
        tags: ["TypeScript", "React", "OpenAI API", "NLP"],
        links: {
          repo: "https://github.com/omesh-s/CalendrAI",
        },
        highlights: [
          "Architected an end-to-end type-safe scheduling flow with a maintainable API integration layer.",
        ],
        detail: {
          problemOrGoal:
            "Make scheduling feel natural: convert text to events, detect conflicts, and manage recurrences without breaking type safety.",
          whatIBuilt: [
            "TypeScript-first React app with a clean integration layer",
            "NLP + OpenAI API workflows for conversational scheduling",
            "Conflict detection + recurring event management flows",
          ],
          technicalDecisions: [
            "Type-safe architecture to keep features extendable and low-regression",
            "Clear separation between UI state and AI parsing/integration logic",
            "Structured software process (proposal → prototype → final delivery)",
          ],
        },
        longform: {
          summary:
            "CalendrAI turns natural language into structured events and resolves conflicts as calendars get dense — built with disciplined software process and TypeScript architecture.",
          sections: [
            {
              label: "NLP scheduling",
              body: "Built a conversational scheduling interface that supports one-time and recurring events through NLP input and OpenAI-powered parsing.",
            },
            {
              label: "Conflicts",
              body: "Implemented conflict detection and resolution patterns so event creation remains reliable under overlapping schedules.",
            },
            {
              label: "Architecture",
              body: "Structured components and integrations with strong types to keep the codebase easy to extend without regressions.",
            },
          ],
        },
      },
      {
        slug: "crochet-converter",
        title: "AI-powered crochet pattern converter",
        description:
          "ML-backed multilingual text classification exposed via REST APIs with a responsive React frontend and reliable production deployments.",
        tags: ["React", "TensorFlow", "REST APIs", "Caching", "GitHub Pages"],
        links: {
          repo: "https://github.com/omesh-s/crochet-pattern-new",
        },
        highlights: [
          "Reduced end-to-end conversion latency by 60% by optimizing batching, caching, and labeling workflows.",
        ],
        detail: {
          problemOrGoal:
            "Convert and edit crochet patterns with multilingual support, while keeping latency low enough for real-time browser use.",
          whatIBuilt: [
            "Multilingual text classification pipeline surfaced through REST APIs",
            "Responsive React frontend shipped to GitHub Pages",
            "Batching + caching improvements to reduce conversion latency",
          ],
          technicalDecisions: [
            "Latency-first optimization: reduced conversion time by 60%",
            "Caching strategy to avoid recomputation across repeated conversions",
            "Release discipline with multiple production deployments",
          ],
        },
        longform: {
          summary:
            "A browser-based tool for converting and editing crochet patterns with multilingual support, built with real deployment discipline and performance tuning.",
          sections: [
            {
              label: "ML pipeline",
              body: "Trained and deployed a multilingual classification pipeline and surfaced model outputs through REST APIs for real-time pattern conversion.",
            },
            {
              label: "Latency",
              body: "Optimized batching and caching to reduce conversion time while supporting 100+ translations post-launch.",
            },
            {
              label: "Shipping",
              body: "Deployed repeatedly to GitHub Pages with a stable release process and consistent UX across devices.",
            },
          ],
        },
      },
    ] satisfies FeaturedProject[],
  },
  timeline: {
    title: "Experience",
    items: [
      {
        title: "Generative AI Engineer Extern — AI Document Intelligence",
        org: "Pfizer",
        date: "Apr 2026 – Present",
        details: [
          "Architect production-grade multimodal extraction pipelines that turn diverse vendor documents into schema-validated JSON for enterprise consumers.",
          "Apply Tesseract/PaddleOCR and LlamaIndex for retrieval and semantic search across complex document sets.",
          "Engineer evaluation harnesses for p99 latency, tokens/sec, and accuracy; improved production-readiness timelines by 40%.",
        ],
      },
      {
        title: "Artificial Intelligence Mentor — TruthLens",
        org: "AI Mentorship Program @ UTD AIS",
        date: "Aug 2025 – Dec 2025",
        details: [
          "Led a team of 6 students building and shipping an AI-detection Chrome extension for e-commerce trust.",
          "Architected FastAPI backend services with documented REST APIs and JSON contracts (1,000+ daily requests).",
          "Reduced median API response latency by 45% via profiling hot paths and optimizing cache/validation pipelines.",
        ],
      },
      {
        title: "Technical Lead Consultant",
        org: "Consult Your Community @ UT Dallas (All Ears Autism Services)",
        date: "Jan 2025 – May 2025",
        details: [
          "Led a 4-person team delivering a production React website from scratch for a nonprofit client.",
          "Implemented GitHub Actions CI/CD with Jest tests and GitHub Pages deployment.",
          "Created documentation (architecture + maintenance guide) enabling non-technical staff to maintain the site.",
        ],
      },
    ] satisfies TimelineItem[],
  },
} as const;

