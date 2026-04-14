import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const NAV_ITEMS = [
  { id: "home", label: "Главная" },
  { id: "history", label: "История" },
  { id: "persons", label: "Личности" },
  { id: "archive", label: "Архив" },
  { id: "gallery", label: "Галерея" },
  { id: "documents", label: "Документы" },
  { id: "contacts", label: "Контакты" },
];

const TIMELINE_EVENTS = [
  { year: "1782", title: "Основание поселения", desc: "Первые документальные упоминания о поселении в писцовых книгах губернии." },
  { year: "1834", title: "Строительство церкви", desc: "Возведение Покровской церкви, ставшей духовным центром округи." },
  { year: "1861", title: "Реформа отмены крепостного права", desc: "Крестьяне получают вольную грамоту, начало нового экономического уклада." },
  { year: "1905", title: "Открытие земской школы", desc: "В селе открывается первое учебное заведение — трёхклассная земская школа." },
  { year: "1941", title: "Великая Отечественная война", desc: "Более 200 жителей ушли на фронт, 87 из них не вернулись домой." },
  { year: "1965", title: "Колхоз-миллионер", desc: "Местный колхоз удостоен ордена Трудового Красного Знамени за рекордный урожай." },
];

const NOTABLE_PERSONS = [
  {
    name: "Дмитрий Иванович Соколов",
    years: "1845–1921",
    role: "Земский врач",
    desc: "Основал первую земскую больницу, лечил жителей трёх уездов на протяжении 40 лет.",
    initials: "ДС",
  },
  {
    name: "Анна Петровна Морозова",
    years: "1888–1957",
    role: "Учительница, краевед",
    desc: "Собрала уникальный архив документов и фотографий, автор рукописной летописи села.",
    initials: "АМ",
  },
  {
    name: "Николай Фёдорович Крылов",
    years: "1901–1943",
    role: "Герой Советского Союза",
    desc: "Командир стрелкового батальона, погиб при обороне Сталинграда. Имя носит центральная улица.",
    initials: "НК",
  },
  {
    name: "Евдокия Семёновна Власова",
    years: "1912–1994",
    role: "Хранительница традиций",
    desc: "Мастер народной вышивки, её работы хранятся в региональном музее народного творчества.",
    initials: "ЕВ",
  },
];

const ARCHIVE_ITEMS = [
  { type: "Документ", title: "Ревизская сказка 1795 года", year: "1795", tags: ["перепись", "крестьяне"] },
  { type: "Грамота", title: "Жалованная грамота на земли", year: "1812", tags: ["земля", "поместье"] },
  { type: "Список", title: "Метрическая книга прихода", year: "1856–1880", tags: ["рождения", "браки"] },
  { type: "Акт", title: "Протокол схода крестьян", year: "1861", tags: ["реформа", "вольная"] },
  { type: "Письмо", title: "Письма с фронта 1942–1944 гг.", year: "1942–1944", tags: ["война", "солдаты"] },
  { type: "Документ", title: "Похозяйственная книга колхоза", year: "1946–1960", tags: ["хозяйство", "колхоз"] },
];

const GALLERY_ITEMS = [
  { title: "Вид на село с холма", year: "~1910", aspect: "wide" },
  { title: "Покровская церковь", year: "1930", aspect: "tall" },
  { title: "Базарная площадь", year: "~1905", aspect: "square" },
  { title: "Земская школа", year: "1912", aspect: "square" },
  { title: "Колхозный двор", year: "1955", aspect: "wide" },
  { title: "Ветераны у обелиска", year: "1965", aspect: "square" },
];

const ALL_SEARCHABLE = [
  ...ARCHIVE_ITEMS.map(i => ({ category: "Архив", title: i.title, sub: i.year, id: "archive" })),
  ...NOTABLE_PERSONS.map(i => ({ category: "Личности", title: i.name, sub: i.role, id: "persons" })),
  ...TIMELINE_EVENTS.map(i => ({ category: "История", title: i.title, sub: i.year, id: "history" })),
];

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof ALL_SEARCHABLE>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const results = ALL_SEARCHABLE.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.sub.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
    setSearchResults(results);
  }, [searchQuery]);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const highlight = (text: string) => {
    if (!searchQuery.trim()) return <>{text}</>;
    const idx = text.toLowerCase().indexOf(searchQuery.toLowerCase());
    if (idx === -1) return <>{text}</>;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="search-highlight">{text.slice(idx, idx + searchQuery.length)}</mark>
        {text.slice(idx + searchQuery.length)}
      </>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f0e6d0" }}>

      {/* Header */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: "linear-gradient(180deg, #1c1208 0%, #2a1c0e 100%)",
          borderBottom: "2px solid #c9a84c",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => scrollTo("home")}
            className="flex items-center gap-3 group"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <div
              className="w-10 h-10 flex items-center justify-center"
              style={{ border: "1.5px solid #c9a84c" }}
            >
              <span style={{ color: "#c9a84c", fontFamily: "Cormorant, serif", fontSize: "20px", fontWeight: 600 }}>А</span>
            </div>
            <div className="text-left hidden sm:block">
              <div style={{ color: "#f4ead8", fontFamily: "Cormorant, serif", fontSize: "18px", fontWeight: 600, lineHeight: 1.1 }}>
                Исторический архив
              </div>
              <div style={{ color: "#c9a84c", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Портал истории
              </div>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-6">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="nav-link text-sm"
                style={{
                  color: activeSection === item.id ? "#c9a84c" : "#d4c4a4",
                  fontFamily: "IBM Plex Sans, sans-serif",
                  letterSpacing: "0.04em",
                  fontWeight: activeSection === item.id ? 500 : 400,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  paddingBottom: "2px",
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => { setShowSearch(!showSearch); setTimeout(() => searchRef.current?.focus(), 100); }}
                style={{ color: "#c9a84c", background: "none", border: "none", cursor: "pointer", padding: "4px" }}
              >
                <Icon name="Search" size={18} />
              </button>
              {showSearch && (
                <div className="absolute right-0 top-8" style={{ width: "320px", zIndex: 100 }}>
                  <div style={{ background: "#f4ead8", border: "1px solid #c9a84c", boxShadow: "0 8px 32px rgba(28,18,8,0.25)" }}>
                    <div className="flex items-center px-3 py-2 gap-2" style={{ borderBottom: "1px solid #d4c4a4" }}>
                      <Icon name="Search" size={14} />
                      <input
                        ref={searchRef}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Поиск по архиву..."
                        style={{
                          flex: 1, background: "none", border: "none", outline: "none",
                          fontFamily: "IBM Plex Sans, sans-serif", fontSize: "13px", color: "#1c1410",
                        }}
                      />
                      <button onClick={() => { setShowSearch(false); setSearchQuery(""); }} style={{ color: "#8b6330", background: "none", border: "none", cursor: "pointer" }}>
                        <Icon name="X" size={14} />
                      </button>
                    </div>
                    {searchResults.length > 0 && (
                      <div style={{ maxHeight: "280px", overflowY: "auto" }}>
                        {searchResults.map((r, i) => (
                          <button
                            key={i}
                            onClick={() => { scrollTo(r.id); setShowSearch(false); setSearchQuery(""); }}
                            className="w-full text-left px-3 py-2"
                            style={{ display: "block", borderBottom: "1px solid #e8d8b8", cursor: "pointer", background: "none", border: "none" }}
                            onMouseEnter={e => (e.currentTarget.style.background = "#f0e8d0")}
                            onMouseLeave={e => (e.currentTarget.style.background = "none")}
                          >
                            <div style={{ fontSize: "10px", color: "#8b6330", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1px" }}>{r.category}</div>
                            <div style={{ fontSize: "13px", color: "#1c1410", fontFamily: "Cormorant, serif" }}>{highlight(r.title)}</div>
                            <div style={{ fontSize: "11px", color: "#6b4a22" }}>{r.sub}</div>
                          </button>
                        ))}
                      </div>
                    )}
                    {searchQuery.length >= 2 && searchResults.length === 0 && (
                      <div style={{ padding: "16px", textAlign: "center", fontSize: "13px", color: "#8b6330", fontStyle: "italic" }}>
                        Ничего не найдено
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <button
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: "#c9a84c", background: "none", border: "none", cursor: "pointer" }}
            >
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div style={{ background: "#1c1208", borderTop: "1px solid #4a3420" }}>
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="block w-full text-left px-4 py-3"
                style={{
                  color: activeSection === item.id ? "#c9a84c" : "#d4c4a4",
                  background: "none", border: "none", borderBottom: "1px solid #2e1e0e",
                  cursor: "pointer", fontFamily: "IBM Plex Sans, sans-serif", fontSize: "14px",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="home" className="relative overflow-hidden" style={{ minHeight: "92vh" }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://cdn.poehali.dev/projects/ca01b131-0cea-4315-b061-08d3ab2cee70/files/fa941ea3-bf88-4894-a796-b89bdb8ec0cd.jpg)`,
            filter: "sepia(40%) brightness(0.45)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(28,18,8,0.4) 0%, rgba(28,18,8,0.65) 60%, rgba(240,230,208,1) 100%)" }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-center" style={{ minHeight: "92vh", paddingBottom: "80px" }}>
          <div style={{ color: "#c9a84c", letterSpacing: "0.3em", fontSize: "11px", textTransform: "uppercase", marginBottom: "24px", fontFamily: "IBM Plex Sans, sans-serif" }}>
            ◆ &nbsp; Основан в 1782 году &nbsp; ◆
          </div>
          <h1
            style={{
              fontFamily: "Cormorant, serif",
              fontSize: "clamp(42px, 8vw, 88px)",
              fontWeight: 600,
              color: "#f4ead8",
              lineHeight: 1.05,
              textShadow: "2px 4px 12px rgba(0,0,0,0.5)",
              marginBottom: "20px",
            }}
          >
            Хранилище памяти
          </h1>
          <p
            style={{
              fontFamily: "IM Fell English, serif",
              fontSize: "clamp(16px, 2.5vw, 22px)",
              color: "#d4c4a4",
              fontStyle: "italic",
              maxWidth: "600px",
              margin: "0 auto 40px",
              lineHeight: 1.6,
            }}
          >
            Живая летопись, хранящая голоса ушедших поколений, документы минувших эпох и лица тех, кто строил это место.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => scrollTo("archive")}
              style={{
                background: "#c9a84c", color: "#1c1208", border: "none",
                padding: "12px 28px", fontFamily: "IBM Plex Sans, sans-serif",
                fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase",
                cursor: "pointer", fontWeight: 600, transition: "background 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#b8943c")}
              onMouseLeave={e => (e.currentTarget.style.background = "#c9a84c")}
            >
              Открыть архив
            </button>
            <button
              onClick={() => scrollTo("history")}
              style={{
                background: "transparent", color: "#f4ead8",
                border: "1px solid rgba(244,234,216,0.5)",
                padding: "12px 28px", fontFamily: "IBM Plex Sans, sans-serif",
                fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase",
                cursor: "pointer", transition: "border-color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#c9a84c")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(244,234,216,0.5)")}
            >
              Читать историю
            </button>
          </div>

          <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-8 sm:gap-16 px-4">
            {[
              { num: "240+", label: "лет истории" },
              { num: "1 200+", label: "документов" },
              { num: "500+", label: "фотографий" },
              { num: "87", label: "героев войны" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 4vw, 34px)", color: "#c9a84c", fontWeight: 600 }}>{s.num}</div>
                <div style={{ fontSize: "10px", color: "#a09080", letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section id="history" style={{ background: "#f0e6d0", padding: "80px 0" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="section-divider mb-2">
            <span style={{ fontFamily: "Cormorant, serif", fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8b6330" }}>История</span>
          </div>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(32px, 5vw, 52px)", color: "#1c1410", textAlign: "center", fontWeight: 600, marginBottom: "56px" }}>
            Хроника событий
          </h2>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ background: "linear-gradient(to bottom, transparent, #c9a84c 5%, #c9a84c 95%, transparent)", transform: "translateX(-50%)" }} />
            <div className="space-y-10">
              {TIMELINE_EVENTS.map((ev, i) => (
                <div key={i} className={`flex items-start gap-8 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? "text-right" : "text-left"}`}>
                    <div
                      className="inline-block p-4 card-hover"
                      style={{ background: "#f8f0e0", border: "1px solid #c4a882", boxShadow: "0 2px 8px rgba(44,28,14,0.08)", maxWidth: "380px" }}
                    >
                      <div style={{ color: "#c9a84c", fontFamily: "Cormorant, serif", fontSize: "22px", fontWeight: 600 }}>{ev.year}</div>
                      <div style={{ fontFamily: "Cormorant, serif", fontSize: "18px", color: "#1c1410", fontWeight: 500, marginBottom: "6px" }}>{ev.title}</div>
                      <div style={{ fontSize: "13px", color: "#5c4030", lineHeight: 1.6 }}>{ev.desc}</div>
                    </div>
                  </div>
                  <div className="relative z-10 flex-shrink-0">
                    <div style={{ width: "16px", height: "16px", background: "#c9a84c", border: "3px solid #f0e6d0", borderRadius: "50%", boxShadow: "0 0 0 2px #c9a84c" }} />
                  </div>
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Persons */}
      <section id="persons" style={{ background: "#e8d8c0", padding: "80px 0", borderTop: "1px solid #c4a882", borderBottom: "1px solid #c4a882" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-divider mb-2">
            <span style={{ fontFamily: "Cormorant, serif", fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8b6330" }}>Личности</span>
          </div>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(32px, 5vw, 52px)", color: "#1c1410", textAlign: "center", fontWeight: 600, marginBottom: "56px" }}>
            Выдающиеся жители
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {NOTABLE_PERSONS.map((p, i) => (
              <div key={i} className="card-hover" style={{ background: "#f8f0e0", border: "1px solid #c4a882", padding: "28px 20px", textAlign: "center" }}>
                <div
                  style={{
                    width: "64px", height: "64px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #8b6330, #c9a84c)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px",
                    fontFamily: "Cormorant, serif", fontSize: "22px", color: "#f4ead8", fontWeight: 600,
                    boxShadow: "0 2px 8px rgba(44,28,14,0.2)",
                  }}
                >
                  {p.initials}
                </div>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: "18px", color: "#1c1410", fontWeight: 600, marginBottom: "4px" }}>{p.name}</div>
                <div style={{ fontSize: "11px", color: "#c9a84c", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>{p.years}</div>
                <div style={{ fontSize: "12px", color: "#8b6330", fontStyle: "italic", marginBottom: "10px" }}>{p.role}</div>
                <div style={{ fontSize: "12px", color: "#5c4030", lineHeight: 1.6 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Archive */}
      <section id="archive" style={{ background: "#f0e6d0", padding: "80px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-divider mb-2">
            <span style={{ fontFamily: "Cormorant, serif", fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8b6330" }}>Архив</span>
          </div>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(32px, 5vw, 52px)", color: "#1c1410", textAlign: "center", fontWeight: 600, marginBottom: "16px" }}>
            Архивные фонды
          </h2>
          <p style={{ textAlign: "center", color: "#6b4a22", fontSize: "15px", marginBottom: "48px", fontFamily: "IM Fell English, serif", fontStyle: "italic" }}>
            Оцифрованные документы, доступные для изучения
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ARCHIVE_ITEMS.map((item, i) => (
              <div key={i} className="card-hover" style={{ background: "#f8f0e0", border: "1px solid #c4a882", padding: "20px" }}>
                <div className="flex items-start gap-3 mb-3">
                  <div style={{ background: "#c9a84c", padding: "6px 10px", fontSize: "10px", color: "#1c1208", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, flexShrink: 0 }}>
                    {item.type}
                  </div>
                  <div style={{ fontSize: "12px", color: "#8b6330", marginLeft: "auto", flexShrink: 0 }}>{item.year}</div>
                </div>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: "17px", color: "#1c1410", fontWeight: 500, marginBottom: "10px" }}>{item.title}</div>
                <div className="flex gap-2 flex-wrap">
                  {item.tags.map((t, j) => (
                    <span key={j} style={{ fontSize: "11px", color: "#8b6330", background: "rgba(201,168,76,0.15)", padding: "2px 8px", border: "1px solid rgba(201,168,76,0.3)" }}>
                      {t}
                    </span>
                  ))}
                </div>
                <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #d4c4a4" }}>
                  <button style={{ fontSize: "12px", color: "#8b6330", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", padding: 0 }}>
                    <Icon name="FileText" size={13} />
                    Открыть документ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" style={{ background: "#2a1c0e", padding: "80px 0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-divider mb-2">
            <span style={{ fontFamily: "Cormorant, serif", fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a84c" }}>Галерея</span>
          </div>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(32px, 5vw, 52px)", color: "#f4ead8", textAlign: "center", fontWeight: 600, marginBottom: "48px" }}>
            Фотолетопись
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {GALLERY_ITEMS.map((item, i) => (
              <div
                key={i}
                className="card-hover relative overflow-hidden group cursor-pointer"
                style={{
                  aspectRatio: item.aspect === "wide" ? "16/9" : item.aspect === "tall" ? "3/4" : "1",
                  background: "#1c1208", border: "1px solid #4a3420",
                }}
              >
                <div
                  style={{
                    position: "absolute", inset: 0,
                    background: `linear-gradient(135deg, hsl(${25 + i * 8}, 40%, ${18 + i * 3}%) 0%, #1c1208 100%)`,
                    opacity: 0.9,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Icon name="Image" size={28} style={{ color: "#4a3420" }} />
                </div>
                <div
                  className="absolute inset-0 flex flex-col justify-end p-3"
                  style={{ background: "linear-gradient(to top, rgba(28,18,8,0.95), transparent)", opacity: 0, transition: "opacity 0.3s" }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
                >
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: "14px", color: "#f4ead8", fontWeight: 500 }}>{item.title}</div>
                  <div style={{ fontSize: "11px", color: "#c9a84c" }}>{item.year}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents */}
      <section id="documents" style={{ background: "#f0e6d0", padding: "80px 0" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="section-divider mb-2">
            <span style={{ fontFamily: "Cormorant, serif", fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8b6330" }}>Документы</span>
          </div>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(32px, 5vw, 52px)", color: "#1c1410", textAlign: "center", fontWeight: 600, marginBottom: "48px" }}>
            Исторические документы
          </h2>

          <div className="space-y-3">
            {[
              { icon: "Scroll", title: "Летопись прихода Покровской церкви", period: "1782–1917", size: "184 стр.", category: "Церковные документы" },
              { icon: "BookOpen", title: "Книга памяти погибших в Великой Отечественной войне", period: "1941–1945", size: "87 имён", category: "Военные документы" },
              { icon: "Map", title: "Карты и планы поселения XIX века", period: "1820–1900", size: "12 листов", category: "Картографические материалы" },
              { icon: "FileText", title: "Протоколы земских собраний", period: "1864–1917", size: "320 стр.", category: "Административные документы" },
              { icon: "Camera", title: "Фотографический архив семьи Морозовых", period: "1900–1960", size: "140 снимков", category: "Фотоматериалы" },
            ].map((doc, i) => (
              <div key={i} className="card-hover flex items-center gap-4 p-4" style={{ background: "#f8f0e0", border: "1px solid #c4a882" }}>
                <div style={{ width: "40px", height: "40px", background: "rgba(201,168,76,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid rgba(201,168,76,0.3)" }}>
                  <Icon name={doc.icon} size={18} style={{ color: "#8b6330" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: "17px", color: "#1c1410", fontWeight: 500 }}>{doc.title}</div>
                  <div style={{ fontSize: "12px", color: "#8b6330" }}>{doc.category} · {doc.period} · {doc.size}</div>
                </div>
                <button
                  style={{ flexShrink: 0, background: "none", border: "1px solid #c9a84c", color: "#8b6330", padding: "6px 14px", fontSize: "12px", cursor: "pointer", fontFamily: "IBM Plex Sans, sans-serif", letterSpacing: "0.05em" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#c9a84c"; e.currentTarget.style.color = "#1c1208"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#8b6330"; }}
                >
                  Просмотр
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacts */}
      <section id="contacts" style={{ background: "#e8d8c0", padding: "80px 0", borderTop: "1px solid #c4a882" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="section-divider mb-2">
            <span style={{ fontFamily: "Cormorant, serif", fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8b6330" }}>Контакты</span>
          </div>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(32px, 5vw, 52px)", color: "#1c1410", fontWeight: 600, marginBottom: "16px" }}>
            Связаться с архивом
          </h2>
          <p style={{ color: "#6b4a22", fontFamily: "IM Fell English, serif", fontStyle: "italic", fontSize: "16px", marginBottom: "48px" }}>
            Если вы располагаете историческими материалами или хотите получить справку
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              { icon: "MapPin", label: "Адрес", value: "с. Покровское, ул. Центральная, 12\nМузей истории" },
              { icon: "Clock", label: "Часы работы", value: "Пн–Пт: 10:00–17:00\nСб: 10:00–14:00" },
              { icon: "Mail", label: "Электронная почта", value: "archive@pokrovskoye.ru" },
            ].map((c, i) => (
              <div key={i} style={{ background: "#f8f0e0", border: "1px solid #c4a882", padding: "24px 20px" }}>
                <div style={{ width: "40px", height: "40px", background: "rgba(201,168,76,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", border: "1px solid rgba(201,168,76,0.3)" }}>
                  <Icon name={c.icon} size={18} style={{ color: "#8b6330" }} />
                </div>
                <div style={{ fontSize: "11px", color: "#c9a84c", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>{c.label}</div>
                <div style={{ fontSize: "14px", color: "#1c1410", lineHeight: 1.6, whiteSpace: "pre-line" }}>{c.value}</div>
              </div>
            ))}
          </div>

          <div style={{ maxWidth: "520px", margin: "0 auto" }}>
            <div style={{ background: "#f8f0e0", border: "1px solid #c4a882", padding: "32px" }}>
              <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "22px", color: "#1c1410", marginBottom: "20px" }}>Написать сообщение</h3>
              <div className="space-y-3">
                <input
                  placeholder="Ваше имя"
                  style={{ width: "100%", background: "#f0e6d0", border: "1px solid #c4a882", padding: "10px 14px", fontFamily: "IBM Plex Sans, sans-serif", fontSize: "14px", color: "#1c1410", outline: "none", boxSizing: "border-box" }}
                />
                <input
                  placeholder="Электронная почта"
                  style={{ width: "100%", background: "#f0e6d0", border: "1px solid #c4a882", padding: "10px 14px", fontFamily: "IBM Plex Sans, sans-serif", fontSize: "14px", color: "#1c1410", outline: "none", boxSizing: "border-box" }}
                />
                <textarea
                  placeholder="Ваше сообщение или запрос..."
                  rows={4}
                  style={{ width: "100%", background: "#f0e6d0", border: "1px solid #c4a882", padding: "10px 14px", fontFamily: "IBM Plex Sans, sans-serif", fontSize: "14px", color: "#1c1410", outline: "none", resize: "vertical", boxSizing: "border-box" }}
                />
                <button
                  style={{
                    width: "100%", background: "#1c1208", color: "#f4ead8", border: "none",
                    padding: "12px", fontFamily: "IBM Plex Sans, sans-serif", fontSize: "13px",
                    letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontWeight: 500,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#8b6330")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#1c1208")}
                >
                  Отправить запрос
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#1c1208", borderTop: "2px solid #c9a84c", padding: "32px 0" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div style={{ fontFamily: "Cormorant, serif", fontSize: "16px", color: "#d4c4a4" }}>
            Исторический архив · с. Покровское
          </div>
          <div style={{ fontSize: "11px", color: "#6b4a22", letterSpacing: "0.08em" }}>
            © {new Date().getFullYear()} · Хранилище памяти поколений
          </div>
          <div className="flex gap-4">
            {NAV_ITEMS.slice(1, 5).map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                style={{ color: "#8b6330", background: "none", border: "none", cursor: "pointer", fontSize: "12px", fontFamily: "IBM Plex Sans, sans-serif" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#c9a84c")}
                onMouseLeave={e => (e.currentTarget.style.color = "#8b6330")}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}