import 'server-only';
import fs from 'fs';
import path from 'path';

// =========================================================
//  TIPE DATA
// =========================================================

export type HeroSlide = {
  id: string;
  /** Label kecil di atas judul, cth: "EST. 2026 · BANDUNGAN" */
  eyebrow: string;
  /** Baris-baris judul. Baris terakhir otomatis jadi warna aksen (kuning). */
  titleLines: string[];
  subtitle: string;
  /** Path gambar produk, cth: /assets/products/es-kopi-susu.png */
  image: string;
  productName: string;
  productPrice: number;
  ctaLabel: string;
  ctaHref: string;
};

export type Drink = {
  id: string;
  name: string;
  category: 'signature' | 'coffee' | 'non-coffee' | 'tea';
  description: string;
  price: number; // IDR
  image?: string;
  /** Warna gradient swatch (pengganti preview 3D) */
  colors: { top: string; middle: string; bottom: string };
  tags?: string[];
  /** Tampilkan di FeaturedDrinks (home) */
  featured?: boolean;
};

export type ShowcaseSlide = {
  id: string;
  /** Path gambar full-width, ideal 1920x1080 atau 4:3 produk */
  image: string;
  /** Label kecil di atas (mono) */
  eyebrow: string;
  /** Judul besar */
  title: string;
  /** Subjudul / deskripsi singkat */
  subtitle: string;
  /** Harga (opsional, tampil sebagai badge) */
  price?: number;
  /** Link saat diklik */
  href: string;
};

export type StoryChapter = {
  id: string;
  time: string;
  title: string;
  body: string;
  image: string;
  /** Warna overlay tint atas foto (efek mood per-chapter) */
  tintFrom: string;
  tintTo: string;
};

export type SiteInfo = {
  address: string;
  /* Live Chat */
  chatGreeting: string;
  chatPlaceholder: string;
  /* Promo Popup */
  promoEnabled: boolean;
  promoTitle: string;
  promoSubtitle: string;
  promoCode: string;
  promoExpiry: string;   // ISO date string, cth: "2026-12-31"
  promoBgImage: string;  // path gambar background landscape popup
  promoBadge: string;    // cth: "SPECIAL OFFER"
  promoNote: string;     // syarat & ketentuan singkat
  mapsUrl: string;
  lat: string;
  lng: string;
  altitude: string;
  hoursWeekday: string;
  hoursFriday: string;
  hoursWeekend: string;
  whatsapp: string;
  email: string;
  instagram: string;
  tiktok: string;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: 'cerita' | 'kopi' | 'event' | 'tips';
  author: string;
  publishedAt: string;
  featured: boolean;
  readingTime: number;
};

export type SiteContent = {
  hero: { slides: HeroSlide[] };
  showcase: { slides: ShowcaseSlide[] };
  drinks: Drink[];
  story: { chapters: StoryChapter[] };
  articles: Article[];
  site: SiteInfo;
};

// =========================================================
//  DEFAULT / SEED CONTENT
// =========================================================

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    slides: [
      {
        id: 'kopi-susu',
        eyebrow: 'EST. 2026 · BANDUNGAN',
        titleLines: ['COFFEE', 'WITH A', 'VIEW.'],
        subtitle:
          'Specialty coffee dari sebuah rooftop kecil di kaki gunung. Pemandangan datang gratis. Lapisan kopinya, kami yang racik.',
        image: '/assets/products/es-kopi-susu.png',
        productName: 'Es Kopi Susu Gula Aren',
        productPrice: 25000,
        ctaLabel: 'Lihat Menu',
        ctaHref: '/menu',
      },
      {
        id: 'cookies-cream',
        eyebrow: 'HOUSE SIGNATURE',
        titleLines: ['SWEET', 'ENOUGH', 'TO STAY.'],
        subtitle:
          'Susu segar, krim vanilla, dan remahan biskuit coklat di atas es — lapisan paling manis di hari yang panjang.',
        image: '/assets/products/cookies-cream.png',
        productName: 'Cookies & Cream',
        productPrice: 28000,
        ctaLabel: 'Lihat Menu',
        ctaHref: '/menu',
      },
      {
        id: 'matcha',
        eyebrow: 'CEREMONIAL GRADE',
        titleLines: ['GREEN', 'HOUR,', 'EVERY HOUR.'],
        subtitle:
          'Matcha kelas upacara dikocok dengan susu dingin. Pahit lembut, hijau yang tegas, lapisan susu di dasarnya.',
        image: '/assets/products/matcha-latte.png',
        productName: 'Iced Matcha Latte',
        productPrice: 32000,
        ctaLabel: 'Lihat Menu',
        ctaHref: '/menu',
      },
      {
        id: 'thai-tea',
        eyebrow: 'NO SHAME ORANGE',
        titleLines: ['ORANGE', 'SKIES,', 'ORANGE TEA.'],
        subtitle:
          'Teh hitam diseduh kuat, dipadu susu condensed dan rempah hangat. Sewarna senja di atas Bandungan.',
        image: '/assets/products/thai-tea.png',
        productName: 'Strata Thai Tea',
        productPrice: 24000,
        ctaLabel: 'Lihat Menu',
        ctaHref: '/menu',
      },
    ],
  },

  showcase: {
    slides: [
      {
        id: 'sc-kopi-susu',
        image: '/assets/products/es-kopi-susu.png',
        eyebrow: 'HOUSE FAVOURITE',
        title: 'Es Kopi Susu Aren',
        subtitle: 'Espresso, susu segar, dan gula aren asli Bandungan. Berlapis dan tidak terburu-buru.',
        price: 28000,
        href: '/menu#es-kopi-susu',
      },
      {
        id: 'sc-matcha',
        image: '/assets/products/matcha-latte.png',
        eyebrow: 'MENU UNGGULAN',
        title: 'Matcha Latte',
        subtitle: 'Matcha ceremonial grade dari Uji, dituang perlahan di atas susu dingin. Hijau, pahit, dan pas.',
        price: 32000,
        href: '/menu#matcha-latte',
      },
      {
        id: 'sc-thai-tea',
        image: '/assets/products/thai-tea.png',
        eyebrow: 'CROWD PLEASER',
        title: 'Thai Tea',
        subtitle: 'Teh hitam kuat dengan susu kental manis. Jingga terang, manis pekat, dan bikin balik lagi.',
        price: 25000,
        href: '/menu#thai-tea',
      },
      {
        id: 'sc-cookies',
        image: '/assets/products/cookies-cream.png',
        eyebrow: 'SIGNATURE',
        title: 'Cookies and Cream',
        subtitle: 'Susu segar, krim vanilla, dan remahan cookies Oreo. Untuk yang ingin sedikit berlebih.',
        price: 30000,
        href: '/menu#cookies-cream',
      },
      {
        id: 'sc-rooftop',
        image: '/assets/photos/rooftop-view.png',
        eyebrow: 'THE EXPERIENCE',
        title: 'View yang Tidak Berbayar.',
        subtitle: 'Duduk di ketinggian 720m, menghadap Ungaran. Hanya kopi yang berbayar.',
        href: '/about',
      },
      {
        id: 'sc-team',
        image: '/assets/photos/customers-mountain.png',
        eyebrow: 'STRATA MOMENTS',
        title: 'Tempatmu untuk Berhenti.',
        subtitle: 'Bawa teman, bawa kamera, atau datang sendiri. Semua menemukan tempatnya di sini.',
        href: '/contact',
      },
    ],
  },

  drinks: [
    {
      id: 'cookies-cream',
      name: 'Cookies & Cream',
      category: 'signature',
      description:
        'Susu segar, krim vanilla, dan remahan biskuit coklat di atas es. Lapisan paling manis di hari yang panjang.',
      price: 28000,
      image: '/assets/products/cookies-cream.png',
      colors: { top: '#3a2a20', middle: '#f7f1e3', bottom: '#ffffff' },
      tags: ['popular', 'sweet'],
      featured: true,
    },
    {
      id: 'matcha-latte',
      name: 'Iced Matcha Latte',
      category: 'non-coffee',
      description:
        'Matcha kelas upacara dikocok dengan susu dingin. Pahit lembut, hijau yang tegas, lapisan susu di dasarnya.',
      price: 32000,
      image: '/assets/products/matcha-latte.png',
      colors: { top: '#4a7c3a', middle: '#86b97e', bottom: '#f4f1e8' },
      tags: ['signature'],
      featured: true,
    },
    {
      id: 'es-kopi-susu',
      name: 'Es Kopi Susu Gula Aren',
      category: 'coffee',
      description:
        'Espresso lokal, susu segar, gula aren cair dari Magelang. Aren turun perlahan—lapis demi lapis—ke dasar gelas.',
      price: 25000,
      image: '/assets/products/es-kopi-susu.png',
      colors: { top: '#9c6b3d', middle: '#c89669', bottom: '#f5ebd9' },
      tags: ['popular', 'house-favorite'],
      featured: true,
    },
    {
      id: 'thai-tea',
      name: 'Strata Thai Tea',
      category: 'tea',
      description:
        'Teh hitam diseduh kuat, dipadu susu condensed dan rempah hangat. Oranye yang tidak malu-malu.',
      price: 24000,
      image: '/assets/products/thai-tea.png',
      colors: { top: '#e87b2c', middle: '#f2a248', bottom: '#fde6c2' },
      tags: ['popular'],
      featured: true,
    },
    {
      id: 'caramel-macchiato',
      name: 'Caramel Macchiato',
      category: 'coffee',
      description:
        'Espresso, susu kukus, dan saus karamel. Lapisan karamel tipis di atas crema yang tegas.',
      price: 32000,
      colors: { top: '#a87232', middle: '#d4b893', bottom: '#f5ebd9' },
    },
    {
      id: 'flat-white',
      name: 'Flat White',
      category: 'coffee',
      description:
        'Double ristretto dengan microfoam susu yang tipis. Untuk yang serius pada espresso.',
      price: 27000,
      colors: { top: '#c9a47b', middle: '#8a5a2e', bottom: '#5b3818' },
    },
    {
      id: 'mocha-frapp',
      name: 'Mocha Frappé',
      category: 'signature',
      description:
        'Espresso, coklat hitam, dan susu — diblender dengan es sampai mengkilap. Whipped cream optional.',
      price: 33000,
      colors: { top: '#f4f1e8', middle: '#5e3920', bottom: '#3a2419' },
      tags: ['popular'],
    },
    {
      id: 'americano',
      name: 'Iced Americano',
      category: 'coffee',
      description: 'Double espresso, air dingin, es. Selesai. Hitam yang tidak butuh bantuan.',
      price: 22000,
      colors: { top: '#2a1810', middle: '#3a2419', bottom: '#1a0e08' },
    },
    {
      id: 'vanilla-bean',
      name: 'Vanilla Bean Latte',
      category: 'coffee',
      description:
        'Vanilla pod asli, espresso, susu. Lapis manis natural — tanpa sirup tambahan.',
      price: 30000,
      colors: { top: '#e8d7b8', middle: '#c89669', bottom: '#f5ebd9' },
    },
    {
      id: 'hazelnut-brew',
      name: 'Hazelnut Cold Brew',
      category: 'coffee',
      description:
        'Cold brew 16 jam, sirup hazelnut buatan rumah. Smooth, nutty, sedikit memabukkan.',
      price: 29000,
      colors: { top: '#6b3e1f', middle: '#4a2814', bottom: '#2a1810' },
    },
    {
      id: 'lemon-tea',
      name: 'Honey Lemon Tea',
      category: 'tea',
      description:
        'Teh hijau seduhan dingin, madu dari Wonosobo, perasan lemon segar. Bersih.',
      price: 22000,
      colors: { top: '#f4e8a3', middle: '#d4c862', bottom: '#a8985a' },
    },
    {
      id: 'taro',
      name: 'Taro Snow',
      category: 'non-coffee',
      description: 'Talas asli yang dihaluskan, susu, sedikit garam laut. Ungu lembut, manis sekali.',
      price: 28000,
      colors: { top: '#c4a8d8', middle: '#a87dc4', bottom: '#f4f1e8' },
    },
  ],

  story: {
    chapters: [
      {
        id: 'morning',
        time: '06:00 · KABUT TURUN',
        title: 'Pagi dimulai dari rooftop.',
        body:
          'Sebelum cangkir pertama disajikan, kabut sudah lebih dulu duduk di tangga. Kami memanggang biji-biji yang dipetik dari Ijen, Toraja, dan Gayo — pelan-pelan, seperti gunung membuka selimutnya.',
        image: '/assets/photos/exterior-soft-opening.png',
        tintFrom: 'rgba(207,214,220,0.15)',
        tintTo: 'rgba(10,10,11,0.75)',
      },
      {
        id: 'noon',
        time: '13:00 · MATAHARI TINGGI',
        title: 'Lapisan kedua: orang-orang.',
        body:
          'Pelanggan datang seperti aliran ke kali kecil. Ada yang sendirian dengan laptop, ada yang membawa empat teman dan satu kamera. Kami senang dua-duanya. Kopi kami tidak pemilih.',
        image: '/assets/photos/customers-mountain.png',
        tintFrom: 'rgba(230,223,209,0.1)',
        tintTo: 'rgba(10,10,11,0.7)',
      },
      {
        id: 'dusk',
        time: '18:30 · LANGIT BERUBAH JINGGA',
        title: 'View-nya gratis, kopinya yang berbayar.',
        body:
          'Bandungan turun bukan dengan suara, tapi dengan warna. Kalau kamu beruntung dapat kursi pinggir, kamu akan saksikan strata cahaya — pink, jingga, lalu ungu pekat — pindah dari Ungaran ke Sindoro.',
        image: '/assets/photos/rooftop-view.png',
        tintFrom: 'rgba(212,165,116,0.12)',
        tintTo: 'rgba(20,10,20,0.78)',
      },
      {
        id: 'night',
        time: '22:00 · LAMPU MENYALA',
        title: 'Strata buka sampai malam.',
        body:
          'Lampu kabel kami sederhana. Lima belas bohlam, satu trafo, dan tegangan yang kadang bermasalah. Tapi sejauh ini cukup buat menemani anniversary, ulang tahun, dan kejutan-kejutan kecil pelanggan kami.',
        image: '/assets/photos/anniversary-night.png',
        tintFrom: 'rgba(26,36,56,0.25)',
        tintTo: 'rgba(10,10,11,0.85)',
      },
    ],
  },

  articles: [
    {
      id: 'art-001',
      slug: 'mengapa-ketinggian-mengubah-rasa-kopi',
      title: 'Mengapa Ketinggian Mengubah Rasa Kopi',
      excerpt: 'Di 720 meter di atas permukaan laut, air mendidih pada suhu berbeda. Itu mengubah segalanya — dari ekstraksi hingga tekstur foam di permukaan latte kamu.',
      content: '## Air mendidih lebih cepat di ketinggian\n\nDi permukaan laut, air mendidih pada 100\u00b0C. Di Bandungan — 720 meter di atas laut — air mendidih pada sekitar 98\u00b0C. Dua derajat. Kedengarannya kecil, tapi bagi barista, itu signifikan.\n\n## Ekstraksi yang lebih lembut\n\nSuhu air yang lebih rendah berarti proses ekstraksi kopi berlangsung sedikit lebih lambat. Senyawa yang larut pertama kali — asam, gula, minyak aromatik — keluar dalam urutan yang berbeda dibanding di dataran rendah.\n\nHasilnya: kopi yang secara alami lebih ringan di bagian tengah rasa, dengan keasaman yang lebih nyata dan finish yang lebih bersih.\n\n## Apa yang kami lakukan berbeda\n\nKami menyesuaikan grind size sedikit lebih kasar dari standar cafe di kota. Ini mengkompensasi perbedaan suhu supaya rasio ekstraksi tetap seimbang.\n\nKami juga mengandalkan biji dari ketinggian tinggi — Toraja 1.500m, Gayo 1.200m — karena biji dari elevasi tinggi cenderung memiliki kepadatan yang cocok untuk kondisi brewing di sini.\n\n## Foam yang berbeda\n\nTekanan udara yang lebih rendah juga mempengaruhi cara susu di-steam. Gelembung cenderung lebih besar, lebih mudah pecah. Barista kami belajar menyesuaikan sudut pitcher dan durasi steaming untuk mendapat mikro-foam yang tetap lembut.\n\nJadi kalau kamu pernah merasa kopi di Strata rasanya "lebih ringan" dari tempat lain — itu bukan perasaan kamu. Itu fisika.',
      coverImage: '/assets/photos/rooftop-view.png',
      category: 'kopi',
      author: 'Tim Strata',
      publishedAt: '2026-04-10',
      featured: true,
      readingTime: 4,
    },
    {
      id: 'art-002',
      slug: 'soft-opening-30-tamu-satu-trafo',
      title: 'Soft Opening: 30 Tamu, Satu Trafo',
      excerpt: 'Kami membuka pintu dengan 30 kursi, satu trafo tegangan rendah, dan keyakinan bahwa pemandangan gunung itu cukup untuk menutupi semua kekurangan kami.',
      content: '## Rencana vs Kenyataan\n\nKami rencanakan soft opening dengan 20 tamu. Yang datang 31.\n\nKursi cadangan diambil dari rumah tetangga. Satu meja makan plastik biru bergabung dengan meja kayu jati yang kami beli dari tukang loak di Ambarawa. Keduanya berdampingan di dekat railing rooftop, menghadap Ungaran.\n\n## Trafo yang hampir tidak kuat\n\nPukul 19.30, espresso machine, blender, lampu, dan speaker menyala bersamaan. Trafo di tiang listrik depan mengaum. Satu detik kemudian, setengah lampu padam.\n\nKami buru-buru mematikan blender dan speaker. Dua tamu mengira itu bagian dari "ambiance." Kami tidak membantah.\n\n## Yang kami pelajari\n\nInfrastruktur listrik adalah hal pertama yang harus diprioritaskan sebelum ekspansi menu apapun.\n\nTapi lebih dari itu — kami belajar bahwa tamu yang datang ke tempat seperti ini bukan karena kesempurnaan. Mereka datang karena suasana. Karena pemandangan. Karena kopi yang jujur.\n\nMalam itu, dua tamu minta nomor WhatsApp kami untuk reservasi bulan berikutnya. Itu cukup untuk kami terus.',
      coverImage: '/assets/photos/exterior-soft-opening.png',
      category: 'cerita',
      author: 'Pendiri Strata',
      publishedAt: '2026-03-01',
      featured: true,
      readingTime: 3,
    },
    {
      id: 'art-003',
      slug: 'cara-memesan-kopi-rooftop-tanpa-kehabisan-tempat',
      title: 'Cara Memesan Tempat di Strata (Panduan Singkat)',
      excerpt: 'Kami tidak punya sistem reservasi online. Tapi ada cara mudah untuk pastikan kamu dapat kursi terbaik saat sunset tiba.',
      content: '## Kenapa kami belum pakai sistem reservasi online?\n\nJujur — karena kami belum sempat. Tapi sambil menunggu itu, WhatsApp bekerja dengan sangat baik.\n\n## Cara paling simpel\n\nKirim pesan ke nomor WhatsApp kami (ada di bagian Contact) dengan format:\n\n**Nama:** [nama kamu]\n**Tanggal:** [tanggal kunjungan]\n**Jumlah orang:** [berapa orang]\n**Waktu:** [jam berapa datang, sunset mulai jam 17.30]\n\nKami akan konfirmasi dalam 2 jam. Jika penuh, kami akan kasih opsi tanggal alternatif.\n\n## Tips dapat kursi sunset terbaik\n\nKursi yang menghadap langsung ke Ungaran ada di sisi barat rooftop. Kapasitasnya 8 orang. Untuk kursi ini, booking minimal H-1.\n\nKalau kamu datang tanpa booking, datanglah sebelum jam 16.00. Setelah itu, biasanya sudah hampir penuh di weekend.\n\n## Hari dan jam yang lebih sepi\n\nSelasa dan Rabu sore biasanya lebih sepi. Ini waktu yang bagus kalau kamu mau kerja sambil menikmati kopi dan pemandangan tanpa banyak keramaian.\n\nKami selalu menyisakan 2-3 kursi untuk walk-in setiap harinya.',
      coverImage: '/assets/photos/customers-mountain.png',
      category: 'tips',
      author: 'Tim Strata',
      publishedAt: '2026-04-28',
      featured: false,
      readingTime: 3,
    },
    {
      id: 'art-004',
      slug: 'anniversary-night-foto-momen-pelanggan',
      title: 'Anniversary Night: Foto dan Momen Pelanggan',
      excerpt: 'Rooftop kami sudah jadi tempat anniversary, ulang tahun, dan proposal tak terduga. Beberapa momen yang tidak kami rencanakan tapi kami syukuri.',
      content: '## Kami bukan tempat foto\n\nSetidaknya bukan itu yang kami rencanakan dari awal.\n\nTapi ternyata, kombinasi lampu kabel dan pemandangan malam Bandungan dan kopi hangat adalah resep yang cukup ampuh untuk menciptakan momen.\n\n## Momen yang kami ingat\n\nAda pasangan yang datang untuk anniversary ketiga mereka. Mereka memesan Es Kopi Susu Aren dan Thai Tea, duduk di sudut barat, dan tidak bicara banyak. Hanya duduk. Kami pikir itu adalah bentuk kebahagiaan yang paling sunyi.\n\nAda juga grup teman yang merayakan kelulusan S1. Mereka membawa snack dari rumah, kami tidak protes. Yang penting kopinya dari kami.\n\n## Yang kami sediakan untuk momen spesial\n\nKalau kamu merencanakan sesuatu — ulang tahun, anniversary, atau hanya ingin datang dengan suasana yang sedikit lebih istimewa — hubungi kami lebih dulu. Kami bisa menyiapkan meja dengan dekorasi sederhana, memutar playlist yang kamu pilih, dan memastikan kamu dapat kursi terbaik.\n\nGratis. Karena kami senang jadi bagian dari cerita orang.',
      coverImage: '/assets/photos/anniversary-night.png',
      category: 'cerita',
      author: 'Tim Strata',
      publishedAt: '2026-05-12',
      featured: false,
      readingTime: 3,
    },
    {
      id: 'art-005',
      slug: 'mengenal-biji-kopi-yang-kami-gunakan',
      title: 'Mengenal Biji Kopi yang Kami Gunakan',
      excerpt: 'Dari Ijen, Toraja, dan Gayo. Tiga karakter berbeda yang kami blend untuk menciptakan profil rasa khas Strata.',
      content: '## Mengapa tiga origin?\n\nKami tidak menciptakan blend karena ikut tren. Kami menciptakannya karena tidak ada satu biji pun yang sempurna sendirian untuk kondisi brewing di ketinggian 720m.\n\n## Ijen — keasaman yang hidup\n\nBiji dari lereng Ijen di Banyuwangi membawa karakter asam yang cerah, hampir seperti buah tropis. Di ketinggian, karakter ini menjadi tulang punggung brightness dari espresso kami.\n\nSingle origin Ijen bisa terasa terlalu tajam untuk beberapa orang. Di dalam blend, ia menjadi penyeimbang.\n\n## Toraja — body dan kedalaman\n\nBiji Toraja membawa body yang berat, earthy, dengan hint cokelat gelap dan rempah. Ini yang membuat espresso kami terasa penuh di tengah, tidak kosong.\n\n## Gayo — kelembutan dan sweetness\n\nAceh Gayo terkenal di dunia karena karakter herbal dan sweetness alaminya. Biji ini yang membuat aftertaste kopi kami terasa manis meski tanpa gula.\n\n## Proses roasting\n\nKami bekerja sama dengan roastery lokal di Semarang. Profil roasting kami medium-dark — cukup untuk bring out body Toraja, tapi tidak membakar karakter fruity Ijen.\n\nSekali sebulan, kami review ulang hasil cupping untuk memastikan konsistensi.',
      coverImage: '/assets/photos/team-welcome.png',
      category: 'kopi',
      author: 'Barista Kepala',
      publishedAt: '2026-05-20',
      featured: false,
      readingTime: 5,
    },
  ],

  site: {
    address: 'Jl. Kaki Gunung No. 12, Bandungan, Semarang, Jawa Tengah',
    mapsUrl: 'https://maps.google.com/?q=Bandungan+Semarang',
    lat: '-7.2331° S',
    lng: '110.3611° E',
    altitude: '720m',
    hoursWeekday: '15:00 — 23:00',
    hoursFriday: '15:00 — 00:00',
    hoursWeekend: '10:00 — 00:00',
    whatsapp: '6281234567890',
    email: 'hello@stratacoffee.id',
    instagram: 'https://instagram.com/',
    tiktok: 'https://tiktok.com/',
    chatGreeting: 'Halo! ☕ Ada yang bisa kami bantu? Tanya soal menu, reservasi rooftop, atau hal lainnya.',
    chatPlaceholder: 'Ketik pesanmu di sini...',
    promoEnabled: true,
    promoTitle: 'Selamat Datang di Strata!',
    promoSubtitle: 'Dapatkan diskon spesial untuk kunjungan pertamamu. Tunjukkan kode ini ke kasir.',
    promoCode: 'STRATA10',
    promoExpiry: '2026-12-31',
    promoBgImage: '/assets/photos/rooftop-view.png',
    promoBadge: 'PROMO SPESIAL',
    promoNote: '* Berlaku untuk pembelian min. 2 minuman. 1x per pelanggan.',
  },
};

// =========================================================
//  BACA / TULIS FILE JSON
// =========================================================

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'site-content.json');

/** Ambil konten situs. Jika file belum ada, buat dari DEFAULT_CONTENT. */
export function getContent(): SiteContent {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      saveContent(DEFAULT_CONTENT);
      return DEFAULT_CONTENT;
    }
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    // Merge dangkal supaya field baru dari DEFAULT_CONTENT tetap ada
    return {
      hero: parsed.hero ?? DEFAULT_CONTENT.hero,
      showcase: parsed.showcase ?? DEFAULT_CONTENT.showcase,
      drinks: parsed.drinks ?? DEFAULT_CONTENT.drinks,
      story: parsed.story ?? DEFAULT_CONTENT.story,
      articles: parsed.articles ?? DEFAULT_CONTENT.articles,
      site: { ...DEFAULT_CONTENT.site, ...(parsed.site ?? {}) },
    };
  } catch {
    return DEFAULT_CONTENT;
  }
}

/** Simpan konten situs ke file JSON (dipakai admin API). */
export function saveContent(content: SiteContent): void {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(content, null, 2), 'utf-8');
}
