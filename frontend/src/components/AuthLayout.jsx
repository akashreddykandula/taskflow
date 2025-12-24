import {motion} from 'framer-motion';

function AuthLayout({title, subtitle, children}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-900 px-4">
      <motion.div
        initial={{opacity: 0, y: 40}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.6}}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-col justify-center p-10 bg-gradient-to-br from-blue-500 to-blue-800 text-white relative">
          <h1 className="text-4xl font-bold mb-4">WELCOME</h1>
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className="text-blue-100 text-sm">
            {subtitle}
          </p>

          {/* Decorative circles */}
          <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-blue-400 rounded-full opacity-30" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-300 rounded-full opacity-40" />
        </div>

        {/* RIGHT PANEL */}
        <div className="p-8 md:p-12 flex items-center justify-center">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export default AuthLayout;
