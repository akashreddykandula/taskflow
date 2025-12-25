import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import {useEffect, useState} from 'react';

function Landing () {
  const [scrolled, setScrolled] = useState (false);
  const [activeSection, setActiveSection] = useState ('');
  const [menuOpen, setMenuOpen] = useState (false);

  useEffect (() => {
    const onScroll = () => {
      setScrolled (window.scrollY > 50);

      const sections = ['features', 'workflow', 'pricing', 'about'];
      for (const sec of sections) {
        const el = document.getElementById (sec);
        if (el) {
          const rect = el.getBoundingClientRect ();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection (sec);
          }
        }
      }
    };

    window.addEventListener ('scroll', onScroll);
    return () => window.removeEventListener ('scroll', onScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* NAVBAR */}
      <motion.nav
        initial={{y: -80, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        transition={{duration: 0.6}}
        className={`fixed top-0 left-0 w-full z-50 transition-all ${scrolled ? 'bg-black/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-extrabold text-white">
            Task<span className="text-blue-400">Flow</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {[
              {id: 'features', label: 'Features'},
              {id: 'workflow', label: 'How it Works'},
              {id: 'pricing', label: 'Pricing'},
              {id: 'about', label: 'About'},
            ].map (item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`transition ${activeSection === item.id ? 'text-blue-400' : 'text-blue-100 hover:text-white'}`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMenuOpen (!menuOpen)}
            className="md:hidden text-2xl text-white"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen &&
          <motion.div
            initial={{height: 0, opacity: 0}}
            animate={{height: 'auto', opacity: 1}}
            transition={{duration: 0.3}}
            className="md:hidden bg-black/90 backdrop-blur-lg px-6 py-6 space-y-4"
          >
            {[
              {id: 'features', label: 'Features'},
              {id: 'workflow', label: 'How it Works'},
              {id: 'pricing', label: 'Pricing'},
              {id: 'about', label: 'About'},
            ].map (item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMenuOpen (false)}
                className={`block text-lg transition ${activeSection === item.id ? 'text-blue-400' : 'text-blue-100 hover:text-white'}`}
              >
                {item.label}
              </a>
            ))}
          </motion.div>}
      </motion.nav>

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-indigo-900/90 to-black/90" />

      {/* CONTENT */}
      <div className="relative z-10 px-6 pt-32 pb-20 max-w-7xl mx-auto">
        {/* HERO */}
        <motion.div
          initial={{opacity: 0, y: 40}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.9}}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Organize Your Work <br />
            <span className="text-blue-300">The Smart & Visual Way</span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100 mb-10">
            TaskFlow is a modern task management platform that helps you plan,
            track, and complete tasks efficiently using a Kanban workflow.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/login"
              className="px-10 py-4 rounded-2xl bg-white text-blue-700 font-bold shadow-xl hover:bg-blue-100 transition"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold shadow-xl hover:from-blue-600 hover:to-indigo-700 transition"
            >
              Get Started Free
            </Link>
          </div>
        </motion.div>

        {/* FEATURES */}
        <motion.div
          id="features"
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-10"
        >
          {[
            {
              title: '📌 Smart Task Management',
              desc: 'Create, update, and organize tasks effortlessly.',
            },
            {
              title: '🗂️ Kanban Board',
              desc: 'Visualize workflow with drag & drop.',
            },
            {
              title: '🔐 Secure & Reliable',
              desc: 'JWT-based authentication for safety.',
            },
          ].map ((item, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-lg"
            >
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-blue-100 text-sm">{item.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* WORKFLOW */}
        <motion.div
          id="workflow"
          className="mt-28 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center"
        >
          <div>
            <p className="text-4xl">⚡</p>
            <p className="mt-2 font-semibold">Faster Productivity</p>
          </div>
          <div>
            <p className="text-4xl">📈</p>
            <p className="mt-2 font-semibold">Clear Progress</p>
          </div>
          <div>
            <p className="text-4xl">🎯</p>
            <p className="mt-2 font-semibold">Focused Workflows</p>
          </div>
        </motion.div>

        {/* FOOTER */}
        <div id="about" className="mt-32 text-center text-blue-200 text-sm">
          <p>TaskFlow • Built with ❤️ using MERN Stack</p>
          <p className="mt-1">Designed for students & professionals</p>
        </div>
      </div>
    </div>
  );
}

export default Landing;
