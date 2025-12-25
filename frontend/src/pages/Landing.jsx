import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';

function Landing () {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* 🌄 Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d')",
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-indigo-900/90 to-black/90" />

      {/* Content */}
      <div className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        {/* HERO SECTION */}
        <motion.div
          initial={{opacity: 0, y: 40}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.9}}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Organize Your Work <br />
            <span className="text-blue-300">
              The Smart & Visual Way
            </span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100 mb-10">
            TaskFlow is a modern task management platform that helps
            you plan, track, and complete tasks efficiently using a
            clean Kanban-style workflow.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.div whileHover={{scale: 1.08}} whileTap={{scale: 0.95}}>
              <Link
                to="/login"
                className="inline-block px-10 py-4 rounded-2xl
                 bg-white text-blue-700 font-bold
                 shadow-xl hover:bg-blue-100 transition"
              >
                Sign In
              </Link>
            </motion.div>

            <motion.div whileHover={{scale: 1.08}} whileTap={{scale: 0.95}}>
              <Link
                to="/register"
                className="inline-block px-10 py-4 rounded-2xl
                 bg-gradient-to-r from-blue-500 to-indigo-600
                 text-white font-bold shadow-xl
                 hover:from-blue-600 hover:to-indigo-700 transition"
              >
                Get Started Free
              </Link>
            </motion.div>
          </div>

        </motion.div>

        {/* FEATURES SECTION */}
        <motion.div
          initial={{opacity: 0, y: 40}}
          whileInView={{opacity: 1, y: 0}}
          transition={{duration: 0.8}}
          viewport={{once: true}}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-10"
        >
          {[
            {
              title: '📌 Smart Task Management',
              desc: 'Create, update, and organize tasks effortlessly with a clean and intuitive interface.',
            },
            {
              title: '🗂️ Kanban Board',
              desc: 'Visualize your workflow using Todo, In Progress, and Done columns with drag & drop.',
            },
            {
              title: '🔐 Secure & Reliable',
              desc: 'JWT-based authentication ensures your data stays private and protected.',
            },
          ].map ((item, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-lg"
            >
              <h3 className="text-xl font-bold mb-3">
                {item.title}
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </motion.div>

        {/* STATS SECTION */}
        <motion.div
          initial={{opacity: 0}}
          whileInView={{opacity: 1}}
          transition={{duration: 0.8}}
          viewport={{once: true}}
          className="mt-28 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center"
        >
          <div>
            <p className="text-4xl font-extrabold">⚡</p>
            <p className="text-lg font-semibold mt-2">
              Faster Productivity
            </p>
          </div>
          <div>
            <p className="text-4xl font-extrabold">📈</p>
            <p className="text-lg font-semibold mt-2">
              Clear Progress Tracking
            </p>
          </div>
          <div>
            <p className="text-4xl font-extrabold">🎯</p>
            <p className="text-lg font-semibold mt-2">
              Focused Workflows
            </p>
          </div>
        </motion.div>

        {/* FOOTER */}
        <div className="mt-32 text-center text-blue-200 text-sm">
          <p>
            TaskFlow • Built with ❤️ using MERN Stack
          </p>
          <p className="mt-1">
            Designed for students, developers & professionals
          </p>
        </div>
      </div>
    </div>
  );
}

export default Landing;
