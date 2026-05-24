export const navLinks = [
  { name: "Fitur", href: "#features" },
  { name: "Alur Kerja", href: "#workflow" },
  { name: "Harga", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

export const heroContent = {
  headline: "Otomatisasi Alur Kerja Tanpa Batas dengan Kecepatan Super.",
  subheadline: "Hubungkan seluruh aplikasi bisnis Anda dalam hitungan detik. Tanpa kode, tanpa kerumitan, dengan analitik real-time yang akurat.",
  primaryCta: "Mulai Gratis",
  secondaryCta: "Lihat Demo",
  trustedText: "Dipercaya oleh tim inovatif di dunia",
};

export const bentoFeatures = {
  gridA: {
    title: "Otomatisasi Alur Kerja Multi-Saluran",
    description: "Desain dan otomatisasi proses bisnis dari awal hingga akhir hanya dengan visual node editor yang presisi.",
  },
  gridB: {
    title: "Analitik Real-Time",
    metric: "99.9%",
    description: "Akurasi data super presisi.",
  },
  gridC: {
    title: "Keamanan Enkripsi Lanjutan",
    description: "Data Anda dikunci rapat.",
  }
};

export const pricingData = {
  billingOptions: [
    { id: "monthly", name: "Bulanan", discount: "" },
    { id: "annual", name: "Tahunan", discount: "Hemat 20%" }
  ],
  tiers: [
    {
      name: "Starter",
      price: { monthly: 19, annual: 15 },
      description: "Solusi esensial untuk tim kecil atau pengembang mandiri.",
      features: ["3 Alur Kerja Aktif", "Analitik Dasar", "Integrasi Slack", "Dukungan Komunitas"],
      isPopular: false
    },
    {
      name: "Pro",
      price: { monthly: 49, annual: 39 },
      description: "Skalabilitas penuh dengan otomatisasi tanpa batas untuk bisnis.",
      features: ["Alur Kerja Tak Terbatas", "Analitik Real-Time Lanjutan", "Prioritas API Akses", "Dukungan Email 24/7"],
      isPopular: true
    },
    {
      name: "Enterprise",
      price: { monthly: 199, annual: 159 },
      description: "Keamanan tingkat lanjut dan SLA kustom untuk perusahaan besar.",
      features: ["Semua Fitur Pro", "Manajer Sukses Spesifik", "SSO & SCIM", "SLA Uptime 99.99%"],
      isPopular: false
    }
  ]
};

export const testimonials = [
  {
    name: "Alya Rahman",
    role: "CTO, TechNova",
    content: "Synthetix mengubah cara tim kami bekerja secara fundamental. Menghemat lebih dari 20 jam kerja manual setiap minggunya.",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
  },
  {
    name: "Bima Satria",
    role: "Product Lead, InnovateInc",
    content: "Antarmukanya luar biasa responsif. Membangun alur kerja yang kompleks sekarang terasa seperti menyusun balok lego.",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
  },
  {
    name: "Citra Kirana",
    role: "Marketing Director, ScaleUp",
    content: "Dukungan pelanggan dan komunitas yang luar biasa. Tidak pernah merasa sendirian saat menghadapi kendala.",
    avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d"
  }
];

export const faqData = [
  {
    question: "Apakah saya membutuhkan kartu kredit untuk memulai uji coba?",
    answer: "Tidak. Anda bisa memulai uji coba gratis 14 hari kami tanpa harus memasukkan detail kartu kredit."
  },
  {
    question: "Bisakah saya membatalkan langganan kapan saja?",
    answer: "Tentu. Anda dapat membatalkan, meningkatkan, atau menurunkan paket langganan Anda kapan saja melalui dashboard akun Anda."
  },
  {
    question: "Apakah Synthetix terintegrasi dengan alat yang sudah saya gunakan?",
    answer: "Ya, kami mendukung lebih dari 500+ integrasi dengan aplikasi populer termasuk Slack, Google Workspace, dan Salesforce."
  }
];
